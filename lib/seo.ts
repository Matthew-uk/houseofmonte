// Single source of truth for all SEO / structured-data values.
// Search-facing brand name is "Monte Deluxe"; the visual wordmark stays MONTÉ.

import { SOCIAL } from "@/lib/constants";

export const SITE_URL = "https://montedeluxe.com";

export const SEO_NAME = "Monte Deluxe";
export const SEO_ALTERNATE_NAMES = ["MONTÉ", "Monte", "Monte Deluxe Nigeria"];

export const SITE_TITLE = "Monte Deluxe — Luxury Fashion Brand in Port Harcourt, Nigeria";
export const SITE_DESCRIPTION =
  "Monte Deluxe (MONTÉ) is a premium Nigerian fashion brand in Port Harcourt, Rivers State, crafting luxury streetwear, bespoke clothing and high-quality apparel for men and women. Collection 001 drops July 22, 2026.";

export const KEYWORDS = [
  "Monte Deluxe",
  "MONTÉ",
  "Monte clothing",
  "Monte fashion",
  "Monte Deluxe Nigeria",
  "Monte Deluxe Port Harcourt",
  "luxury clothing Port Harcourt",
  "premium fashion Rivers State",
  "fashion brand Port Harcourt",
  "Nigerian luxury fashion brand",
  "luxury streetwear Nigeria",
  "bespoke clothing Nigeria",
  "designer clothing Nigeria",
];

export const SOCIAL_PROFILES = [SOCIAL.instagram, SOCIAL.tiktok];

interface BusinessInfo {
  email: string;
  streetAddress: string;
  locality: string;
  region: string;
  country: string;
  telephone: string;
  latitude: number;
  longitude: number;
  foundingDate: string;
  founder: string;
  openingHours: { days: string[]; opens: string; closes: string }[];
  priceRange: string;
}

export const BUSINESS: BusinessInfo = {
  email: "hello@montedeluxe.com",
  // TODO(owner): confirm street address, phone, exact coordinates,
  // founder name, founding date and opening hours.
  streetAddress: "", // e.g. "12 Example Road, GRA Phase 2"
  locality: "Port Harcourt",
  region: "Rivers State",
  country: "NG",
  telephone: "", // e.g. "+234 800 000 0000"
  // Port Harcourt city centre — replace with the store's exact coordinates.
  latitude: 4.8156,
  longitude: 7.0498,
  foundingDate: "2024", // inferred from "Two Year Anniversary" (July 2026)
  founder: "", // e.g. "Full Name"
  openingHours: [],
  priceRange: "₦₦₦",
};
