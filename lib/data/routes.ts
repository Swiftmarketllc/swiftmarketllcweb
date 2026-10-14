import type {
  CanonicalPath, CTA, Decision, RouteDefinition, RouteEntity, RouteId,
  SelectionContext, Slug, SolutionReference,
} from "@/lib/domain";
import { parseSlug } from "@/lib/domain/helpers";
import { packages } from "@/lib/data/packages";
import { serviceFamilies } from "@/lib/data/services";
import { industries } from "@/lib/data/industries";
import { relationshipRegistry, validateRelationshipRegistry } from "@/lib/data/relationships";
import type { RelationshipRegistry } from "@/lib/data/relationships";

const tbf = Object.freeze({ state: "tbf" } as const);
export const siteOrigin: Decision<string> = tbf;
const empty = Object.freeze([]);
const prerequisites = Object.freeze([
  "Distinct approved content and intent", "Verified commercial relationships where applicable",
  "Approved SEO/origin and indexing decision", "Implemented and verified destination behavior",
]);
type RouteIdentity = Pick<RouteDefinition, "id" | "path" | "label" | "type" | "parentId" | "milestone">
  & Partial<Pick<RouteDefinition, "entity">>;
function draftRoute(identity: RouteIdentity, scope: RouteDefinition["scope"] = "mvp-fixed"): RouteDefinition {
  const slug = identity.path === "/" ? null : parseSlug(identity.path.split("/").pop());
  if (identity.path !== "/" && slug === null) throw new Error("Invalid canonical route slug");
  return Object.freeze({
    ...identity, ...(identity.entity ? { entity: Object.freeze(identity.entity) } : {}), slug, scope,
    publication: Object.freeze({ status: "draft" } as const), audience: tbf, seoIntent: tbf,
    primaryCTA: tbf, indexability: tbf, metadata: Object.freeze({ title: tbf, description: tbf }),
    dataSource: tbf, contentOwner: tbf, template: tbf, generation: "tbf",
    publicationPrerequisites: prerequisites, relatedEntities: empty, aliases: empty,
    verification: "not-reviewed",
  });
}
const packageRoutes = packages.map((p) => draftRoute({
  id: `route:package:${p.segment}:${p.tier}`, path: `/packages/${p.slug}`,
  label: p.name, type: "package-tier", parentId: `route:packages:${p.segment}`,
  milestone: "M6", entity: { kind: "package", id: p.id },
}));

/** The 19 fixed identities aligned to v3.0 doc 00 §5; architecture records, not filesystem pages. */
export const fixedRoutes: readonly RouteDefinition[] = Object.freeze([
  draftRoute({ id: "route:home", path: "/", label: "Home", type: "home", parentId: null, milestone: "M5" }),
  draftRoute({ id: "route:about", path: "/about", label: "About", type: "company", parentId: "route:home", milestone: "M5" }),
  draftRoute({ id: "route:services", path: "/services", label: "Services", type: "services-hub", parentId: "route:home", milestone: "M6" }),
  draftRoute({ id: "route:packages", path: "/packages", label: "Packages", type: "packages-hub", parentId: "route:home", milestone: "M6" }),
  draftRoute({ id: "route:packages:startup", path: "/packages/startup", label: "Startup Business", type: "package-segment", parentId: "route:packages", milestone: "M6" }),
  ...packageRoutes.filter((r) => r.parentId === "route:packages:startup"),
  draftRoute({ id: "route:packages:growing-business", path: "/packages/growing-business", label: "Growing Business", type: "package-segment", parentId: "route:packages", milestone: "M6" }),
  ...packageRoutes.filter((r) => r.parentId === "route:packages:growing-business"),
  draftRoute({ id: "route:packages:compare", path: "/packages/compare", label: "Compare Packages", type: "package-comparison", parentId: "route:packages", milestone: "M6" }),
  draftRoute({ id: "route:enterprise", path: "/enterprise", label: "Enterprise", type: "enterprise", parentId: "route:home", milestone: "M8", entity: { kind: "enterprise" } }),
  draftRoute({ id: "route:industries", path: "/industries", label: "Industries", type: "industries-hub", parentId: "route:home", milestone: "M7" }),
  draftRoute({ id: "route:consultation", path: "/consultation", label: "Request a Consultation", type: "conversion", parentId: "route:home", milestone: "M5 shell; M8 operational" }),
  draftRoute({ id: "route:proposal", path: "/proposal", label: "Request a Proposal", type: "conversion", parentId: "route:home", milestone: "M5 shell; M8 operational" }),
  draftRoute({ id: "route:contact", path: "/contact", label: "Contact", type: "conversion", parentId: "route:home", milestone: "M5 shell; M8 operational" }),
  draftRoute({ id: "route:privacy", path: "/privacy", label: "Privacy", type: "legal", parentId: "route:home", milestone: "M9" }),
]);

