/**
 * Legacy path map for the v3.0 alignment (doc 00 §5, doc 04 §1). Pure data with no imports,
 * so next.config.ts can consume it. Each entry is served as a 301 redirect.
 * Sources are retired paths only; none may equal a live registry path.
 */
export type LegacyRedirect = Readonly<{ source: string; destination: string }>;

const retiredServiceSlugs: Readonly<Record<string, string>> = Object.freeze({
  "local-seo-google-business-profile": "local-seo",
  "ai-search-aeo-geo": "ai-search-visibility",
  "authority-digital-pr": "authority-pr",
  "paid-advertising-ppc": "paid-advertising",
  "platform-advertising": "specialist-campaigns",
  "social-media-management": "social-media",
  "branding-graphic-design": "branding-design",
  "video-creative-production": "photo-video",
  "website-design-development": "website-development",
  "app-mvp-design-development": "app-mvp-development",
  "website-care-maintenance": "website-care",
  cro: "conversion-optimization",
  "email-sms-marketing": "email-sms",
  "crm-marketing-automation": "crm-automation",
  "b2b-marketing-lead-generation": "b2b-marketing",
  "analytics-tracking-reporting": "analytics-tracking",
  "business-integrations": "business-technology-integrations",
  "enterprise-marketing-growth-leadership": "enterprise-leadership",
});

const segments = ["startup", "growing-business"] as const;
const tiers = ["basic", "standard", "premium"] as const;

export const legacyRedirects: readonly LegacyRedirect[] = Object.freeze([
  ...segments.flatMap((segment) => tiers.map((tier) => Object.freeze({
    source: `/packages/${segment}/${tier}`,
    destination: `/packages/${segment}-${tier}`,
  }))),
  Object.freeze({ source: "/request-proposal", destination: "/proposal" }),
  Object.freeze({ source: "/partnerships", destination: "/contact" }),
  ...Object.entries(retiredServiceSlugs).map(([from, to]) => Object.freeze({
    source: `/services/${from}`,
    destination: `/services/${to}`,
  })),
]);
