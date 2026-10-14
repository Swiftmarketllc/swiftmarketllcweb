import type {
  CanonicalPath, ContentId, ContentRecord, CTA, Decision, EvidenceVerification,
  Proof, ProofId, RouteDefinition, RouteId, RouteType, SelectionContext, Slug,
} from "@/lib/domain";
import { parseSlug } from "@/lib/domain/helpers";
import { relationshipRegistry } from "@/lib/data/relationships";
import type { RelationshipRegistry } from "@/lib/data/relationships";
import {
  getPublicRouteById, getRouteById, getSitemapRoutes, routes, siteOrigin,
  validateCTAReferences, validateRouteRegistry,
} from "@/lib/data/routes";
import { resolvePublicCTA } from "@/lib/data/navigation";
import type { ResolvedCTALink } from "@/lib/data/navigation";
import type { RouteFragmentValidator } from "@/lib/data/routes";

export type SectionRole = "overview" | "scope" | "sector-context" | "enquiry" | "legal" | "evidence";
export type EvidenceClaim = Readonly<{
  kind: "numerical-performance" | "portfolio-result";
  text: string;
  verification: EvidenceVerification;
}>;
export type ContentSection = Readonly<{
  id: Slug;
  role: SectionRole;
  heading: string;
  body: string;
  cta?: CTA;
  proofIds: readonly ProofId[];
  claims: readonly EvidenceClaim[];
}>;
/** Composition of existing content fields; no false editorial kind for service pages. */
export type PageContent = Pick<ContentRecord,
  "id" | "publication" | "title" | "summary" | "relatedEntities" | "proofIds" | "cta"
> & Readonly<{
  routeId: RouteId;
  heading: Decision<string>;
  sections: Decision<readonly ContentSection[]>;
  canonicalPath: Decision<CanonicalPath>;
  /** Human review attests that all claims are classified and source-supported. */
  factualReview: Decision<true>;
  legalReview: Decision<true>;
  operationalReview: Decision<true>;
}>;
const tbf = Object.freeze({ state: "tbf" } as const);
const empty = Object.freeze([]);
export const proofs: readonly Proof[] = empty;
export const content: readonly PageContent[] = Object.freeze(routes.map((route) => Object.freeze({
  id: `content:${route.id.slice("route:".length)}` as ContentId,
  routeId: route.id, publication: Object.freeze({ status: "draft" } as const),
  title: tbf, summary: tbf, heading: tbf, sections: tbf, cta: tbf, canonicalPath: tbf,
  factualReview: tbf, legalReview: tbf, operationalReview: tbf,
  relatedEntities: Object.freeze(route.entity && route.entity.kind !== "content" ? [route.entity] : []),
  proofIds: empty,
})));

export function getContentById(id: string, source = content): PageContent | undefined { return source.find((c) => c.id === id); }
export function getContentByRouteId(id: string, source = content): PageContent | undefined { return source.find((c) => c.routeId === id); }

