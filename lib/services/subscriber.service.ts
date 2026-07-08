import { ObjectId, type Sort } from "mongodb";
import {
  getSubscribersCollection,
  type NewSubscriber,
} from "@/lib/models/subscriber";

export async function createSubscriber(
  data: Omit<NewSubscriber, "subscribedAt" | "source" | "status">,
): Promise<"created" | "exists"> {
  const col = await getSubscribersCollection();

  const doc: NewSubscriber = {
    ...data,
    subscribedAt: new Date(),
    source: "website",
    status: "active",
  };

  try {
    await col.insertOne(doc);
    return "created";
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: number }).code === 11000
    ) {
      return "exists";
    }
    throw err;
  }
}

export interface SubscriberQuery {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  from?: string;
  to?: string;
}

export async function listSubscribers(query: SubscriberQuery) {
  const col = await getSubscribersCollection();

  const page = Math.max(1, query.page ?? 1);
  const limit = Math.min(100, Math.max(1, query.limit ?? 20));
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};

  if (query.search) {
    filter.email = { $regex: query.search, $options: "i" };
  }

  if (query.from || query.to) {
    const dateFilter: Record<string, Date> = {};
    if (query.from) dateFilter.$gte = new Date(query.from);
    if (query.to) {
      const to = new Date(query.to);
      to.setHours(23, 59, 59, 999);
      dateFilter.$lte = to;
    }
    filter.subscribedAt = dateFilter;
  }

  const sortField = query.sort === "email" ? "email" : "subscribedAt";
  const sortDir = query.order === "asc" ? 1 : -1;
  const sort: Sort = { [sortField]: sortDir };

  const [subscribers, total] = await Promise.all([
    col.find(filter).sort(sort).skip(skip).limit(limit).toArray(),
    col.countDocuments(filter),
  ]);

  return {
    subscribers,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function deleteSubscriber(id: string): Promise<boolean> {
  const col = await getSubscribersCollection();
  const result = await col.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}

export async function deleteSubscribers(ids: string[]): Promise<number> {
  const col = await getSubscribersCollection();
  const objectIds = ids.map((id) => new ObjectId(id));
  const result = await col.deleteMany({ _id: { $in: objectIds } });
  return result.deletedCount;
}

export async function getStats() {
  const col = await getSubscribersCollection();

  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

  const [result] = await col
    .aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          today: [
            { $match: { subscribedAt: { $gte: startOfToday } } },
            { $count: "count" },
          ],
          thisWeek: [
            { $match: { subscribedAt: { $gte: startOfWeek } } },
            { $count: "count" },
          ],
          thisMonth: [
            { $match: { subscribedAt: { $gte: startOfMonth } } },
            { $count: "count" },
          ],
          lastMonth: [
            {
              $match: {
                subscribedAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
              },
            },
            { $count: "count" },
          ],
          recent: [
            { $sort: { subscribedAt: -1 } },
            { $limit: 5 },
            {
              $project: {
                email: 1,
                subscribedAt: 1,
                country: 1,
                city: 1,
              },
            },
          ],
        },
      },
    ])
    .toArray();

  const total = result.total[0]?.count ?? 0;
  const today = result.today[0]?.count ?? 0;
  const thisWeek = result.thisWeek[0]?.count ?? 0;
  const thisMonth = result.thisMonth[0]?.count ?? 0;
  const lastMonth = result.lastMonth[0]?.count ?? 0;

  const growthPercent =
    lastMonth > 0
      ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100 * 10) / 10
      : thisMonth > 0
        ? 100
        : 0;

  return {
    total,
    today,
    thisWeek,
    thisMonth,
    growthPercent,
    recentSignups: result.recent,
  };
}

export async function exportSubscribersCSV(): Promise<string> {
  const col = await getSubscribersCollection();
  const subscribers = await col
    .find()
    .sort({ subscribedAt: -1 })
    .toArray();

  const header = "email,subscribedAt,ipAddress,country,city,source,status";
  const rows = subscribers.map((s) => {
    const date = s.subscribedAt.toISOString();
    return [
      s.email,
      date,
      s.ipAddress ?? "",
      s.country ?? "",
      s.city ?? "",
      s.source,
      s.status,
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",");
  });

  return [header, ...rows].join("\n");
}
