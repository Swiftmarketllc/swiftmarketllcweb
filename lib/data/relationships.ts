import type {
  AddOn, AddOnCompatibility, AddOnId, Decision, EnterpriseOffering, Industry,
  IndustryId, IndustryPackageRelationship, IndustryServiceRelationship, OneTimeProject,
  Package, PackageId, PackageServiceRelationship, ProjectId, Publication, Service,
  ServiceFamily, ServiceId, Tbf,
} from "@/lib/domain";
import { isPackageSegment, isPackageTier, parseSlug } from "@/lib/domain/helpers";
import { serviceFamilies, services } from "@/lib/data/services";
import {
  industries, industryServiceRelationships, industryPackageRelationships,
} from "@/lib/data/industries";
import {
  packages, enterpriseOffering, packageServiceRelationships, individualServicePlans,
  oneTimeProjects, addOns, addOnCompatibility,
  industryPackageRelationships as packageIndustryRelationships,
} from "@/lib/data/packages";

/** References to existing contracts/sources, not a replacement entity schema. */
export type RelationshipRegistry = Readonly<{
  families: readonly ServiceFamily[];
  services: readonly Service[];
  industries: readonly Industry[];
  packages: readonly Package[];
  enterprise: EnterpriseOffering;
  industryServices: Decision<readonly IndustryServiceRelationship[]>;
  packageServices: Decision<readonly PackageServiceRelationship[]>;
  industryPackages: Decision<readonly IndustryPackageRelationship[]>;
  packageIndustries: Decision<readonly IndustryPackageRelationship[]>;
  individualPlans: Decision<readonly ServiceId[]>;
  projects: Decision<readonly OneTimeProject[]>;
  addOns: Decision<readonly AddOn[]>;
  compatibility: Decision<readonly AddOnCompatibility[]>;
}>;

export const relationshipRegistry: RelationshipRegistry = Object.freeze({
  families: serviceFamilies, services, industries, packages, enterprise: enterpriseOffering,
  industryServices: industryServiceRelationships,
  packageServices: packageServiceRelationships,
  industryPackages: industryPackageRelationships,
  packageIndustries: packageIndustryRelationships,
  individualPlans: individualServicePlans, projects: oneTimeProjects, addOns,
  compatibility: addOnCompatibility,
});

export type IntegrityIssue = Readonly<{
  code: "invalid-reference" | "duplicate-identity" | "invalid-identity"
    | "duplicate-relationship" | "inconsistent-reverse" | "inconsistent-relationship"
    | "incomplete-publication" | "unpublished-target" | "missing-approval";
  path: string;
}>;
export type RelationshipLookup<T> = Tbf
  | Readonly<{ state: "invalid"; issues: readonly IntegrityIssue[] }>
  | Readonly<{ state: "resolved"; items: readonly T[] }>;

type PublishedRecord = Readonly<{ publication: Publication; availability?: string }>;
function isPublic(record: PublishedRecord | undefined): boolean {
  return record?.publication.status === "published"
    && record.availability !== "tbf" && record.availability !== "coming-soon" && record.availability !== "unavailable";
}
function values<T>(decision: Decision<readonly T[]>): readonly T[] {
  return decision.state === "approved" ? decision.value : [];
}

