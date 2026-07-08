import { NextResponse } from "next/server";
import { deleteSubscriber } from "@/lib/services/subscriber.service";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const deleted = await deleteSubscriber(id);

    if (!deleted) {
      return NextResponse.json(
        { status: "error", message: "Subscriber not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("Delete subscriber error:", err);
    return NextResponse.json(
      { status: "error", message: "Failed to delete subscriber." },
      { status: 500 },
    );
  }
}
