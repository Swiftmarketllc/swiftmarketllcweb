import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

// Existing in-memory convention. Only trusted public/helper modules are allowed.
const paths = {
  "@/lib/domain/helpers": "../domain/helpers.ts", "@/lib/data/services": "./services.ts",
  "@/lib/data/industries": "./industries.ts", "@/lib/data/packages": "./packages.ts",
  "@/lib/data/relationships": "./relationships.ts", "@/lib/data/routes": "./routes.ts",
  "@/lib/data/navigation": "./navigation.ts",
};
const modules = new Map();
function load(name) {
  assert.equal(Object.hasOwn(paths, name), true, `Unexpected import: ${name}`);
  if (modules.has(name)) return modules.get(name);
  const compiled = ts.transpileModule(readFileSync(new URL(paths[name], import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const exports = {}; modules.set(name, exports);
  runInNewContext(compiled, { exports, require: load, URL });
  return exports;
}
const data = load("@/lib/data/routes"), nav = load("@/lib/data/navigation");
const registries = load("@/lib/data/relationships");
const approved = (value) => Object.freeze({ state: "approved", value: Object.freeze(value), approvalReference: "SYNTHETIC TEST APPROVAL ONLY" });
function readDoc(name) { return readFileSync(new URL(`../../docs/${name}`, import.meta.url), "utf8"); }
function fixedPaths(document, heading, ending) {
  return document.split(heading)[1].split(ending)[0].split("\n")
    .filter((line) => /^\| \/[^|]* \|/.test(line)).slice(0, 19).map((line) => line.split("|")[1].trim());
}

// SYNTHETIC TEST FIXTURES ONLY. Publishing copies never changes the real registry.
function publishedFixture(ids = ["route:home", "route:about", "route:consultation", "route:proposal", "route:contact"]) {
  return Object.freeze(data.routes.map((r) => !ids.includes(r.id) ? r : Object.freeze({
    ...r, publication: Object.freeze({ status: "published", approvalReference: "SYNTHETIC TEST APPROVAL ONLY", publishedAt: "2000-01-01T00:00:00Z" }),
    audience: approved([]), seoIntent: approved("SYNTHETIC TEST INTENT ONLY"),
    dataSource: approved("SYNTHETIC TEST SOURCE ONLY"), contentOwner: approved("SYNTHETIC TEST OWNER ONLY"),
    template: approved("SYNTHETIC TEST TEMPLATE ONLY"), generation: "static", verification: "reviewed",
    metadata: Object.freeze({ title: approved(`SYNTHETIC TEST TITLE ${r.id}`), description: approved(`SYNTHETIC TEST DESCRIPTION ${r.id}`) }),
    indexability: approved({ index: false, follow: true, sitemap: false }),
    primaryCTA: approved(r.type === "conversion" ? Object.freeze({ kind: "submit-enquiry", label: "SYNTHETIC TEST ACTION ONLY", intent: "request-consultation" }) : nav.consultationCTA),
  })));
}
const replace = (source, id, changes) => source.map((r) => r.id === id ? { ...r, ...changes } : r);
const codes = (source) => Array.from(data.validateRouteRegistry(source), (issue) => issue.code);
function deepFrozen(value) {
  if (value && typeof value === "object") {
    assert.equal(Object.isFrozen(value), true);
    for (const child of Object.values(value)) deepFrozen(child);
  }
}

test("exact 19 fixed paths match both approved architectural inventories", () => {
  const ia = fixedPaths(readDoc("information-architecture.md"), "## 5. Complete proposed sitemap", "## 6.");
  const ra = fixedPaths(readDoc("route-architecture.md"), "## 36. MVP route manifest", "## 37.");
  assert.equal(ia.length, 19); assert.equal(ra.length, 19);
  assert.equal(data.fixedRoutes.length, 19);
  const actual = Array.from(data.fixedRoutes, (r) => r.path);
  assert.deepEqual(actual, ia); assert.deepEqual(actual, ra);
  assert.equal(data.conditionalRoutes.length, 40);
  assert.equal(data.routes.length, 59);
  assert.equal(data.validateRouteRegistry().length, 0);
});

test("conditional candidates match canonical family/industry IDs and exact paths", () => {
  const { families, industries, packages } = registries.relationshipRegistry;
  for (const family of families) {
    const r = data.getRouteByPath(`/services/${family.slug}`);
    assert.equal(r.entity.id, family.id); assert.equal(r.scope, "conditional");
    assert.equal(r.parentId, "route:services");
  }
  for (const industry of industries) {
    const r = data.getRouteByPath(`/industries/${industry.slug}`);
    assert.equal(r.entity.id, industry.id); assert.equal(r.scope, "conditional");
    assert.equal(r.parentId, "route:industries");
  }
  for (const p of packages) {
    const r = data.getRouteByPath(`/packages/${p.slug}`);
    assert.equal(r.entity.id, p.id); assert.equal(r.slug, p.slug);
    assert.equal(r.parentId, `route:packages:${p.segment}`);
  }
});

test("globally unique route IDs/full paths and exact non-coercing lookups", () => {
  assert.equal(new Set(data.routes.map((r) => r.id)).size, 59);
  assert.equal(new Set(data.routes.map((r) => r.path)).size, 59);
  for (const r of data.routes) {
    assert.equal(data.getRouteById(r.id), r); assert.equal(data.getRouteByPath(r.path), r);
  }
  for (const path of ["/About", "/about/", "//about", "/about?x=1", "/about#x", "https://example.invalid/about", "/packages/basic"]) assert.equal(data.getRouteByPath(path), undefined);
  assert.equal(data.getRouteById("route:unknown"), undefined);
  assert.equal(data.getRouteById("basic"), undefined);
});

test("all real data stays deeply frozen, draft/TBF, unpublished and sitemap-ineligible", () => {
  for (const value of [data.routes, data.fixedRoutes, data.conditionalRoutes, data.siteOrigin, nav.navigationGroups, nav.packageNavigation, nav.packageEnquiryCTAs]) deepFrozen(value);
  for (const r of data.routes) {
    assert.equal(r.publication.status, "draft"); assert.equal(r.verification, "not-reviewed");
    for (const field of ["audience", "seoIntent", "primaryCTA", "indexability", "dataSource", "contentOwner", "template"]) assert.equal(r[field].state, "tbf");
    assert.equal(r.metadata.title.state, "tbf"); assert.equal(r.metadata.description.state, "tbf");
    assert.equal(data.getPublicRouteById(r.id), undefined);
  }
  assert.equal(nav.filterPublicNavigation().length, 0);
  assert.equal(data.getSitemapRoutes().length, 0);
  assert.equal(data.siteOrigin.state, "tbf");
});

test("parent hierarchy and editorial breadcrumbs resolve canonically; current item has no link", () => {
  const result = data.resolveBreadcrumbs("route:package:startup:basic", data.routes, "editorial");
  assert.equal(result.state, "resolved");
  assert.deepEqual(Array.from(result.items, (i) => i.routeId), ["route:home", "route:packages", "route:packages:startup", "route:package:startup:basic"]);
  assert.equal(result.items.at(-1).current, true); assert.equal("path" in result.items.at(-1), false);
  assert.equal(result.items[0].path, "/");
  assert.equal(data.resolveBreadcrumbs("route:package:startup:basic").reason, "unpublished");
  assert.equal(data.resolveBreadcrumbs("route:unknown").reason, "not-found");
  deepFrozen(result);
});

test("duplicate identities, malformed paths, missing parents/entities and cycles fail closed", () => {
  assert.equal(codes([...data.routes, data.routes[0]]).includes("duplicate-id"), true);
  assert.equal(codes(replace(data.routes, "route:about", { path: "/" })).includes("duplicate-path"), true);
  for (const path of ["//about", "/about/", "/About", "/a/../about", "/about?x=1", "/about#x", "/about%20", "/[slug]"]) assert.equal(codes(replace(data.routes, "route:about", { path })).includes("invalid-path"), true);
  const missing = replace(data.routes, "route:about", { parentId: "route:missing" });
  assert.equal(codes(missing).includes("invalid-parent"), true);
  assert.equal(data.resolveBreadcrumbs("route:about", missing, "editorial").reason, "missing-parent");
  const cycle = replace(data.routes, "route:packages", { parentId: "route:packages:startup" });
  assert.equal(codes(cycle).includes("cycle"), true);
  assert.equal(data.resolveBreadcrumbs("route:packages", cycle, "editorial").reason, "cycle");
  assert.equal(data.getPublicRouteById("route:home", cycle), undefined);
  assert.equal(codes(replace(data.routes, "route:about", { entity: { kind: "service", id: "service:unknown" } })).includes("invalid-entity"), true);
});

test("architecture CTA candidates target valid internal routes and preserve six package selections", () => {
  for (const cta of [nav.consultationCTA, nav.proposalCTA, nav.enterpriseCTA, nav.projectBriefCTA, nav.comparePackagesCTA, ...nav.packageEnquiryCTAs]) {
    assert.equal(data.validateCTAReferences(cta).length, 0);
    assert.equal(nav.resolvePublicCTA(cta), undefined);
  }
  assert.equal(nav.packageEnquiryCTAs.length, 6);
  assert.deepEqual(Array.from(nav.packageEnquiryCTAs, (cta) => cta.context.package.packageId), Array.from(registries.relationshipRegistry.packages, (p) => p.id));
  assert.equal(nav.getIndividualServiceEnquiryCTA("service:unknown"), undefined);
  assert.equal(nav.getIndividualServiceEnquiryCTA("family:seo"), undefined);
  assert.equal(nav.enterpriseCTA.context.enterprise, true);
});

test("CTA validation rejects wrong targets, missing references, inconsistent selections and unsupported audit", () => {
  assert.equal(data.validateCTAReferences({ ...nav.consultationCTA, destination: { routeId: "route:about" } }).length > 0, true);
  assert.equal(data.validateCTAReferences({ ...nav.consultationCTA, destination: { routeId: "route:missing" } }).length > 0, true);
  assert.equal(data.validateCTAReferences({ ...nav.proposalCTA, context: { package: { packageId: "package:startup:basic", segment: "growing-business", tier: "basic" } } }).some((i) => i.code === "invalid-context"), true);
  assert.equal(data.validateCTAReferences({ ...nav.proposalCTA, context: { serviceIds: ["family:seo"] } }).length > 0, true);
  assert.equal(data.validateCTAReferences({ kind: "enquiry-link", intent: "request-audit", label: "SYNTHETIC TEST AUDIT ONLY", destination: { routeId: "route:digital-audit" }, approvedOfferId: "audit-offer:synthetic" }).length > 0, true);
});

test("synthetic published navigation/CTA/breadcrumb views exclude every draft", () => {
  const fixture = publishedFixture();
  assert.deepEqual(codes(fixture), []);
  assert.equal(nav.resolvePublicCTA(nav.consultationCTA, fixture).path, "/consultation");
  assert.equal(nav.resolvePublicCTA(nav.enterpriseCTA, fixture), undefined); // canonical Enterprise remains draft.
  assert.equal(nav.resolvePublicCTA(nav.packageEnquiryCTAs[0], fixture), undefined);
  const groups = nav.filterPublicNavigation(nav.navigationGroups, fixture);
  assert.equal(groups.length > 0, true);
  for (const group of groups) for (const node of group.items) assert.equal(!!data.getPublicRouteById(node.routeId, fixture), true);
  assert.equal(data.resolveBreadcrumbs("route:about", fixture).state, "resolved");
  assert.equal(data.resolveBreadcrumbs("route:services", fixture).reason, "unpublished");
});

test("disclosure parents remain independent links and navigation cycles/missing routes are rejected", () => {
  const fixture = publishedFixture(["route:home", "route:consultation", "route:packages", "route:packages:startup"]);
  const groups = [{ id: "nav-group:synthetic", label: "SYNTHETIC TEST GROUP ONLY", items: [nav.packageNavigation] }];
  const filtered = nav.filterPublicNavigation(groups, fixture);
  assert.equal(filtered[0].items[0].kind, "disclosure"); assert.equal(filtered[0].items[0].routeId, "route:packages");
  assert.equal(filtered[0].items[0].children.length, 1);
  const noChildren = replace(fixture, "route:packages:startup", { publication: { status: "draft" } });
  assert.equal(nav.filterPublicNavigation(groups, noChildren)[0].items[0].kind, "link");
  const cyclic = { kind: "disclosure", id: "nav:synthetic-cycle", label: "SYNTHETIC TEST ONLY", routeId: "route:packages", children: [] };
  cyclic.children.push(cyclic);
  const invalid = [{ ...groups[0], items: [cyclic] }];
  assert.equal(nav.validateNavigation(invalid).some((i) => i.code === "cycle"), true);
  assert.equal(nav.filterPublicNavigation(invalid, fixture).length, 0);
  assert.equal(nav.validateNavigation([{ ...groups[0], items: [{ ...nav.packageNavigation, routeId: "route:missing" }] }]).some((i) => i.code === "missing-route"), true);
});

test("incomplete publication, indexing contradictions, fragments and submit actions stay unsafe", () => {
  const fixture = publishedFixture();
  for (const changes of [{ metadata: data.routes[0].metadata }, { contentOwner: { state: "tbf" } }, { verification: "not-reviewed" }, { primaryCTA: approved({ ...nav.consultationCTA, destination: { routeId: "route:services" } }) }]) assert.equal(data.getPublicRouteById("route:home", replace(fixture, "route:home", changes)), undefined);
  assert.equal(codes(replace(data.routes, "route:home", { indexability: approved({ index: true, follow: true, sitemap: true }) })).includes("unsafe-indexing"), true);
  assert.equal(codes(replace(fixture, "route:home", { indexability: approved({ index: false, follow: true, sitemap: true }) })).includes("unsafe-indexing"), true);
  assert.equal(nav.resolvePublicCTA({ kind: "submit-enquiry", intent: "request-consultation", label: "SYNTHETIC TEST ACTION ONLY" }, fixture), undefined);
  assert.equal(nav.resolvePublicCTA({ ...nav.comparePackagesCTA, destination: { routeId: "route:home", fragment: "unverified" } }, fixture), undefined);
});

test("sitemap eligibility requires approved public origin and published indexable canonical records", () => {
  const fixture = replace(publishedFixture(), "route:home", { indexability: approved({ index: true, follow: true, sitemap: true }) });
  assert.equal(data.getSitemapRoutes(fixture).length, 0);
  for (const origin of ["https://localhost/", "https://127.0.0.1/", "http://example.invalid/", "https://example.invalid/path", "https://example.invalid/?test=1", "https://user:pass@example.invalid/"]) assert.equal(data.getSitemapRoutes(fixture, approved(origin)).length, 0);
  // Reserved invalid domain is a SYNTHETIC TEST ORIGIN ONLY, never real configuration.
  const eligible = data.getSitemapRoutes(fixture, approved("https://example.invalid/"));
  assert.deepEqual(Array.from(eligible, (r) => r.path), ["/"]);
});

test("helpers are pure, preserve existing sources and serialize plain results", () => {
  const before = JSON.stringify([data.routes, registries.relationshipRegistry]);
  data.resolveBreadcrumbs("route:about", data.routes, "editorial");
  nav.filterPublicNavigation(); data.validateRouteRegistry();
  assert.equal(JSON.stringify([data.routes, registries.relationshipRegistry]), before);
  assert.equal(JSON.stringify(JSON.parse(JSON.stringify(data.routes))), JSON.stringify(data.routes));
  assert.equal(nav.validateNavigation().length, 0);
});