/** Trusted typed registry integrity only; not an external-input or SEO validator. */
export function validateRelationshipRegistry(
  registry: RelationshipRegistry = relationshipRegistry,
): readonly IntegrityIssue[] {
  const issues: IntegrityIssue[] = [];
  const issue = (code: IntegrityIssue["code"], path: string) => {
    issues.push(Object.freeze({ code, path }));
  };
  const exists = (records: readonly { id: string }[], id: string) => records.some((r) => r.id === id);
  const reference = (records: readonly { id: string }[], id: string, path: string) => {
    if (!exists(records, id)) issue("invalid-reference", path);
  };
  const unique = (keys: readonly string[], code: IntegrityIssue["code"], path: string) => {
    const seen = new Set<string>();
    keys.forEach((key, index) => {
      if (seen.has(key)) issue(code, `${path}[${index}]`);
      seen.add(key);
    });
  };
  // Inspect nested decisions without interpreting TBF as approval, absence or zero.
  const inspect = (value: unknown, path: string, published: boolean): void => {
    if (!value || typeof value !== "object") return;
    if ("state" in value && value.state === "tbf" && published) issue("incomplete-publication", path);
    if (("state" in value && value.state === "approved")
      || ("treatment" in value && value.treatment === "included")) {
      if (!("approvalReference" in value) || typeof value.approvalReference !== "string"
        || !value.approvalReference.trim()) issue("missing-approval", path);
    }
    for (const [key, child] of Object.entries(value)) inspect(child, `${path}.${key}`, published);
  };
  const publication = (record: PublishedRecord, path: string) => {
    const status = record.publication;
    if (status.status === "published" || status.status === "approved") {
      if (!status.approvalReference.trim()) issue("missing-approval", `${path}.publication`);
    }
    if (status.status === "published") {
      if (!status.publishedAt.trim() || record.availability === "tbf") issue("incomplete-publication", path);
      inspect(record, path, true);
    } else inspect(record, path, false);
  };
  const publishedTargets = (owner: PublishedRecord, targets: readonly (PublishedRecord | undefined)[], path: string) => {
    if (owner.publication.status === "published" && targets.some((target) => !isPublic(target))) {
      issue("unpublished-target", path);
    }
  };
  const projects = values(registry.projects);
  const additions = values(registry.addOns);
  const groups = [
    ["families", registry.families], ["services", registry.services],
    ["industries", registry.industries], ["packages", registry.packages],
    ["projects", projects], ["addOns", additions],
  ] as const;
  unique(groups.flatMap(([, records]) => records.map((r) => r.id)), "duplicate-identity", "entities");
  for (const [group, records] of groups) {
    const prefix = { families: "family", services: "service", industries: "industry", packages: "package", projects: "project", addOns: "add-on" }[group];
    unique(records.map((r) => "segment" in r ? `${r.segment}/${r.slug}`
      : "familyId" in r ? `${r.familyId}/${r.slug}` : r.slug), "duplicate-identity", `${group}.slugs`);
    records.forEach((r, index) => {
      const path = `${group}[${index}]`;
      if (!r.id.startsWith(`${prefix}:`) || r.id.length === prefix.length + 1) issue("invalid-identity", `${path}.id`);
      if (parseSlug(r.slug) === null) issue("invalid-identity", `${path}.slug`);
      if (group === "families" && r.id !== `family:${r.slug}`) issue("invalid-identity", `${path}.id`);
      publication(r, path);
    });
  }
  registry.packages.forEach((p, index) => {
    if (!isPackageSegment(p.segment) || !isPackageTier(p.tier)
      || p.id !== `package:${p.segment}:${p.tier}` || p.slug !== `${p.segment}-${p.tier}`) {
      issue("invalid-identity", `packages[${index}]`);
    }
    if (!Number.isInteger(p.version.number) || p.version.number < 1
      || (p.version.status === "approved" && !p.version.approvalReference.trim())) {
      issue("invalid-identity", `packages[${index}].version`);
    }
    // A published package must pin an approved version so later edits cannot rewrite client scope.
    if (p.publication.status === "published" && p.version.status !== "approved") {
      issue("incomplete-publication", `packages[${index}].version`);
    }
    unique(p.capabilities.map((row) => row.id), "duplicate-identity", `packages[${index}].capabilities`);
    p.capabilities.forEach((row, rowIndex) => {
      if (!/^capability:[a-z0-9]+(?:-[a-z0-9]+)*$/.test(row.id) || !row.label.trim()) {
        issue("invalid-identity", `packages[${index}].capabilities[${rowIndex}]`);
      }
      values(row.services).forEach((id, serviceIndex) =>
        reference(registry.services, id, `packages[${index}].capabilities[${rowIndex}].services[${serviceIndex}]`));
    });
  });
  registry.services.forEach((service, index) => {
    reference(registry.families, service.familyId, `services[${index}].familyId`);
    publishedTargets(service, [registry.families.find((f) => f.id === service.familyId)], `services[${index}].familyId`);
  });
  publication(registry.enterprise, "enterprise");
  if ("tier" in registry.enterprise || registry.enterprise.segment !== "enterprise"
    || registry.enterprise.scoping !== "consultation-led" || registry.enterprise.pricing.state !== "custom-quote") {
    issue("invalid-identity", "enterprise");
  }
  // Validate approved ID lists, including future project/add-on and directed peers.
  const serviceIds = (source: Decision<readonly ServiceId[]>, path: string, owner?: PublishedRecord) => {
    inspect(source, path, false);
    unique(values(source), "duplicate-relationship", path);
    values(source).forEach((id, index) => reference(registry.services, id, `${path}[${index}]`));
    if (owner) publishedTargets(owner, values(source).map((id) => registry.services.find((s) => s.id === id)), path);
  };
  serviceIds(registry.enterprise.serviceOptions, "enterprise.serviceOptions", registry.enterprise);
  serviceIds(registry.individualPlans, "individualPlans");
  values(registry.individualPlans).forEach((id, index) => {
    const service = registry.services.find((s) => s.id === id);
    if (service && (service.engagementModes.state !== "approved"
      || !service.engagementModes.value.includes("individual"))) issue("inconsistent-relationship", `individualPlans[${index}]`);
  });
  registry.services.forEach((s, i) => serviceIds(s.relatedServiceIds, `services[${i}].relatedServiceIds`, s));
  projects.forEach((p, i) => serviceIds(p.services, `projects[${i}].services`, p));
  additions.forEach((a, i) => serviceIds(a.services, `addOns[${i}].services`, a));
  for (const [path, source] of [
    ["industryServices", registry.industryServices], ["packageServices", registry.packageServices],
    ["industryPackages", registry.industryPackages], ["packageIndustries", registry.packageIndustries],
    ["projects", registry.projects], ["addOns", registry.addOns], ["compatibility", registry.compatibility],
  ] as const) inspect(source, path, false);

  const industryServices = values(registry.industryServices);
  unique(industryServices.map((r) => `${r.industryId}/${r.serviceId}`), "duplicate-relationship", "industryServices");
  industryServices.forEach((r, i) => {
    reference(registry.industries, r.industryId, `industryServices[${i}].industryId`);
    reference(registry.services, r.serviceId, `industryServices[${i}].serviceId`);
    publication(r, `industryServices[${i}]`);
    publishedTargets(r, [registry.industries.find((s) => s.id === r.industryId), registry.services.find((s) => s.id === r.serviceId)], `industryServices[${i}]`);
  });
  const packageServices = values(registry.packageServices);
  unique(packageServices.map((r) => `${r.packageId}/${r.serviceId}`), "duplicate-relationship", "packageServices");
  packageServices.forEach((r, i) => {
    reference(registry.packages, r.packageId, `packageServices[${i}].packageId`);
    reference(registry.services, r.serviceId, `packageServices[${i}].serviceId`);
    if (r.kind === "included" && !r.approvalReference.trim()) issue("missing-approval", `packageServices[${i}]`);
    if (isPublic(registry.packages.find((p) => p.id === r.packageId))
      && isPublic(registry.services.find((s) => s.id === r.serviceId))) inspect(r, `packageServices[${i}]`, true);
  });
  const industryPackages = values(registry.industryPackages);
  unique(industryPackages.map((r) => `${r.industryId}/${r.packageId}`), "duplicate-relationship", "industryPackages");
  industryPackages.forEach((r, i) => {
    reference(registry.industries, r.industryId, `industryPackages[${i}].industryId`);
    reference(registry.packages, r.packageId, `industryPackages[${i}].packageId`);
    publication(r, `industryPackages[${i}]`);
    publishedTargets(r, [registry.industries.find((s) => s.id === r.industryId), registry.packages.find((s) => s.id === r.packageId)], `industryPackages[${i}]`);
  });
  // Verify the existing package re-export view; all other reverse views are derived.
  const fingerprint = (source: Decision<readonly IndustryPackageRelationship[]>) => source.state === "tbf"
    ? "tbf" : JSON.stringify([source.approvalReference, source.value.map((r) => [
      r.industryId, r.packageId, r.suitability.state,
      r.suitability.state === "approved" ? [r.suitability.value, r.suitability.approvalReference] : null,
      r.publication.status, "approvalReference" in r.publication ? r.publication.approvalReference : null,
      "publishedAt" in r.publication ? r.publication.publishedAt : null,
      "retiredAt" in r.publication ? r.publication.retiredAt : null,
    ]).map((r) => JSON.stringify(r)).sort()]);
  if (fingerprint(registry.industryPackages) !== fingerprint(registry.packageIndustries)) {
    issue("inconsistent-reverse", "packageIndustries");
  }
  const compatibility = values(registry.compatibility);
  unique(compatibility.map((r) => `${r.addOnId}/${r.kind}/${r.kind === "service" ? r.serviceId : r.packageId}`), "duplicate-relationship", "compatibility");
  compatibility.forEach((r, i) => {
    reference(additions, r.addOnId, `compatibility[${i}].addOnId`);
    if (!r.approvalReference.trim()) issue("missing-approval", `compatibility[${i}]`);
    if (r.kind === "service") {
      reference(registry.services, r.serviceId, `compatibility[${i}].serviceId`);
      const addOn = additions.find((a) => a.id === r.addOnId);
      if (addOn?.services.state === "approved" && !addOn.services.value.includes(r.serviceId)) {
        issue("inconsistent-relationship", `compatibility[${i}]`);
      }
    } else reference(registry.packages, r.packageId, `compatibility[${i}].packageId`);
  });
  return Object.freeze(issues);
}

