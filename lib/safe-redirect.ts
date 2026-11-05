// Post-login destinations are limited to the admin itself, so a crafted ?next=
// can't bounce the user to another origin ("//evil.com", "/\evil").
export function safeNext(next: string | null | undefined): string {
  if (!next || (next !== "/admin" && !next.startsWith("/admin/")) || next.includes("\\")) {
    return "/admin";
  }
  return next;
}
