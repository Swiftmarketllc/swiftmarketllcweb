import type {
  CanonicalPath, CTA, ConversionCTA, NavigationGroup, NavigationItem,
  PackageSelection, RouteDefinition, RouteId, ServiceId, Slug,
} from "@/lib/domain";
import { packageCatalog } from "@/lib/data/packages";
import { relationshipRegistry } from "@/lib/data/relationships";
import type { RelationshipRegistry } from "@/lib/data/relationships";
import { getRouteById, getPublicRouteById, isPublicCTAContext, routes, validateCTAReferences } from "@/lib/data/routes";
import type { RouteFragmentValidator } from "@/lib/data/routes";

/** Architecture CTA candidates only. No CTA becomes a working public link by declaration. */
export const consultationCTA = Object.freeze({ kind: "enquiry-link", intent: "request-consultation", label: "Request a Consultation", destination: Object.freeze({ routeId: "route:consultation" }) } as const satisfies ConversionCTA);
export const proposalCTA = Object.freeze({ kind: "enquiry-link", intent: "request-proposal", label: "Request a Proposal", destination: Object.freeze({ routeId: "route:proposal" }) } as const satisfies ConversionCTA);
export const enterpriseCTA = Object.freeze({ ...consultationCTA, context: Object.freeze({ enterprise: true } as const) } satisfies ConversionCTA);
export const projectBriefCTA = Object.freeze({ kind: "enquiry-link", intent: "send-project-brief", label: "Send a Project Brief", destination: Object.freeze({ routeId: "route:contact" }) } as const satisfies ConversionCTA);
export const comparePackagesCTA = Object.freeze({ kind: "navigation", intent: "compare", label: "Compare Packages", destination: Object.freeze({ routeId: "route:packages:compare" }) } as const satisfies CTA);

const selections = [
  { packageId: packageCatalog.startup.basic.id, segment: "startup", tier: "basic" },
  { packageId: packageCatalog.startup.standard.id, segment: "startup", tier: "standard" },
  { packageId: packageCatalog.startup.premium.id, segment: "startup", tier: "premium" },
  { packageId: packageCatalog["growing-business"].basic.id, segment: "growing-business", tier: "basic" },
  { packageId: packageCatalog["growing-business"].standard.id, segment: "growing-business", tier: "standard" },
  { packageId: packageCatalog["growing-business"].premium.id, segment: "growing-business", tier: "premium" },
] as const satisfies readonly PackageSelection[];
export const packageEnquiryCTAs: readonly ConversionCTA[] = Object.freeze(selections.map((selection) => Object.freeze({
  ...proposalCTA, context: Object.freeze({ package: Object.freeze(selection) }),
})));

export function getIndividualServiceEnquiryCTA(id: ServiceId, data = relationshipRegistry): ConversionCTA | undefined {
  if (!data.services.some((s) => s.id === id)) return undefined;
  return Object.freeze({ ...proposalCTA, context: Object.freeze({ serviceIds: Object.freeze([id]) }) });
}

function item(group: string, id: RouteId): NavigationItem {
  const route = getRouteById(id);
  if (!route) throw new Error("Navigation candidate lacks a registered route");
  return Object.freeze({ kind: "link", id: `nav:${group}:${id}`, label: route.label, routeId: id });
}
function group(id: NavigationGroup["id"], label: string, targets: readonly RouteId[]): NavigationGroup {
  return Object.freeze({ id, label, items: Object.freeze(targets.map((target) => item(id, target))) });
}
/** Existing architecture labels only. Conditional resources are omitted until registered. */
export const navigationGroups: readonly NavigationGroup[] = Object.freeze([
  group("nav-group:primary", "Primary navigation", ["route:services", "route:packages", "route:enterprise", "route:industries", "route:about", "route:consultation"]),
  group("nav-group:utility", "Utility navigation", ["route:home", "route:contact"]),
  group("nav-group:company", "Company", ["route:about", "route:contact"]),
  group("nav-group:solutions", "Solutions", ["route:services", "route:packages", "route:enterprise", "route:industries"]),
  group("nav-group:legal", "Legal", ["route:privacy"]),
]);
export const packageNavigation: NavigationItem = Object.freeze({
  kind: "disclosure", id: "nav:packages-disclosure", label: "Packages", routeId: "route:packages",
  children: Object.freeze([item("packages-disclosure", "route:packages:startup"), item("packages-disclosure", "route:packages:growing-business"), item("packages-disclosure", "route:packages:compare")]),
});