/** Structural minimums, not final section names, copy, order or commercial scope. */
export function requiredSectionRoles(type: RouteType): readonly SectionRole[] {
  switch (type) {
    case "legal": return Object.freeze(["legal"]);
    case "conversion": return Object.freeze(["enquiry"]);
    case "proof-hub": case "proof-detail": return Object.freeze(["overview", "evidence"]);
    case "industry": return Object.freeze(["overview", "sector-context"]);
    case "service-family": case "individual-service": case "packages-hub": case "package-segment":
    case "package-comparison": case "package-tier": case "enterprise":
      return Object.freeze(["overview", "scope"]);
    default: return Object.freeze(["overview"]);
  }
}
export type ContentIssue = Readonly<{
  code: "duplicate-id" | "duplicate-route" | "invalid-route" | "invalid-reference" | "invalid-canonical"
    | "invalid-section" | "invalid-cta" | "missing-evidence" | "missing-content" | "missing-section"
    | "missing-approval" | "missing-seo" | "duplicate-seo" | "route-not-ready" | "unsafe-publication";
  contentId: string;
  field: string;
}>;
function decided<T>(value: Decision<T>): value is Extract<Decision<T>, { state: "approved" }> {
  return value.state === "approved" && !!value.approvalReference.trim();
}
function textReady(value: Decision<string>): boolean { return decided(value) && !!value.value.trim(); }
function verified(value: EvidenceVerification): boolean {
  return value.status === "verified" && !!value.sourceReference.trim() && !!value.publicationPermissionReference.trim();
}
function proofReady(proof: Proof): boolean {
  return proof.publication.status === "published" && !!proof.publication.approvalReference.trim()
    && !!proof.publication.publishedAt.trim() && verified(proof.verification)
    && textReady(proof.title) && textReady(proof.content);
}
function sameIds(a: readonly string[] = [], b: readonly string[] = []): boolean {
  const sorted = [...b].sort();
  return a.length === b.length && [...a].sort().every((id, index) => id === sorted[index]);
}
function sameSelection(a: SelectionContext = {}, b: SelectionContext = {}): boolean {
  return a.familyId === b.familyId && a.industryId === b.industryId && a.projectId === b.projectId
    && a.enterprise === b.enterprise && a.package?.packageId === b.package?.packageId
    && a.package?.segment === b.package?.segment && a.package?.tier === b.package?.tier
    && sameIds(a.serviceIds, b.serviceIds) && sameIds(a.addOnIds, b.addOnIds);
}
/** Exhaustive current CTA semantics. Tracking fields are not part of this contract. */
export function areCTAsEquivalent(a: CTA, b: CTA): boolean {
  if (a.kind !== b.kind || a.intent !== b.intent || a.label !== b.label) return false;
  if (a.kind === "submit-enquiry") return b.kind === "submit-enquiry";
  if (b.kind === "submit-enquiry" || a.destination.routeId !== b.destination.routeId) return false;
  if (a.kind === "navigation") return b.kind === "navigation" && a.destination.fragment === b.destination.fragment;
  return b.kind === "enquiry-link" && sameSelection(a.context, b.context);
}
function contentFragments(source: readonly PageContent[]): RouteFragmentValidator {
  return (routeId, fragment) => {
    const record = getContentByRouteId(routeId, source);
    return parseSlug(fragment) !== null && !!record && decided(record.sections)
      && record.sections.value.some((section) => section.id === fragment);
  };
}
function inspectContent(record: PageContent, source: readonly RouteDefinition[], evidence: readonly Proof[], data: RelationshipRegistry, complete: boolean, fragmentExists: RouteFragmentValidator): readonly ContentIssue[] {
  const issues: ContentIssue[] = [];
  const report = (code: ContentIssue["code"], field: string) => issues.push(Object.freeze({ code, contentId: record.id, field }));
  const route = getRouteById(record.routeId, source);
  if (!route) report("invalid-route", "routeId");
  if (record.canonicalPath.state === "approved" && (!decided(record.canonicalPath) || record.canonicalPath.value !== route?.path)) report("invalid-canonical", "canonicalPath");
  // Reuse canonical entity validation without mutating the existing route source.
  if (route && validateRouteRegistry([{ ...route, publication: { status: "draft" }, indexability: tbf, primaryCTA: tbf,
    parentId: null, path: "/", slug: null, relatedEntities: record.relatedEntities, entity: undefined }], data).some((i) => i.code === "invalid-entity")) report("invalid-reference", "relatedEntities");
  const checkCTA = (cta: CTA, field: string) => {
    if (!cta.label.trim() || validateCTAReferences(cta, source, data).length
      || (cta.kind === "navigation" && cta.destination.fragment && !fragmentExists(cta.destination.routeId, cta.destination.fragment))) report("invalid-cta", field);
    if (complete && cta.kind !== "submit-enquiry" && !resolvePublicCTA(cta, source, data, fragmentExists)) report("route-not-ready", field);
    if (cta.kind === "submit-enquiry" && (!decided(record.operationalReview) || record.operationalReview.value !== true)) report("missing-approval", "operationalReview");
  };
  const checkProofIds = (ids: readonly ProofId[], field: string) => {
    if (new Set(ids).size !== ids.length) report("invalid-reference", field);
    for (const id of ids) {
      const proof = evidence.find((p) => p.id === id);
      if (!proof) report("invalid-reference", field);
      else if (!proofReady(proof)) report("missing-evidence", field);
    }
  };
  checkProofIds(record.proofIds, "proofIds");
  if (record.cta.state === "approved") checkCTA(record.cta.value, "cta");
  if (route?.primaryCTA.state === "approved" && record.cta.state === "approved"
    && !areCTAsEquivalent(route.primaryCTA.value, record.cta.value)) report("invalid-cta", "route.primaryCTA");
  if (record.sections.state === "approved") {
    const ids = new Set<string>();
    for (const section of record.sections.value) {
      if (!parseSlug(section.id) || ids.has(section.id) || !section.heading.trim() || !section.body.trim()) report("invalid-section", section.id);
      ids.add(section.id); checkProofIds(section.proofIds, section.id);
      if (section.cta) checkCTA(section.cta, section.id);
      for (const claim of section.claims) if (!claim.text.trim() || !verified(claim.verification)) report("missing-evidence", section.id);
      if (section.role === "evidence" && !section.proofIds.length && !section.claims.length) report("missing-evidence", section.id);
    }
  }
  if (!complete) return Object.freeze(issues);
  for (const field of ["title", "summary", "heading"] as const) if (!textReady(record[field])) report("missing-content", field);
  for (const field of ["canonicalPath", "cta", "sections", "factualReview"] as const) if (!decided<unknown>(record[field])) report("missing-approval", field);
  if (decided(record.factualReview) && record.factualReview.value !== true) report("missing-approval", "factualReview");
  if (!(record.publication.status === "approved" || record.publication.status === "published") || !record.publication.approvalReference.trim()) report("missing-approval", "publication");
  if (record.publication.status === "published" && !record.publication.publishedAt.trim()) report("missing-approval", "publishedAt");
  if (route) {
    const sections = record.sections.state === "approved" ? record.sections.value : empty;
    for (const role of requiredSectionRoles(route.type)) if (!sections.some((s) => s.role === role)) report("missing-section", role);
    if (route.type === "legal" && (!decided(record.legalReview) || record.legalReview.value !== true)) report("missing-approval", "legalReview");
    if (route.type === "conversion" && (!decided(record.operationalReview) || record.operationalReview.value !== true)) report("missing-approval", "operationalReview");
    if (!textReady(route.metadata.title) || !textReady(route.metadata.description) || !decided(route.indexability)) report("missing-seo", "route.metadata/indexability");
    if (!getPublicRouteById(route.id, source, data, fragmentExists)) report("route-not-ready", "routeId");
  }
  return Object.freeze(issues);
}