export const conditionalRoutes: readonly RouteDefinition[] = Object.freeze([
  ...serviceFamilies.map((f) => draftRoute({ id: `route:service-family:${f.slug}`, path: `/services/${f.slug}`,
    label: f.name, type: "service-family", parentId: "route:services", milestone: "M6", entity: { kind: "service-family", id: f.id } }, "conditional")),
  ...industries.map((i) => draftRoute({ id: `route:industry:${i.slug}`, path: `/industries/${i.slug}`,
    label: i.name, type: "industry", parentId: "route:industries", milestone: "M7", entity: { kind: "industry", id: i.id } }, "conditional")),
]);
export const routes: readonly RouteDefinition[] = Object.freeze([...fixedRoutes, ...conditionalRoutes]);

/** Exact lookups include drafts; no normalization, aliases or fallback records. */
export function getRouteById(id: string, source = routes): RouteDefinition | undefined { return source.find((r) => r.id === id); }
export function getRouteByPath(path: string, source = routes): RouteDefinition | undefined { return source.find((r) => r.path === path); }

export type RouteIssue = Readonly<{ code: "duplicate-id" | "duplicate-path" | "invalid-path" | "invalid-slug"
  | "invalid-parent" | "cycle" | "invalid-entity" | "invalid-cta" | "invalid-context"
  | "unsafe-publication" | "unsafe-indexing" | "invalid-data"; routeId: string }>;