function select<T>(source: Decision<readonly T[]>, validSubject: boolean,
  predicate: (record: T) => boolean, visible: (record: T) => boolean,
  registry: RelationshipRegistry): RelationshipLookup<T> {
  const issues = validateRelationshipRegistry(registry);
  if (issues.length) return Object.freeze({ state: "invalid", issues });
  if (!validSubject) return Object.freeze({ state: "invalid", issues: Object.freeze([
    Object.freeze({ code: "invalid-reference", path: "lookup.subject" } as const),
  ]) });
  if (source.state === "tbf") return source;
  return Object.freeze({ state: "resolved", items: Object.freeze(source.value.filter((r) => predicate(r) && visible(r))) });
}
const has = (records: readonly { id: string }[], id: string) => records.some((r) => r.id === id);
const publicId = (records: readonly (PublishedRecord & { id: string })[], id: string) => isPublic(records.find((r) => r.id === id));

function industryServiceLookup(id: IndustryId | ServiceId, by: "industry" | "service", r: RelationshipRegistry) {
  return select(r.industryServices, has(by === "industry" ? r.industries : r.services, id),
    (edge) => (by === "industry" ? edge.industryId : edge.serviceId) === id,
    (edge) => isPublic(edge) && publicId(r.industries, edge.industryId) && publicId(r.services, edge.serviceId), r);
}
export function getServiceRelationshipsForIndustry(id: IndustryId, r = relationshipRegistry) { return industryServiceLookup(id, "industry", r); }
export function getIndustryRelationshipsForService(id: ServiceId, r = relationshipRegistry) { return industryServiceLookup(id, "service", r); }

