import type {
  ExternalCosts,
  Service,
  ServiceFamily,
  ServiceFamilySlug,
} from "@/lib/domain";

/**
 * Approved taxonomy only. Source: MVP requirements v3.0 §5;
 * slugs: information architecture §9. Draft data is not publishable content.
 */
const tbf = Object.freeze({ state: "tbf" } as const);
const draftFamilyFields = {
  publication: Object.freeze({ status: "draft" } as const),
  availability: "tbf",
  targetSegments: tbf,
  content: Object.freeze({
    shortDescription: tbf,
    fullDescription: tbf,
    category: tbf,
    problemsSolved: tbf,
    process: tbf,
    intendedOutcomes: tbf,
    faqs: tbf,
    cta: tbf,
  }),
  scope: Object.freeze({
    deliverables: tbf,
    limits: tbf,
    inclusions: tbf,
    exclusions: tbf,
    timeline: tbf,
    reporting: tbf,
    support: tbf,
    clientResponsibilities: tbf,
    terms: tbf,
  }),
} as const;

/** Mapped keys ensure complete taxonomy coverage and correlated identity/slug pairs. */
const familyRecords = {
  "strategy-consulting": {
    ...draftFamilyFields,
    id: "family:strategy-consulting",
    slug: "strategy-consulting",
    name: "Strategy & Consulting",
  },
  "seo": {
    ...draftFamilyFields,
    id: "family:seo",
    slug: "seo",
    name: "SEO",
  },
  "local-seo": {
    ...draftFamilyFields,
    id: "family:local-seo",
    slug: "local-seo",
    name: "Local SEO",
  },
  "ai-search-visibility": {
    ...draftFamilyFields,
    id: "family:ai-search-visibility",
    slug: "ai-search-visibility",
    name: "AI Search Visibility",
  },
  "authority-pr": {
    ...draftFamilyFields,
    id: "family:authority-pr",
    slug: "authority-pr",
    name: "Authority & PR",
  },
  "paid-advertising": {
    ...draftFamilyFields,
    id: "family:paid-advertising",
    slug: "paid-advertising",
    name: "Paid Advertising",
  },
  "specialist-campaigns": {
    ...draftFamilyFields,
    id: "family:specialist-campaigns",
    slug: "specialist-campaigns",
    name: "Specialist Campaigns",
  },
  "social-media": {
    ...draftFamilyFields,
    id: "family:social-media",
    slug: "social-media",
    name: "Social Media",
  },
  "content-marketing": {
    ...draftFamilyFields,
    id: "family:content-marketing",
    slug: "content-marketing",
    name: "Content Marketing",
  },
  "branding-design": {
    ...draftFamilyFields,
    id: "family:branding-design",
    slug: "branding-design",
    name: "Branding & Design",
  },
  "photo-video": {
    ...draftFamilyFields,
    id: "family:photo-video",
    slug: "photo-video",
    name: "Photo & Video",
  },
  "website-development": {
    ...draftFamilyFields,
    id: "family:website-development",
    slug: "website-development",
    name: "Website Development",
  },
  "app-mvp-development": {
    ...draftFamilyFields,
    id: "family:app-mvp-development",
    slug: "app-mvp-development",
    name: "App / MVP Development",
  },
  "website-care": {
    ...draftFamilyFields,
    id: "family:website-care",
    slug: "website-care",
    name: "Website Care",
  },
  "conversion-optimization": {
    ...draftFamilyFields,
    id: "family:conversion-optimization",
    slug: "conversion-optimization",
    name: "Conversion Optimization",
  },
  "email-sms": {
    ...draftFamilyFields,
    id: "family:email-sms",
    slug: "email-sms",
    name: "Email & SMS",
  },
  "crm-automation": {
    ...draftFamilyFields,
    id: "family:crm-automation",
    slug: "crm-automation",
    name: "CRM & Automation",
  },
  "ai-automation": {
    ...draftFamilyFields,
    id: "family:ai-automation",
    slug: "ai-automation",
    name: "AI & Automation",
  },
  "b2b-marketing": {
    ...draftFamilyFields,
    id: "family:b2b-marketing",
    slug: "b2b-marketing",
    name: "B2B Marketing",
  },
  "analytics-tracking": {
    ...draftFamilyFields,
    id: "family:analytics-tracking",
    slug: "analytics-tracking",
    name: "Analytics & Tracking",
  },
  "business-technology-integrations": {
    ...draftFamilyFields,
    id: "family:business-technology-integrations",
    slug: "business-technology-integrations",
    name: "Business Technology & Integrations",
  },
  "enterprise-leadership": {
    ...draftFamilyFields,
    id: "family:enterprise-leadership",
    slug: "enterprise-leadership",
    name: "Enterprise Leadership",
  },
} as const satisfies {
  readonly [S in ServiceFamilySlug]: Extract<ServiceFamily, { slug: S }>;
};

/** One canonical record per family, in approved baseline order. */
export const serviceFamilies: readonly ServiceFamily[] = Object.freeze(
  Object.values(familyRecords).map((family) => Object.freeze(family)),
);

/**
 * No independently approved child service identities/parent mappings are supplied.
 * Empty means no records populated yet; it does not mean approved absence of services.
 */
export const services: readonly Service[] = Object.freeze([]);

/**
 * Baseline cost treatment, not an offer or price.
 * Any approved inclusion must be explicitly represented in the relevant future offer.
 */
export const serviceExternalCosts = Object.freeze({
  "advertising-media-spend": Object.freeze({ treatment: "separate" } as const),
  "third-party-tools": Object.freeze({ treatment: "separate" } as const),
  hosting: Object.freeze({ treatment: "separate" } as const),
  "premium-assets": Object.freeze({ treatment: "separate" } as const),
  production: Object.freeze({ treatment: "separate" } as const),
  "other-external": Object.freeze({ treatment: "separate" } as const),
}) satisfies ExternalCosts;

/** Exact lookups: no aliases, normalization or fallback to a different family. */
export function getServiceFamilyById(id: string): ServiceFamily | undefined {
  return serviceFamilies.find((family) => family.id === id);
}

export function getServiceFamilyBySlug(slug: string): ServiceFamily | undefined {
  return serviceFamilies.find((family) => family.slug === slug);
}

export function getServiceById(id: string): Service | undefined {
  return services.find((service) => service.id === id);
}

export function getServicesByFamily(familyId: string): readonly Service[] {
  return services.filter((service) => service.familyId === familyId);
}
