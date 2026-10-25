import {
  SITE_URL,
  SEO_NAME,
  SEO_ALTERNATE_NAMES,
  SITE_DESCRIPTION,
  SOCIAL_PROFILES,
  BUSINESS,
} from "@/lib/seo";

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "Brand"],
      "@id": ORG_ID,
      name: SEO_NAME,
      alternateName: SEO_ALTERNATE_NAMES,
      url: SITE_URL,
      logo: `${SITE_URL}/images/logo-black.png`,
      description: SITE_DESCRIPTION,
      email: BUSINESS.email,
      ...(BUSINESS.telephone && { telephone: BUSINESS.telephone }),
      foundingDate: BUSINESS.foundingDate,
      address: {
        "@type": "PostalAddress",
        ...(BUSINESS.streetAddress && {
          streetAddress: BUSINESS.streetAddress,
        }),
        addressLocality: BUSINESS.locality,
        addressRegion: BUSINESS.region,
        addressCountry: BUSINESS.country,
      },
      sameAs: SOCIAL_PROFILES,
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE_URL,
      name: SEO_NAME,
      alternateName: SEO_ALTERNATE_NAMES,
      publisher: { "@id": ORG_ID },
      inLanguage: "en",
    },
  ],
};

// Site-wide Organization + WebSite graph. Product pages add their own
// Product JSON-LD next to the page content.
export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
