import type {
  AddOnId,
  Availability,
  BusinessSegment,
  Decision,
  IndustryId,
  PackageId,
  Publication,
  RouteId,
  ServiceFamilySlug,
  ServiceId,
  Slug,
} from "./core";
import type { CommercialTerms, OfferScope } from "./commercial";
import type { CTA } from "./routes";

export type FAQ = Readonly<{
  id: `faq:${string}`;
  question: string;
  answer: string;
}>;

export type ServiceContent = Readonly<{
  shortDescription: Decision<string>;
  fullDescription: Decision<string>;
  category: Decision<string>;
  problemsSolved: Decision<readonly string[]>;
  process: Decision<readonly string[]>;
  intendedOutcomes: Decision<readonly string[]>;
  faqs: Decision<readonly FAQ[]>;
  cta: Decision<CTA>;
}>;

/** Closed approved taxonomy; slug and family identity remain correlated. */
export type ServiceFamily = {
  [S in ServiceFamilySlug]: Readonly<{
    id: `family:${S}`;
    slug: S;
    name: string;
    publication: Publication;
    availability: Availability;
    targetSegments: Decision<readonly BusinessSegment[]>;
    routeId?: RouteId; // a family can be represented at the hub without a detail
    content: ServiceContent;
    scope: OfferScope;
  }>;
}[ServiceFamilySlug];

export type EngagementMode = "recurring" | "individual" | "one-time-project";

export type Service = Readonly<{
  id: ServiceId;
  familyId: ServiceFamily["id"];
  slug: Slug;
  name: string;
  publication: Publication;
  availability: Availability;
  targetSegments: Decision<readonly BusinessSegment[]>;
  engagementModes: Decision<readonly EngagementMode[]>;
  routeId?: RouteId; // unique child page is conditional
  content: ServiceContent;
  commercial: CommercialTerms;
  relatedServiceIds: Decision<readonly ServiceId[]>;
}>;

/** Doc 04 §3 priority bands. Long-tail niches are intentionally not registered. */
export type IndustryPriorityBand = "launch" | "secondary";

export type Industry = Readonly<{
  id: IndustryId;
  slug: Slug;
  name: string;
  priorityBand: IndustryPriorityBand;
  publication: Publication;
  routeId?: RouteId;
  description: Decision<string>;
  problems: Decision<readonly string[]>;
  faqs: Decision<readonly FAQ[]>;
  cta: Decision<CTA>;
}>;

/** One shared association source; reverse views derive from this, not copied lists. */
export type IndustryServiceRelationship = Readonly<{
  industryId: IndustryId;
  serviceId: ServiceId;
  relevance: Decision<string>;
  publication: Publication;
}>;

export type IndustryPackageRelationship = Readonly<{
  industryId: IndustryId;
  packageId: PackageId;
  suitability: Decision<string>;
  publication: Publication;
}>;

export type AddOnCompatibility = (
  | Readonly<{ kind: "service"; addOnId: AddOnId; serviceId: ServiceId }>
  | Readonly<{ kind: "package"; addOnId: AddOnId; packageId: PackageId }>
) & Readonly<{ approvalReference: string }>;
