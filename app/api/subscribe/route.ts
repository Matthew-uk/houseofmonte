import { NextResponse, type NextRequest } from "next/server";
import { validateEmail } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { createSubscriber } from "@/lib/services/subscriber.service";
import { sendWelcomeEmail } from "@/lib/email/send";

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      "unknown";

    const { allowed, retryAfterMs } = rateLimit(ip, {
      windowMs: 60_000,
      maxRequests: 5,
    });

    if (!allowed) {
      return NextResponse.json(
        {
          status: "error",
          message: "Too many requests. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((retryAfterMs ?? 60_000) / 1000)),
          },
        },
      );
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { status: "error", message: "Invalid request." },
        { status: 400 },
      );
    }

    const result = validateEmail(body.email);
    if (!result.valid) {
      return NextResponse.json(
        { status: "error", message: result.error },
        { status: 400 },
      );
    }

    const country = request.headers.get("x-vercel-ip-country");
    const city = request.headers.get("x-vercel-ip-city");
    const userAgent = request.headers.get("user-agent");

    const outcome = await createSubscriber({
      email: result.email,
      ipAddress: ip !== "unknown" ? ip : null,
      country: country ? decodeURIComponent(country) : null,
      city: city ? decodeURIComponent(city) : null,
      userAgent,
    });

    if (outcome === "created") {
      sendWelcomeEmail(result.email).catch(() => {});
    //   console.log("Email sent!")
      return NextResponse.json(
        { status: "created", message: "Welcome to the list." },
        { status: 201 },
      );
    }

    return NextResponse.json(
      {
        status: "exists",
        message:
          "You’re already on the list. We’ll let you know when Collection 001 launches.",
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json(
      { status: "error", message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
