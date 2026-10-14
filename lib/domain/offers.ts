import type {
  AddOnId,
  ApprovalReference,
  Availability,
  Decision,
  PackageId,
  PackageSegment,
  PackageTier,
  ProjectId,
  Publication,
  RouteId,
  ScopedValue,
  ServiceId,
  Slug,
  Timestamp,
} from "./core";
import type { CommercialTerms, OfferScope } from "./commercial";
import type { CTA } from "./routes";
import type { FAQ } from "./services";

type OfferIdentity<Id extends string> = Readonly<{
  id: Id;
  slug: Slug;
  name: string;
  publication: Publication;
  availability: Availability;
  routeId?: RouteId;
  positioning: Decision<string>;
  targetCustomer: Decision<string>;
  objective: Decision<string>;
  commercial: CommercialTerms;
  faqs: Decision<readonly FAQ[]>;
  cta: Decision<CTA>;
}>;

/**
 * Doc 00 §8 "Terms/version": a published version is immutable so existing client
 * scope is preserved; any scope change creates a new, higher version number.
 */
export type PackageVersion =
  | Readonly<{ number: number; status: "draft" }>
  | Readonly<{
      number: number;
      status: "approved";
      approvalReference: ApprovalReference;
      effectiveFrom: Timestamp;
      supersedes?: number;
    }>;

export type CapabilityId = `capability:${string}`;

/** One row of the doc 06 per-tier scope matrix. Values stay TBF until commercial freeze. */
export type CapabilityRow = Readonly<{
  id: CapabilityId;
  label: string;
  value: ScopedValue<string>;
  services: Decision<readonly ServiceId[]>;
}>;
export type CapabilityMatrix = readonly CapabilityRow[];

export type PackageFor<S extends PackageSegment, T extends PackageTier> =
  OfferIdentity<PackageId<S, T>> & Readonly<{
    kind: "package";
    segment: S;
    tier: T;
    version: PackageVersion;
    capabilities: CapabilityMatrix;
  }>;

export type Package = {
  [S in PackageSegment]: {
    [T in PackageTier]: PackageFor<S, T>;
  }[PackageTier];
}[PackageSegment];

/** A complete catalog requires three specific records for each specific segment. */
export type PackageCatalog = {
  readonly [S in PackageSegment]: {
    readonly [T in PackageTier]: PackageFor<S, T>;
  };
};

export type PackageServiceRelationship =
  | Readonly<{
      kind: "included";
      packageId: PackageId;
      serviceId: ServiceId;
      scope: OfferScope;
      approvalReference: string;
    }>
  | Readonly<{
      kind: "excluded" | "related";
      packageId: PackageId;
      serviceId: ServiceId;
      explanation: Decision<string>;
    }>;

export type OneTimeProject = OfferIdentity<ProjectId> & Readonly<{
  kind: "one-time-project";
  services: Decision<readonly ServiceId[]>;
}>;

export type AddOn = OfferIdentity<AddOnId> & Readonly<{
  kind: "add-on";
  services: Decision<readonly ServiceId[]>;
}>;

export type EnterpriseOffering = Readonly<{
  kind: "enterprise";
  segment: "enterprise";
  tier?: never;
  routeId: "route:enterprise";
  name: string;
  publication: Publication;
  availability: Availability;
  serviceOptions: Decision<readonly ServiceId[]>;
  scoping: "consultation-led";
  pricing: Readonly<{ state: "custom-quote"; note?: string }>;
  externalCosts: CommercialTerms["externalCosts"];
  scope: OfferScope;
  cta: Decision<CTA>;
}>;
