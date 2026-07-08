import { NextResponse } from "next/server";
import { exportSubscribersCSV } from "@/lib/services/subscriber.service";

export async function GET() {
  try {
    const csv = await exportSubscribersCSV();
    const date = new Date().toISOString().slice(0, 10);

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="monte-subscribers-${date}.csv"`,
      },
    });
  } catch (err) {
    console.error("Export error:", err);
    return NextResponse.json(
      { status: "error", message: "Failed to export subscribers." },
      { status: 500 },
    );
  }
}
