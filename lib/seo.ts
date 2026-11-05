// Single source of truth for all SEO / structured-data values.
// Brand is MONTÈ everywhere; "Monte Deluxe" stays as an alternate name for search.

import { SOCIAL } from "@/lib/constants";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://montedeluxe.com"
).replace(/\/$/, "");

export const SEO_NAME = "MONTÈ";
export const SEO_ALTERNATE_NAMES = ["Monte Deluxe", "Monte", "House of Monte"];

export const SITE_TITLE = "MONTÈ";
export const SITE_DESCRIPTION =
  "MONTÈ is a clothing label from Port Harcourt, Nigeria. Shop the latest pieces online with delivery across Nigeria.";

export const KEYWORDS = [
  "MONTÈ",
  "Monte Deluxe",
  "House of Monte",
  "Monte clothing",
  "clothing brand Port Harcourt",
  "Nigerian clothing label",
  "streetwear Nigeria",
  "buy clothes online Nigeria",
];

export const SOCIAL_PROFILES = [SOCIAL.instagram, SOCIAL.tiktok];

interface BusinessInfo {
  email: string;
  streetAddress: string;
  locality: string;
  region: string;
  country: string;
  telephone: string;
  foundingDate: string;
}

export const BUSINESS: BusinessInfo = {
  email: SOCIAL.email,
  // TODO(owner): confirm street address and phone.
  streetAddress: "",
  locality: "Port Harcourt",
  region: "Rivers State",
  country: "NG",
  telephone: "",
  foundingDate: "2024",
};