export type NavigationIssue = Readonly<{ code: "duplicate-id" | "cycle" | "missing-route" | "unverified-fragment"; id: string }>;
export function validateNavigation(groups = navigationGroups, source = routes, fragmentExists?: RouteFragmentValidator): readonly NavigationIssue[] {
  const issues: NavigationIssue[] = [], ids = new Set<string>();
  const report = (code: NavigationIssue["code"], id: string) => issues.push(Object.freeze({ code, id }));
  const walk = (node: NavigationItem, ancestors: Set<NavigationItem>) => {
    if (ancestors.has(node)) { report("cycle", node.id); return; }
    if (ids.has(node.id)) report("duplicate-id", node.id);
    ids.add(node.id);
    if (!getRouteById(node.routeId, source)) report("missing-route", node.id);
    if (node.kind === "link" && node.fragment && !fragmentExists?.(node.routeId, node.fragment)) report("unverified-fragment", node.id);
    if (node.kind === "disclosure") {
      const next = new Set(ancestors); next.add(node);
      node.children.forEach((child) => walk(child, next));
    }
  };
  for (const candidate of groups) {
    if (ids.has(candidate.id)) report("duplicate-id", candidate.id);
    ids.add(candidate.id);
    candidate.items.forEach((node) => walk(node, new Set()));
  }
  return Object.freeze(issues);
}

/** Route-only compatibility helper; public consumers supply the content gate via public-consumers. */
export function filterPublicNavigation(groups = navigationGroups, source = routes, data = relationshipRegistry, fragmentExists?: RouteFragmentValidator, contentEligible?: (id: RouteId) => boolean): readonly NavigationGroup[] {
  if (validateNavigation(groups, source, fragmentExists).length) return Object.freeze([]);
  const filter = (node: NavigationItem): NavigationItem | undefined => {
    if (!getPublicRouteById(node.routeId, source, data, fragmentExists) || (contentEligible && !contentEligible(node.routeId))) return undefined;
    if (node.kind === "link") return node;
    const children = node.children.map(filter).filter((child): child is NavigationItem => !!child);
    return children.length ? Object.freeze({ ...node, children: Object.freeze(children) })
      : Object.freeze({ kind: "link", id: node.id, label: node.label, routeId: node.routeId });
  };
  return Object.freeze(groups.map((candidate) => Object.freeze({ ...candidate,
    items: Object.freeze(candidate.items.map(filter).filter((node): node is NavigationItem => !!node)),
  })).filter((candidate) => candidate.items.length));
}

export type ResolvedCTALink = Readonly<{ cta: CTA; path: CanonicalPath; fragment?: Slug }>;
/** Route-only building block. Public application code uses the public-consumers entry point. */
export function resolvePublicCTA(cta: CTA, source: readonly RouteDefinition[] = routes, data: RelationshipRegistry = relationshipRegistry, fragmentExists?: RouteFragmentValidator): ResolvedCTALink | undefined {
  if (cta.kind === "submit-enquiry" || (cta.kind === "navigation" && cta.destination.fragment && !fragmentExists?.(cta.destination.routeId, cta.destination.fragment))
    || validateCTAReferences(cta, source, data).length || !isPublicCTAContext(cta, data)) return undefined;
  const target = getPublicRouteById(cta.destination.routeId, source, data, fragmentExists);
  return target ? Object.freeze({ cta, path: target.path,
    ...(cta.kind === "navigation" && cta.destination.fragment ? { fragment: cta.destination.fragment } : {}),
  }) : undefined;
}
