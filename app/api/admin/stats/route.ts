import { NextResponse } from "next/server";
import { getStats } from "@/lib/services/subscriber.service";

export async function GET() {
  try {
    const stats = await getStats();
    return NextResponse.json(stats);
  } catch (err) {
    console.error("Stats error:", err);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch stats." },
      { status: 500 },
    );
  }
}
