import type {
  AddOn,
  AddOnCompatibility,
  CapabilityMatrix,
  CapabilityRow,
  Decision,
  EnterpriseOffering,
  OfferScope,
  OneTimeProject,
  Package,
  PackageCatalog,
  PackageFor,
  PackageSegment,
  PackageServiceRelationship,
  PackageTier,
  ServiceId,
} from "@/lib/domain";
import { parseSlug } from "@/lib/domain/helpers";
import { serviceExternalCosts } from "@/lib/data/services";

// One shared industry recommendation source, including reverse package views.
export { industryPackageRelationships } from "@/lib/data/industries";

const tbf = Object.freeze({ state: "tbf" } as const);
const draft = Object.freeze({ status: "draft" } as const);
const scope = Object.freeze({
  deliverables: tbf,
  limits: tbf,
  inclusions: tbf,
  exclusions: tbf,
  timeline: tbf,
  reporting: tbf,
  support: tbf,
  clientResponsibilities: tbf,
  terms: tbf,
}) satisfies OfferScope;

const packageFields = {
  publication: draft,
  availability: "tbf",
  positioning: tbf,
  targetCustomer: tbf,
  objective: tbf,
  commercial: Object.freeze({
    pricing: tbf,
    billingBasis: tbf,
    setupFee: tbf,
    externalCosts: serviceExternalCosts,
    scope,
  }),
  faqs: tbf,
  cta: tbf,
} as const;

const tierNames = { basic: "Basic", standard: "Standard", premium: "Premium" } as const;

/** Doc 06 row structure. Every value is TBF: no quantity, platform or scope is approved. */
function row(id: string, label: string, note?: string): CapabilityRow {
  return Object.freeze({
    id: `capability:${id}`,
    label,
    value: Object.freeze({ state: "tbf", ...(note ? { note } : {}) } as const),
    services: tbf,
  });
}
function capabilitiesFor(segment: PackageSegment, tier: PackageTier): CapabilityMatrix {
  const rows = segment === "startup"
    ? [
        row("strategy", "Strategy", "TBF scope"),
        row("seo-local", "SEO / Local", "TBF quantities"),
        row("social", "Social", "TBF platforms and posts"),
        row("ads-management", "Ads management", tier === "basic" ? "TBF / optional" : undefined),
        row("content-creative", "Content / creative"),
        row("tracking-reporting", "Tracking / reporting"),
        row("support", "Support"),
      ]
    : [
        row("strategy-review", "Strategy / review"),
        row("seo-local", "SEO / Local"),
        row("paid-channels", "Paid channels"),
        row("social-content", "Social / content"),
        row("cro-web", "CRO / web"),
        row("email-crm-automation", "Email / CRM / automation"),
        row("analytics-reporting", "Analytics / reporting"),
        row("support-cadence", "Support cadence"),
      ];
  return Object.freeze(rows);
}

function draftPackage<S extends PackageSegment, T extends PackageTier>(
  segment: S,
  tier: T,
): PackageFor<S, T> {
  // Doc 00 §5: /packages/[slug]. The segment prefix keeps tier slugs globally unique.
  const slug = parseSlug(`${segment}-${tier}`);
  if (slug === null) throw new Error(`Invalid package inventory slug: ${segment}-${tier}`);
  return Object.freeze({
    ...packageFields,
    kind: "package",
    id: `package:${segment}:${tier}`,
    segment,
    tier,
    slug,
    name: tierNames[tier],
    version: Object.freeze({ number: 1, status: "draft" } as const),
    capabilities: capabilitiesFor(segment, tier),
  });
}

/** Exact six-slot literal: completeness and ID/segment/tier correlation are checked. */
const catalogRecords = {
  startup: {
    basic: draftPackage("startup", "basic"),
    standard: draftPackage("startup", "standard"),
    premium: draftPackage("startup", "premium"),
  },
  "growing-business": {
    basic: draftPackage("growing-business", "basic"),
    standard: draftPackage("growing-business", "standard"),
    premium: draftPackage("growing-business", "premium"),
  },
} satisfies PackageCatalog;

for (const segment of Object.values(catalogRecords)) Object.freeze(segment);
export const packageCatalog = Object.freeze(catalogRecords);

/** Ordered view of the same canonical records, not a duplicate commercial source. */
export const packages: readonly Package[] = Object.freeze(
  Object.values(packageCatalog).flatMap((segment) => Object.values(segment)),
);

/** Enterprise is a custom consultation journey, never a fixed package tier. */
export const enterpriseOffering = Object.freeze({
  kind: "enterprise",
  segment: "enterprise",
  routeId: "route:enterprise",
  name: "Build Your Growth Stack",
  publication: draft,
  availability: "tbf",
  serviceOptions: tbf,
  scoping: "consultation-led",
  pricing: Object.freeze({ state: "custom-quote" } as const),
  externalCosts: serviceExternalCosts,
  scope,
  cta: tbf,
} as const satisfies EnterpriseOffering);

/** No approved included/excluded/related services have been supplied. */
export const packageServiceRelationships:
  Decision<readonly PackageServiceRelationship[]> = tbf;

/** Individual plans reference canonical Service commercial terms, not tier packages. */
export const individualServicePlans: Decision<readonly ServiceId[]> = tbf;
export const oneTimeProjects: Decision<readonly OneTimeProject[]> = tbf;
export const addOns: Decision<readonly AddOn[]> = tbf;
export const addOnCompatibility: Decision<readonly AddOnCompatibility[]> = tbf;

/** Includes drafts for architecture use; never approves a public enquiry selection. */
export function getPackageById(id: string): Package | undefined {
  return packages.find((offer) => offer.id === id);
}

/** Slugs embed the segment (for example "startup-basic"), so one argument is unambiguous. */
export function getPackageBySlug(slug: string): Package | undefined {
  return packages.find((offer) => offer.slug === slug);
}

export function getPackagesBySegment(segment: string): readonly Package[] {
  return Object.freeze(packages.filter((offer) => offer.segment === segment));
}
