// Brand + launch constants for MONTÈ (the È is intentional — never a plain E).

export const BRAND = "MONTÈ";

// Collection 001 drop: July 22, 2026 00:00 WAT (West Africa Time, UTC+1).
export const TARGET_DATE = new Date("2026-07-22T00:00:00+01:00");
export const TARGET_TS = TARGET_DATE.getTime();

export const SOCIAL = {
  instagram: "https://www.instagram.com/houseofmonte/",
  instagramHandle: "@houseofmonte",
  tiktok: "https://www.tiktok.com/@houseofmonte1",
  email: "mailto:hello@montedeluxe.com",
} as const;

// localStorage key for the demo email signup.
export const SIGNUP_STORAGE_KEY = "monte:subscribers";

// Shared layout rhythm: horizontal page padding + vertical space between
// major sections, and the unified content container width.
export const SECTION_X = "px-5 sm:px-10";
export const SECTION_RHYTHM = "py-[clamp(80px,10vw,140px)]";
export const CONTAINER = "mx-auto w-full max-w-[1100px]";
