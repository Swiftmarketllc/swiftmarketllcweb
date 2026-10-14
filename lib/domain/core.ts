/** Stable serialized identities. Prefixes distinguish entity kinds, not database keys. */
export type ServiceFamilySlug =
  | "strategy-consulting"
  | "seo"
  | "local-seo"
  | "ai-search-visibility"
  | "authority-pr"
  | "paid-advertising"
  | "specialist-campaigns"
  | "social-media"
  | "content-marketing"
  | "branding-design"
  | "photo-video"
  | "website-development"
  | "app-mvp-development"
  | "website-care"
  | "conversion-optimization"
  | "email-sms"
  | "crm-automation"
  | "ai-automation"
  | "b2b-marketing"
  | "analytics-tracking"
  | "business-technology-integrations"
  | "enterprise-leadership";

export type ServiceFamilyId = `family:${ServiceFamilySlug}`;
export type ServiceId = `service:${string}`;
export type IndustryId = `industry:${string}`;
export type ProjectId = `project:${string}`;
export type AddOnId = `add-on:${string}`;
export type RouteId = `route:${string}`;
export type ContentId = `content:${string}`;
export type ProofId = `proof:${string}`;
export type EnquiryId = `enquiry:${string}`;
export type LeadId = `lead:${string}`;

export type PackageSegment = "startup" | "growing-business";
export type BusinessSegment = PackageSegment | "enterprise";
export type PackageTier = "basic" | "standard" | "premium";
export type PackageId<
  S extends PackageSegment = PackageSegment,
  T extends PackageTier = PackageTier,
> = `package:${S}:${T}`;

/** Constructor validation is deliberately limited to syntax, not publication. */
declare const slugBrand: unique symbol;
export type Slug = string & { readonly [slugBrand]: true };

/** ISO timestamps are strings at boundaries; validate their format server-side. */
export type Timestamp = string;
export type ApprovalReference = string;

export type Tbf = Readonly<{ state: "tbf"; note?: string }>;
export type Approved<T> = Readonly<{
  state: "approved";
  value: T;
  approvalReference: ApprovalReference;
}>;
export type Decision<T> = Tbf | Approved<T>;
export type ScopedValue<T> =
  | Decision<T>
  | Readonly<{ state: "custom"; note?: string }>
  | Readonly<{ state: "not-applicable"; reason: string }>;

export type Availability =
  | "tbf"
  | "available"
  | "consultation-required"
  | "coming-soon"
  | "unavailable";

export type Publication =
  | Readonly<{ status: "planned" | "draft" }>
  | Readonly<{
      status: "approved";
      approvalReference: ApprovalReference;
    }>
  | Readonly<{
      status: "published";
      approvalReference: ApprovalReference;
      publishedAt: Timestamp;
    }>
  | Readonly<{ status: "retired"; retiredAt: Timestamp }>;

export type PackageSelection = {
  [S in PackageSegment]: {
    [T in PackageTier]: Readonly<{
      packageId: PackageId<S, T>;
      segment: S;
      tier: T;
    }>;
  }[PackageTier];
}[PackageSegment];

/** Non-personal references only. Never add message/contact/budget/credential fields. */
export type SelectionContext = Readonly<{
  familyId?: ServiceFamilyId;
  serviceIds?: readonly ServiceId[];
  package?: PackageSelection;
  industryId?: IndustryId;
  projectId?: ProjectId;
  addOnIds?: readonly AddOnId[];
  enterprise?: true;
}>;

export type SolutionReference =
  | Readonly<{ kind: "service-family"; id: ServiceFamilyId }>
  | Readonly<{ kind: "service"; id: ServiceId }>
  | Readonly<{ kind: "industry"; id: IndustryId }>
  | Readonly<{ kind: "package"; id: PackageId }>
  | Readonly<{ kind: "enterprise" }>
  | Readonly<{ kind: "project"; id: ProjectId }>
  | Readonly<{ kind: "add-on"; id: AddOnId }>;