const hasId = (records: readonly { id: string }[], id: string) => records.some((r) => r.id === id);
function entityRecord(entity: SolutionReference | RouteEntity, data: RelationshipRegistry) {
  switch (entity.kind) {
    case "service-family": return data.families.find((r) => r.id === entity.id);
    case "service": return data.services.find((r) => r.id === entity.id);
    case "industry": return data.industries.find((r) => r.id === entity.id);
    case "package": return data.packages.find((r) => r.id === entity.id);
    case "enterprise": return data.enterprise;
    case "project": return data.projects.state === "approved" ? data.projects.value.find((r) => r.id === entity.id) : undefined;
    case "add-on": return data.addOns.state === "approved" ? data.addOns.value.find((r) => r.id === entity.id) : undefined;
    case "content": return undefined; // no approved content registry exists yet
  }
}
function contextValid(context: SelectionContext | undefined, data: RelationshipRegistry): boolean {
  if (!context) return true;
  const selection = context.package;
  return (!context.familyId || hasId(data.families, context.familyId))
    && (!context.industryId || hasId(data.industries, context.industryId))
    && (!context.serviceIds || (new Set(context.serviceIds).size === context.serviceIds.length && context.serviceIds.every((id) => hasId(data.services, id))))
    && (!selection || data.packages.some((p) => p.id === selection.packageId && p.segment === selection.segment && p.tier === selection.tier))
    && (!context.projectId || (data.projects.state === "approved" && hasId(data.projects.value, context.projectId)))
    && (!context.addOnIds || (data.addOns.state === "approved" && new Set(context.addOnIds).size === context.addOnIds.length && context.addOnIds.every((id) => data.addOns.state === "approved" && hasId(data.addOns.value, id))));
}
const conversionTargets = Object.freeze({
  "request-consultation": "route:consultation", "request-proposal": "route:proposal",
  "send-project-brief": "route:contact",
});
export function validateCTAReferences(cta: CTA, source = routes, data = relationshipRegistry): readonly RouteIssue[] {
  const issues: RouteIssue[] = [];
  if (cta.kind !== "submit-enquiry") {
    const target = getRouteById(cta.destination.routeId, source);
    if (!target || (cta.kind === "enquiry-link" && target.id !== conversionTargets[cta.intent])) {
      issues.push(Object.freeze({ code: "invalid-cta", routeId: cta.destination.routeId }));
    }
    if (cta.kind === "enquiry-link" && !contextValid(cta.context, data)) issues.push(Object.freeze({ code: "invalid-context", routeId: cta.destination.routeId }));
  }
  return Object.freeze(issues);
}
function routeReady(r: RouteDefinition): boolean {
  return r.publication.status === "published" && !!r.publication.approvalReference.trim() && !!r.publication.publishedAt.trim()
    && r.verification === "reviewed" && r.metadata.title.state === "approved" && !!r.metadata.title.approvalReference.trim()
    && !!r.metadata.title.value.trim() && r.metadata.description.state === "approved" && !!r.metadata.description.approvalReference.trim()
    && !!r.metadata.description.value.trim() && r.indexability.state === "approved" && !!r.indexability.approvalReference.trim()
    && r.primaryCTA.state === "approved" && !!r.primaryCTA.approvalReference.trim()
    && [r.audience, r.seoIntent, r.dataSource, r.contentOwner, r.template].every((d) => d.state === "approved" && !!d.approvalReference.trim())
    && r.generation !== "tbf";
}
function entityPublic(entity: SolutionReference | RouteEntity, data: RelationshipRegistry): boolean {
  const record = entityRecord(entity, data);
  return record?.publication.status === "published" && !("availability" in record && (record.availability === "tbf" || record.availability === "coming-soon" || record.availability === "unavailable"));
}
export function isPublicCTAContext(cta: CTA, data = relationshipRegistry): boolean {
  if (cta.kind !== "enquiry-link" || !cta.context) return true;
  if (!contextValid(cta.context, data)) return false;
  const context = cta.context, references: SolutionReference[] = [];
  if (context.familyId) references.push({ kind: "service-family", id: context.familyId });
  if (context.industryId) references.push({ kind: "industry", id: context.industryId });
  if (context.package) references.push({ kind: "package", id: context.package.packageId });
  if (context.enterprise) references.push({ kind: "enterprise" });
  if (context.projectId) references.push({ kind: "project", id: context.projectId });
  for (const id of context.serviceIds ?? []) references.push({ kind: "service", id });
  for (const id of context.addOnIds ?? []) references.push({ kind: "add-on", id });
  return references.every((reference) => entityPublic(reference, data));
}

/** Trusted content adapter supplies section existence; absent adapters reject fragments. */
export type RouteFragmentValidator = (routeId: RouteId, fragment: Slug) => boolean;
export function validateRouteRegistry(source = routes, data = relationshipRegistry, fragmentExists?: RouteFragmentValidator): readonly RouteIssue[] {
  const issues: RouteIssue[] = [];
  const report = (code: RouteIssue["code"], id: string) => issues.push(Object.freeze({ code, routeId: id }));
  const ids = new Set<string>(), paths = new Set<string>();
  if (validateRelationshipRegistry(data).length) report("invalid-data", "registry");
  for (const r of source) {
    if (ids.has(r.id)) report("duplicate-id", r.id);
    if (paths.has(r.path)) report("duplicate-path", r.id);
    ids.add(r.id); paths.add(r.path);
    if (!/^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*)?$/.test(r.path)) report("invalid-path", r.id);
    if (r.path === "/" ? r.slug !== null || r.parentId !== null : r.slug !== r.path.split("/").pop() || parseSlug(r.slug) === null) report("invalid-slug", r.id);
    if (r.path !== "/" && r.parentId === null) report("invalid-parent", r.id);
    if (r.entity && !entityRecord(r.entity, data)) report("invalid-entity", r.id);
    for (const entity of r.relatedEntities) if (!entityRecord(entity, data)) report("invalid-entity", r.id);
    const visited = new Set<string>();
    let ancestor: RouteDefinition | undefined = r;
    while (ancestor) {
      if (visited.has(ancestor.id)) { report("cycle", r.id); break; }
      visited.add(ancestor.id);
      if (ancestor.parentId === null) break;
      const parent: RouteDefinition | undefined = getRouteById(ancestor.parentId, source);
      if (!parent) { report("invalid-parent", r.id); break; }
      ancestor = parent;
    }
    if (r.primaryCTA.state === "approved") issues.push(...validateCTAReferences(r.primaryCTA.value, source, data));
    if (r.indexability.state === "approved" && r.indexability.value.sitemap && (!r.indexability.value.index || r.publication.status !== "published")) report("unsafe-indexing", r.id);
    if (r.publication.status !== "published" && r.indexability.state === "approved" && r.indexability.value.index) report("unsafe-indexing", r.id);
    if (r.publication.status === "published") {
      if (!routeReady(r) || (r.entity && !entityPublic(r.entity, data))) report("unsafe-publication", r.id);
      if (r.parentId && !source.some((p) => p.id === r.parentId && routeReady(p))) report("unsafe-publication", r.id);
      if (r.primaryCTA.state === "approved" && r.primaryCTA.value.kind !== "submit-enquiry") {
        const cta = r.primaryCTA.value, target = getRouteById(cta.destination.routeId, source);
        if (!target || !routeReady(target) || !isPublicCTAContext(cta, data)
          || (cta.kind === "navigation" && cta.destination.fragment && !fragmentExists?.(cta.destination.routeId, cta.destination.fragment))) report("unsafe-publication", r.id);
      }
    }
  }
  return Object.freeze(issues);
}