function packageServiceLookup(id: PackageId | ServiceId, by: "package" | "service", r: RelationshipRegistry) {
  return select(r.packageServices, has(by === "package" ? r.packages : r.services, id),
    (edge) => (by === "package" ? edge.packageId : edge.serviceId) === id,
    (edge) => publicId(r.packages, edge.packageId) && publicId(r.services, edge.serviceId), r);
}
export function getServiceRelationshipsForPackage(id: PackageId, r = relationshipRegistry) { return packageServiceLookup(id, "package", r); }
export function getPackageRelationshipsForService(id: ServiceId, r = relationshipRegistry) { return packageServiceLookup(id, "service", r); }

function industryPackageLookup(id: IndustryId | PackageId, by: "industry" | "package", r: RelationshipRegistry) {
  return select(r.industryPackages, has(by === "industry" ? r.industries : r.packages, id),
    (edge) => (by === "industry" ? edge.industryId : edge.packageId) === id,
    (edge) => isPublic(edge) && publicId(r.industries, edge.industryId) && publicId(r.packages, edge.packageId), r);
}
export function getPackageRelationshipsForIndustry(id: IndustryId, r = relationshipRegistry) { return industryPackageLookup(id, "industry", r); }
export function getIndustryRelationshipsForPackage(id: PackageId, r = relationshipRegistry) { return industryPackageLookup(id, "package", r); }

