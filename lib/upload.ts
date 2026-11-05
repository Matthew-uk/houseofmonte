// Client for the image upload API (POST multipart, field `images`) and the rule
// for which image URLs the catalogue accepts. The API sends files to Cloudinary
// and answers { uploaded: [{ url, originalName }] }. Browsers call it directly
// because Vercel functions cap request bodies at 4.5 MB.

export const UPLOAD_URL = "https://roomy-backend-duq2.onrender.com/api/upload";

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // Larger files fail upstream.
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const IMAGE_URL = /^(https:\/\/res\.cloudinary\.com\/deguiebas\/image\/upload\/|\/images\/seed\/)[\w\-./%()]+$/;

/** Server-side check: URLs reach the DB from the browser, so never trust them. */
export function isAllowedImageUrl(url: string): boolean {
  return IMAGE_URL.test(url) && !url.includes("..");
}

/** Returns a reason the file can't be uploaded, or null if it's fine. */
export function imageFileProblem(file: Pick<File, "type" | "size">): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return "Use a JPEG, PNG or WebP file.";
  if (file.size > MAX_IMAGE_BYTES) return "Image is over 10 MB.";
  return null;
}

export async function uploadImage(file: File): Promise<string> {
  const body = new FormData();
  body.append("images", file);

  let res: Response;
  try {
    // Generous timeout: the API's host can take a while to wake from idle.
    res = await fetch(UPLOAD_URL, { method: "POST", body, signal: AbortSignal.timeout(120_000) });
  } catch {
    throw new Error("Upload timed out or the network failed. Try again.");
  }
  if (!res.ok) throw new Error("The upload service rejected this image. Try again.");

  const data: unknown = await res.json().catch(() => null);
  const url = (data as { uploaded?: { url?: unknown }[] } | null)?.uploaded?.[0]?.url;
  if (typeof url !== "string" || !isAllowedImageUrl(url)) {
    throw new Error("The upload service sent back an unexpected response.");
  }
  return url;
}
