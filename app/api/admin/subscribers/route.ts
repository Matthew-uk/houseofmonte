import { NextResponse, type NextRequest } from "next/server";
import {
  listSubscribers,
  deleteSubscribers,
} from "@/lib/services/subscriber.service";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;

    const result = await listSubscribers({
      page: params.get("page") ? Number(params.get("page")) : undefined,
      limit: params.get("limit") ? Number(params.get("limit")) : undefined,
      search: params.get("search") ?? undefined,
      sort: params.get("sort") ?? undefined,
      order: (params.get("order") as "asc" | "desc") ?? undefined,
      from: params.get("from") ?? undefined,
      to: params.get("to") ?? undefined,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("List subscribers error:", err);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch subscribers." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body?.ids || !Array.isArray(body.ids) || body.ids.length === 0) {
      return NextResponse.json(
        { status: "error", message: "No IDs provided." },
        { status: 400 },
      );
    }

    const deleted = await deleteSubscribers(body.ids);
    return NextResponse.json({ status: "ok", deleted });
  } catch (err) {
    console.error("Bulk delete error:", err);
    return NextResponse.json(
      { status: "error", message: "Failed to delete subscribers." },
      { status: 500 },
    );
  }
}