function inspectRegistry(source: readonly PageContent[], routeSource: readonly RouteDefinition[], evidence: readonly Proof[], data: RelationshipRegistry): readonly ContentIssue[] {
  const issues: ContentIssue[] = [], ids = new Set<string>(), targets = new Set<string>();
  const report = (code: ContentIssue["code"], contentId: string, field: string) => issues.push(Object.freeze({ code, contentId, field }));
  const fragmentExists = contentFragments(source);
  if (validateRouteRegistry(routeSource, data, fragmentExists).length) report("invalid-route", "registry", "routes");
  const evidenceIds = new Set<string>();
  for (const proof of evidence) {
    if (evidenceIds.has(proof.id)) report("duplicate-id", proof.id, "proofs");
    evidenceIds.add(proof.id);
    if (proof.routeId && !getRouteById(proof.routeId, routeSource)) report("invalid-route", proof.id, "routeId");
    if (proof.publication.status === "published" && proof.routeId && !getPublicRouteById(proof.routeId, routeSource, data, fragmentExists)) report("unsafe-publication", proof.id, "routeId");
    const probe = routeSource[0];
    if (probe && validateRouteRegistry([{ ...probe, publication: { status: "draft" }, indexability: tbf,
      primaryCTA: tbf, parentId: null, path: "/", slug: null, entity: undefined, relatedEntities: proof.relatedEntities }], data)
      .some((issue) => issue.code === "invalid-entity")) report("invalid-reference", proof.id, "relatedEntities");
    if (proof.publication.status === "published" && !proofReady(proof)) report("missing-evidence", proof.id, "verification/content");
  }
  const titles = new Set<string>(), descriptions = new Set<string>();
  for (const record of source) {
    if (ids.has(record.id)) report("duplicate-id", record.id, "id");
    if (targets.has(record.routeId)) report("duplicate-route", record.id, "routeId");
    ids.add(record.id); targets.add(record.routeId);
    issues.push(...inspectContent(record, routeSource, evidence, data, false, fragmentExists));
    if (record.publication.status === "published") {
      if (inspectContent(record, routeSource, evidence, data, true, fragmentExists).length) report("unsafe-publication", record.id, "readiness");
    }
    const route = getRouteById(record.routeId, routeSource);
    if (route?.indexability.state === "approved" && route.indexability.value.index
      && (record.publication.status === "approved" || record.publication.status === "published")) {
      for (const [field, values] of [["title", titles], ["description", descriptions]] as const) {
        const metadata = route.metadata[field];
        if (textReady(metadata) && metadata.state === "approved") {
          const normalized = metadata.value.trim().toLowerCase();
          if (values.has(normalized)) report("duplicate-seo", record.id, field);
          values.add(normalized);
        }
      }
    }
  }
  return Object.freeze(issues);
}