export function getPublicRouteById(id: string, source = routes, data = relationshipRegistry, fragmentExists?: RouteFragmentValidator): RouteDefinition | undefined {
  if (validateRouteRegistry(source, data, fragmentExists).length) return undefined;
  const route = getRouteById(id, source);
  if (!route || !routeReady(route)) return undefined;
  let parent = route.parentId;
  while (parent) {
    const record = getRouteById(parent, source);
    if (!record || !routeReady(record)) return undefined;
    parent = record.parentId;
  }
  return route;
}

export type Breadcrumb = Readonly<{ routeId: RouteId; label: string; current: boolean; path?: CanonicalPath }>;
export type BreadcrumbResult = Readonly<{ state: "resolved"; items: readonly Breadcrumb[] }>
  | Readonly<{ state: "invalid"; reason: "not-found" | "cycle" | "missing-parent" | "unpublished" }>;
/** Route-only compatibility helper; public consumers additionally require eligible content. */
export function resolveBreadcrumbs(id: string, source = routes, mode: "public" | "editorial" = "public", data = relationshipRegistry, fragmentExists?: RouteFragmentValidator): BreadcrumbResult {
  const chain: RouteDefinition[] = [], seen = new Set<string>();
  let current = getRouteById(id, source);
  if (!current) return Object.freeze({ state: "invalid", reason: "not-found" });
  while (current) {
    if (seen.has(current.id)) return Object.freeze({ state: "invalid", reason: "cycle" });
    seen.add(current.id); chain.unshift(current);
    if (current.parentId === null) break;
    current = getRouteById(current.parentId, source);
    if (!current) return Object.freeze({ state: "invalid", reason: "missing-parent" });
  }
  if (mode === "public" && chain.some((r) => !getPublicRouteById(r.id, source, data, fragmentExists))) return Object.freeze({ state: "invalid", reason: "unpublished" });
  return Object.freeze({ state: "resolved", items: Object.freeze(chain.map((r, index) => Object.freeze({
    routeId: r.id, label: r.label, current: index === chain.length - 1,
    ...(index === chain.length - 1 ? {} : { path: r.path }),
  }))) });
}

/** Eligibility only; no sitemap handler or absolute canonical URLs are emitted. */
export function getSitemapRoutes(source = routes, origin = siteOrigin, data = relationshipRegistry, fragmentExists?: RouteFragmentValidator): readonly RouteDefinition[] {
  if (origin.state !== "approved" || !origin.approvalReference.trim()) return empty;
  try {
    const url = new URL(origin.value);
    if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash || url.pathname !== "/"
      || /^(localhost|127\.|0\.|\[::1\])/.test(url.hostname) || url.hostname.endsWith(".localhost")) return empty;
  } catch { return empty; }
  return Object.freeze(source.filter((r) => getPublicRouteById(r.id, source, data, fragmentExists)
    && r.indexability.state === "approved" && r.indexability.value.index && r.indexability.value.sitemap));
}
