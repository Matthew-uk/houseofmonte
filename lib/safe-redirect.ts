// Only same-site relative paths are allowed as post-login destinations, so a
// crafted ?next= can't bounce users to another origin ("//evil.com", "/\evil").
export function safeNext(next: string | null | undefined, fallback = "/account"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) {
    return fallback;
  }
  return next;
}