function intrinsicIssues(record: PageContent, source: readonly PageContent[], routeSource: readonly RouteDefinition[], evidence: readonly Proof[], origin: Decision<string> | undefined, data: RelationshipRegistry): readonly ContentIssue[] {
  const fragmentExists = contentFragments(source);
  const issues = [...inspectContent(record, routeSource, evidence, data, true, fragmentExists)];
  const route = getRouteById(record.routeId, routeSource);
  if (origin && route?.indexability.state === "approved" && route.indexability.value.index) {
    // Reuse M4.8 origin/publication policy without altering the route's actual sitemap decision.
    const checked = routeSource.map((r) => r.id === route.id ? { ...r, indexability: { ...route.indexability, value: { index: true, follow: true, sitemap: true } } } as RouteDefinition : r);
    if (!getSitemapRoutes(checked, origin, data, fragmentExists).some((r) => r.id === route.id)) issues.push(Object.freeze({ code: "missing-seo", contentId: record.id, field: "siteOrigin" }));
  }
  return Object.freeze(issues);
}
type ContentDependency = Readonly<{ routeId: RouteId; field: string }>;
function dependencies(record: PageContent, routeSource: readonly RouteDefinition[], evidence: readonly Proof[]): readonly ContentDependency[] {
  const result: ContentDependency[] = [];
  const addCTA = (cta: CTA, field: string) => {
    if (cta.kind !== "submit-enquiry") result.push({ routeId: cta.destination.routeId, field });
  };
  const addProof = (id: ProofId, field: string) => {
    const proof = evidence.find((p) => p.id === id);
    if (proof?.routeId) result.push({ routeId: proof.routeId, field });
  };
  if (record.cta.state === "approved") addCTA(record.cta.value, "cta.destination");
  record.proofIds.forEach((id) => addProof(id, "proofIds.destination"));
  if (record.sections.state === "approved") for (const section of record.sections.value) {
    if (section.cta) addCTA(section.cta, `sections.${section.id}.cta`);
    section.proofIds.forEach((id) => addProof(id, `sections.${section.id}.proofIds`));
  }
  const parent = getRouteById(record.routeId, routeSource)?.parentId;
  if (parent) result.push({ routeId: parent, field: "parent.content" });
  return result;
}
/** Two passes: independently verify each record, then prune invalid dependency chains.
 * Complete published cycles survive; no visit/self-link can manufacture approval. */
