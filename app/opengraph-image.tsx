import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "MONTÈ";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Site-wide fallback OG image: the black logo on the off-white ground.
// Product pages override this with their first photo.
export default async function OpengraphImage() {
  const logo = await readFile(
    join(process.cwd(), "public/images/logo-black.png"),
  );
  const src = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F5F4F0",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={660} height={228} alt="" />
      </div>
    ),
    size,
  );
}
