import { Lexend } from "next/font/google";

// The only typeface on the site (DESIGN.md §3). latin-ext carries the ₦ sign.
export const lexend = Lexend({
  subsets: ["latin", "latin-ext"],
  variable: "--font-lexend",
  display: "swap",
});