function reviewRegistry(source: readonly PageContent[], routeSource: readonly RouteDefinition[], evidence: readonly Proof[], origin: Decision<string> | undefined, data: RelationshipRegistry) {
  const issues = [...inspectRegistry(source, routeSource, evidence, data)];
  const local = new Map(source.map((record) => [record.id, intrinsicIssues(record, source, routeSource, evidence, origin, data)]));
  for (const record of source) if (record.publication.status === "published" && local.get(record.id)?.length
    && !issues.some((issue) => issue.contentId === record.id && issue.code === "unsafe-publication")) {
    issues.push(Object.freeze({ code: "unsafe-publication", contentId: record.id, field: "readiness" }));
  }
  const eligible = new Set(source.filter((record) => record.publication.status === "published" && !local.get(record.id)?.length).map((record) => record.routeId));
  let changed = true;
  while (changed) {
    changed = false;
    for (const record of source) if (eligible.has(record.routeId)
      && dependencies(record, routeSource, evidence).some((dependency) => !eligible.has(dependency.routeId))) {
      eligible.delete(record.routeId); changed = true;
    }
  }
  const dependencyIssues = (record: PageContent): readonly ContentIssue[] => Object.freeze(dependencies(record, routeSource, evidence)
    .filter((dependency) => dependency.routeId !== record.routeId && !eligible.has(dependency.routeId))
    .map((dependency) => Object.freeze({ code: "unsafe-publication" as const, contentId: record.id, field: dependency.field })));
  for (const record of source) if (record.publication.status === "published") issues.push(...dependencyIssues(record));
  for (const proof of evidence) if (proof.publication.status === "published" && proof.routeId && !eligible.has(proof.routeId)) {
    issues.push(Object.freeze({ code: "unsafe-publication", contentId: proof.id, field: "destination.content" }));
  }
  return { issues: Object.freeze(issues), eligible, local, dependencyIssues };
}
export function validateContentRegistry(source = content, routeSource = routes, evidence = proofs, data = relationshipRegistry, origin?: Decision<string>): readonly ContentIssue[] {
  return reviewRegistry(source, routeSource, evidence, origin, data).issues;
}
export type ContentReadiness = Readonly<{ ready: boolean; issues: readonly ContentIssue[] }>;
export function getContentReadiness(id: string, source = content, routeSource = routes, evidence = proofs, origin: Decision<string> = siteOrigin, data = relationshipRegistry): ContentReadiness {
  const review = reviewRegistry(source, routeSource, evidence, origin, data);
  const record = getContentById(id, source);
  const issues = [...review.issues];
  if (!record) issues.push(Object.freeze({ code: "invalid-reference", contentId: id, field: "id" }));
  else issues.push(...(review.local.get(record.id) ?? []), ...review.dependencyIssues(record));
  return Object.freeze({ ready: issues.length === 0, issues: Object.freeze(issues) });
}
export function getPublicationEligibleContent(source = content, routeSource = routes, evidence = proofs, origin: Decision<string> = siteOrigin, data = relationshipRegistry): readonly PageContent[] {
  const review = reviewRegistry(source, routeSource, evidence, origin, data);
  return review.issues.length ? empty : Object.freeze(source.filter((record) => review.eligible.has(record.routeId)));
}
/** Public link boundary: route, content, selections, evidence and verified section IDs. */
export function resolvePublicationSafeCTA(cta: CTA, source = content, routeSource = routes, evidence = proofs, origin: Decision<string> = siteOrigin, data = relationshipRegistry): ResolvedCTALink | undefined {
  if (cta.kind === "submit-enquiry" || !getPublicationEligibleContent(source, routeSource, evidence, origin, data).some((record) => record.routeId === cta.destination.routeId)) return undefined;
  return resolvePublicCTA(cta, routeSource, data, contentFragments(source));
}
