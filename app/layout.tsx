import type { Metadata, Viewport } from "next";
import { playfair, inter, jetbrainsMono } from "@/lib/fonts";
import { Bodoni_Moda, Montserrat } from "next/font/google";
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
  authors: [{ name: SEO_NAME, url: SITE_URL }],
  creator: SEO_NAME,
  publisher: SEO_NAME,
  category: "fashion",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    url: "/",
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
  // TODO(owner): add site-verification codes once registered:
  // verification: {
  //   google: "...",           // Google Search Console
  //   yandex: "...",           // Yandex Webmaster
  //   other: { "msvalidate.01": "..." }, // Bing Webmaster
  // },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050505",
};

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bodoni-moda",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${jetbrainsMono.variable} ${bodoni.variable} ${montserrat.variable} antialiased`}
    >
      <body className="min-h-screen bg-bg-primary font-body text-text-primary">
        {children}
        <JsonLd />
      </body>
    </html>
  );
}
