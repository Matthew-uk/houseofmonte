import type { Metadata, Viewport } from "next";
import { lexend } from "@/lib/fonts";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  SITE_URL,
  SEO_NAME,
  SITE_TITLE,
  SITE_DESCRIPTION,
  KEYWORDS,
} from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s — ${SEO_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: KEYWORDS,
  applicationName: SEO_NAME,
  creator: SEO_NAME,
  publisher: SEO_NAME,
  category: "fashion",
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    siteName: SEO_NAME,
    locale: "en_NG",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5f4f0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lexend.variable} antialiased`}>
      <body className="min-h-dvh font-sans">
        {children}
        <JsonLd />
      </body>
    </html>
  );
}
