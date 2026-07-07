import {
  SITE_URL,
  SEO_NAME,
  SEO_ALTERNATE_NAMES,
  SITE_DESCRIPTION,
  SOCIAL_PROFILES,
  BUSINESS,
} from "@/lib/seo";
import { FAQ_ITEMS } from "@/lib/faq";

const ORG_ID = `${SITE_URL}/#organization`;
const STORE_ID = `${SITE_URL}/#store`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const WEBPAGE_ID = `${SITE_URL}/#webpage`;
const LOGO_ID = `${SITE_URL}/#logo`;

const address = {
  "@type": "PostalAddress",
  ...(BUSINESS.streetAddress && { streetAddress: BUSINESS.streetAddress }),
  addressLocality: BUSINESS.locality,
  addressRegion: BUSINESS.region,
  addressCountry: BUSINESS.country,
};

const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "Brand"],
      "@id": ORG_ID,
      name: SEO_NAME,
      alternateName: SEO_ALTERNATE_NAMES,
      url: SITE_URL,
      logo: { "@id": LOGO_ID },
      image: { "@id": LOGO_ID },
      description: SITE_DESCRIPTION,
      email: BUSINESS.email,
      ...(BUSINESS.telephone && { telephone: BUSINESS.telephone }),
      ...(BUSINESS.founder && {
        founder: { "@type": "Person", name: BUSINESS.founder },
      }),
      foundingDate: BUSINESS.foundingDate,
      address,
      sameAs: SOCIAL_PROFILES,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: BUSINESS.email,
        ...(BUSINESS.telephone && { telephone: BUSINESS.telephone }),
        areaServed: "NG",
        availableLanguage: "en",
      },
    },
    {
      "@type": "ImageObject",
      "@id": LOGO_ID,
      url: `${SITE_URL}/images/logo_2.png`,
      contentUrl: `${SITE_URL}/images/logo_2.png`,
      caption: `${SEO_NAME} logo`,
    },
    {
      "@type": "ClothingStore",
      "@id": STORE_ID,
      name: SEO_NAME,
      alternateName: SEO_ALTERNATE_NAMES,
      url: SITE_URL,
      image: { "@id": LOGO_ID },
      description:
        "Premium fashion and luxury clothing store in Port Harcourt, Rivers State, Nigeria — luxury streetwear, bespoke pieces and high-quality apparel for men and women.",
      parentOrganization: { "@id": ORG_ID },
      brand: { "@id": ORG_ID },
      email: BUSINESS.email,
      ...(BUSINESS.telephone && { telephone: BUSINESS.telephone }),
      priceRange: BUSINESS.priceRange,
      currenciesAccepted: "NGN",
      address,
      geo: {
        "@type": "GeoCoordinates",
        latitude: BUSINESS.latitude,
        longitude: BUSINESS.longitude,
      },
      areaServed: [
        { "@type": "City", name: "Port Harcourt" },
        { "@type": "State", name: "Rivers State" },
        { "@type": "Country", name: "Nigeria" },
      ],
      ...(BUSINESS.openingHours.length > 0 && {
        openingHoursSpecification: BUSINESS.openingHours.map((h) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: h.days,
          opens: h.opens,
          closes: h.closes,
        })),
      }),
      sameAs: SOCIAL_PROFILES,
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE_URL,
      name: SEO_NAME,
      alternateName: SEO_ALTERNATE_NAMES,
      description: SITE_DESCRIPTION,
      publisher: { "@id": ORG_ID },
      inLanguage: "en",
    },
    {
      "@type": "WebPage",
      "@id": WEBPAGE_ID,
      url: `${SITE_URL}/`,
      name: "Monte Deluxe — Luxury Fashion Brand in Port Harcourt, Nigeria",
      description: SITE_DESCRIPTION,
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": ORG_ID },
      primaryImageOfPage: { "@id": LOGO_ID },
      breadcrumb: { "@id": `${SITE_URL}/#breadcrumb` },
      inLanguage: "en",
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${SITE_URL}/`,
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: FAQ_ITEMS.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ],
};

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