export type ServiceOfferQuery = Readonly<{ kind: "enterprise" }>
  | Readonly<{ kind: "one-time-project"; id: ProjectId }>
  | Readonly<{ kind: "add-on"; id: AddOnId }>;
type ServiceOffer = EnterpriseOffering | OneTimeProject | AddOn;
function offerSource(kind: ServiceOffer["kind"], r: RelationshipRegistry): Decision<readonly ServiceOffer[]> {
  if (kind === "one-time-project") return r.projects;
  if (kind === "add-on") return r.addOns;
  return r.enterprise.serviceOptions.state === "tbf" ? r.enterprise.serviceOptions
    : Object.freeze({ state: "approved", value: Object.freeze([r.enterprise]), approvalReference: r.enterprise.serviceOptions.approvalReference });
}
function offerServices(offer: ServiceOffer) { return offer.kind === "enterprise" ? offer.serviceOptions : offer.services; }

/** Future project/add-on catalogs remain TBF; no fallback offering is created. */
export function getServicesForOffer(query: ServiceOfferQuery, r = relationshipRegistry): RelationshipLookup<Service> {
  const source = offerSource(query.kind, r);
  const selected = select(source, source.state === "tbf" || query.kind === "enterprise" || has(values(source).filter((o): o is OneTimeProject | AddOn => o.kind !== "enterprise"), query.id),
    (offer) => query.kind === "enterprise" ? offer.kind === "enterprise" : "id" in offer && offer.id === query.id,
    isPublic, r);
  if (selected.state !== "resolved") return selected;
  const offer = selected.items[0];
  if (!offer) return Object.freeze({ state: "resolved", items: Object.freeze([]) });
  const ids = offerServices(offer);
  return ids.state === "tbf" ? ids : Object.freeze({ state: "resolved", items: Object.freeze(r.services.filter((s) => ids.value.includes(s.id) && isPublic(s))) });
}

export function getOffersForService(kind: ServiceOffer["kind"], id: ServiceId, r = relationshipRegistry): RelationshipLookup<ServiceOffer> {
  const source = offerSource(kind, r);
  return select(source, has(r.services, id), (offer) => {
    const ids = offerServices(offer);
    return ids.state === "approved" && ids.value.includes(id);
  }, (offer) => isPublic(offer) && publicId(r.services, id), r);
}

export type CompatibilityQuery = Readonly<{ kind: "add-on"; id: AddOnId }>
  | Readonly<{ kind: "service"; id: ServiceId }>
  | Readonly<{ kind: "package"; id: PackageId }>;
export function getAddOnCompatibility(query: CompatibilityQuery, r = relationshipRegistry): RelationshipLookup<AddOnCompatibility> {
  const additions = values(r.addOns);
  const subjectExists = query.kind === "add-on" ? r.addOns.state === "tbf" || has(additions, query.id)
    : has(query.kind === "service" ? r.services : r.packages, query.id);
  return select(r.compatibility, subjectExists, (edge) => query.kind === "add-on" ? edge.addOnId === query.id
    : edge.kind === query.kind && (edge.kind === "service" ? edge.serviceId : edge.packageId) === query.id,
    (edge) => publicId(additions, edge.addOnId) && (edge.kind === "service" ? publicId(r.services, edge.serviceId) : publicId(r.packages, edge.packageId)), r);
}
