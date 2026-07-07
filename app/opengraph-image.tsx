import { ImageResponse } from "next/og";

export const alt =
  "Monte Deluxe — Luxury Fashion Brand in Port Harcourt, Nigeria";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(ellipse at center, #111008 0%, #050505 70%)",
          color: "#F5F2EB",
        }}
      >
        <div
          style={{
            fontSize: 130,
            letterSpacing: 24,
            color: "#C9A85C",
            display: "flex",
          }}
        >
          MONTÉ
        </div>
        <div
          style={{
            marginTop: 36,
            width: 96,
            height: 1,
            background: "#8E7443",
            display: "flex",
          }}
        />
        <div
          style={{
            marginTop: 36,
            fontSize: 30,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#C8C8C8",
            display: "flex",
          }}
        >
          Luxury Fashion — Port Harcourt, Nigeria
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#B8965A",
            display: "flex",
          }}
        >
          Collection 001 · July 22, 2026
        </div>
      </div>
    ),
    size,
  );
}
