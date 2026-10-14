/**
 * PRIVATE operational contracts. Import types directly from this file.
 * No values, logging, persistence, client props or provider integration are implemented.
 */
import type {
  Decision,
  EnquiryId,
  LeadId,
  PackageSelection,
  ProjectId,
  RouteId,
  SelectionContext,
  ServiceId,
  Timestamp,
} from "./core";
import type { Money } from "./commercial";

export type EnterpriseSelection = Readonly<{
  kind: "enterprise";
  serviceIds: readonly ServiceId[]; // empty is valid when requesting guidance
  requirements?: string;
}>;

/** Required variant references are distinct from eventual required form fields. */
export type EnquiryIntent =
  | Readonly<{ kind: "general" | "consultation" | "proposal" }>
  | Readonly<{ kind: "package"; selection: PackageSelection }>
  | Readonly<{ kind: "individual-service"; serviceId: ServiceId }>
  | Readonly<{ kind: "one-time-project"; projectId?: ProjectId }>
  | EnterpriseSelection;

export type EnquiryType = EnquiryIntent["kind"];

/** Conceptual field capabilities, not a validated submission schema. Requiredness is TBF. */
export type ContactFields = Readonly<{
  name?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  website?: string;
  preferredContactMethod?: "email" | "phone";
}>;

export type EnquiryBudget =
  | Readonly<{ state: "unspecified" }>
  | Readonly<{ state: "provided"; amount: Money; basis?: string }>;

/** Untrusted and potentially personal attribution; never include in public route data. */
export type EnquiryAttribution = Readonly<{
  sourceRouteId?: RouteId;
  landingRouteId?: RouteId;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}>;

export type EnquiryDraft = Readonly<{
  intent: EnquiryIntent;
  selection: SelectionContext;
  contact: ContactFields;
  message?: string;
  businessGoals?: string;
  currentChallenges?: string;
  marketsServed?: readonly string[];
  existingTools?: readonly string[];
  serviceBudget?: EnquiryBudget;
  advertisingBudget?: EnquiryBudget;
  desiredStart?: string; // visitor preference, never a delivery promise
  attribution?: EnquiryAttribution;
  disclosureAcknowledgement?: Readonly<{
    contentReference: string;
    acknowledgedAt: Timestamp;
  }>;
}>;

export type LeadStatus = "new" | "contacted" | "proposal-sent" | "won" | "lost";

/** Only the later trusted receipt workflow may create a Lead. Types cannot prove delivery. */
export type Lead = Readonly<{
  id: LeadId;
  enquiryId: EnquiryId;
  enquiry: EnquiryDraft;
  receivedAt: Timestamp;
  status: LeadStatus;
  statusChangedAt: Timestamp;
  receiptReference: string;
  assignment: Decision<string>;
}>;

/** Safe outcome capability only; no provider errors or personal payload echoes. */
export type EnquiryOutcome =
  | Readonly<{ status: "received"; receiptReference: string }>
  | Readonly<{
      status: "not-received";
      reason: "invalid-input" | "temporarily-unavailable" | "not-accepted";
    }>;
