import { NextResponse, type NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { verifyAdminCredentials } from "@/lib/services/auth.service";
import {
  createSessionToken,
  setSessionCookie,
} from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      "unknown";

    const { allowed } = rateLimit(ip, {
      windowMs: 15 * 60_000,
      maxRequests: 5,
    });

    if (!allowed) {
      return NextResponse.json(
        { status: "error", message: "Too many attempts. Please try again later." },
        { status: 429 },
      );
    }

    const body = await request.json().catch(() => null);
    if (!body?.email || !body?.password) {
      return NextResponse.json(
        { status: "error", message: "Email and password are required." },
        { status: 400 },
      );
    }

    const admin = await verifyAdminCredentials(body.email, body.password);
    if (!admin) {
      return NextResponse.json(
        { status: "error", message: "Invalid credentials." },
        { status: 401 },
      );
    }

    const token = await createSessionToken(admin.id);
    const response = NextResponse.json({ status: "ok" });
    setSessionCookie(response, token);
    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { status: "error", message: "Something went wrong." },
      { status: 500 },
    );
  }
}
