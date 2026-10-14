import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const paths = {
  "@/lib/domain/helpers": "../domain/helpers.ts", "@/lib/data/services": "./services.ts",
  "@/lib/data/industries": "./industries.ts", "@/lib/data/packages": "./packages.ts",
  "@/lib/data/relationships": "./relationships.ts", "@/lib/data/routes": "./routes.ts",
  "@/lib/data/navigation": "./navigation.ts", "@/lib/data/content": "./content.ts",
  "@/lib/data/public-consumers": "./public-consumers.ts",
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
const api = load("@/lib/data/public-consumers"), content = load("@/lib/data/content");
const routes = load("@/lib/data/routes"), nav = load("@/lib/data/navigation");
// SYNTHETIC TEST FIXTURES ONLY. Never exported/imported into production data.
const approved = (value) => ({ state: "approved", value, approvalReference: "SYNTHETIC TEST APPROVAL ONLY" });
const published = { status: "published", approvalReference: "SYNTHETIC TEST APPROVAL ONLY", publishedAt: "2000-01-01T00:00:00Z" };
const tbf = { state: "tbf" };
const cta = (id, fragment) => ({ kind: "navigation", intent: "explore", label: "SYNTHETIC TEST CTA ONLY", destination: { routeId: id, ...(fragment ? { fragment } : {}) } });
const groups = [{ id: "nav-group:synthetic", label: "SYNTHETIC TEST ONLY", items: [
  { kind: "link", id: "nav:synthetic-home", label: "Home", routeId: "route:home" },
  { kind: "link", id: "nav:synthetic-about", label: "About", routeId: "route:about" },
] }];
function fixture(anchor = false) {
  const ids = ["route:home", "route:about"];
  return {
    routes: routes.routes.filter((r) => ids.includes(r.id)).map((r) => ({ ...r, publication: published,
      verification: "reviewed", generation: "static", audience: approved([]), seoIntent: approved("SYNTHETIC TEST ONLY"),
      dataSource: approved("SYNTHETIC TEST ONLY"), contentOwner: approved("SYNTHETIC TEST ONLY"), template: approved("SYNTHETIC TEST ONLY"),
      primaryCTA: approved(cta(r.id, anchor ? "overview" : undefined)),
      metadata: { title: approved(`SYNTHETIC TITLE ${r.id}`), description: approved(`SYNTHETIC DESCRIPTION ${r.id}`) },
      indexability: approved({ index: false, follow: true, sitemap: false }),
    })),
    content: content.content.filter((c) => ids.includes(c.routeId)).map((c) => ({ ...c, publication: published,
      title: approved("SYNTHETIC TITLE ONLY"), summary: approved("SYNTHETIC SUMMARY ONLY"), heading: approved("SYNTHETIC HEADING ONLY"),
      canonicalPath: approved(c.routeId === "route:home" ? "/" : "/about"), factualReview: approved(true),
      cta: approved(cta(c.routeId, anchor ? "overview" : undefined)), sections: approved([
        { id: "overview", role: "overview", heading: "SYNTHETIC SECTION ONLY", body: "SYNTHETIC BODY ONLY", proofIds: [], claims: [] },
      ]),
    })),
    proofs: [], origin: approved("https://example.invalid"),
  };
}
const replaceContent = (f, changes) => ({ ...f, content: f.content.map(c => c.routeId === "route:about" ? { ...c, ...changes } : c) });
const indexAbout = (f) => ({ ...f, routes: f.routes.map(r => r.id === "route:about" ? { ...r, indexability: approved({ index: true, follow: true, sitemap: true }) } : r) });
function denied(f, id = "route:about") {
  assert.equal(api.getPublicationSafeRouteById(id, f), undefined);
  assert.equal(api.getPublicationSafeContentByRouteId(id, f), undefined);
  assert.equal(api.resolvePublicationSafeConsumerCTA(cta(id), f), undefined);
  assert.equal(api.getPublicationSafeBreadcrumbs(id, f).state, "invalid");
  assert.equal(api.getPublicationSafeNavigation(groups, f).some(g => g.items.some(i => i.routeId === id)), false);
  assert.equal(api.getPublicationSafeSitemapRoutes(f).some(r => r.id === id), false);
}

test("canonical inventories remain unchanged and every draft consumer result stays private", () => {
  assert.equal(routes.fixedRoutes.length, 19); assert.equal(routes.conditionalRoutes.length, 40);
  assert.equal(routes.routes.length, 59); assert.equal(content.content.length, 59);
  assert.equal(load("@/lib/data/services").serviceFamilies.length, 22);
  assert.equal(load("@/lib/data/industries").industries.length, 18);
  assert.equal(load("@/lib/data/packages").packages.length, 6);
  assert.equal(load("@/lib/data/packages").enterpriseOffering.scoping, "consultation-led");
  assert.equal(api.getPublicationSafeNavigation().length, 0);
  assert.equal(api.getPublicationSafeSitemapRoutes().length, 0);
  assert.equal(api.getPublicationSafeRouteByPath("/"), undefined);
  assert.equal(api.resolvePublicationSafeConsumerCTA(nav.consultationCTA), undefined);
});
test("published routes with draft, missing, approved or retired content cannot leak through any adapter", () => {
  const f = indexAbout(fixture());
  assert.equal(routes.getPublicRouteById("route:about", f.routes).path, "/about"); // compatibility remains route-only
  assert.equal(api.getPublicationSafeSitemapRoutes(f)[0].path, "/about");
  for (const publication of [{ status: "draft" }, { status: "planned" }, { status: "approved", approvalReference: "SYNTHETIC ONLY" }, { status: "retired", retiredAt: published.publishedAt }]) {
    denied(replaceContent(f, { publication }));
  }
  denied({ ...f, content: f.content.filter(c => c.routeId !== "route:about") });
  denied(replaceContent(f, { summary: tbf }));
});
test("published content cannot bypass draft route, missing approval or ineligible ancestor", () => {
  const f = fixture();
  denied({ ...f, routes: f.routes.map(r => r.id === "route:about" ? { ...r, publication: { status: "draft" } } : r) });
  denied(replaceContent(f, { factualReview: tbf }));
  denied({ ...f, content: f.content.map(c => c.routeId === "route:home" ? { ...c, publication: { status: "draft" } } : c) });
});
test("verified primary and navigation anchors work across CTA, navigation, breadcrumbs and sitemap", () => {
  const f = indexAbout(fixture(true));
  const anchoredGroups = [{ ...groups[0], items: [{ ...groups[0].items[1], fragment: "overview" }] }];
  assert.equal(api.getPublicationSafeRouteByPath("/about", f).id, "route:about");
  const link = api.resolvePublicationSafeConsumerCTA(cta("route:about", "overview"), f);
  assert.equal(link.path, "/about"); assert.equal(link.fragment, "overview");
  assert.equal(api.getPublicationSafeNavigation(anchoredGroups, f)[0].items[0].fragment, "overview");
  const breadcrumb = api.getPublicationSafeBreadcrumbs("route:about", f);
  assert.equal(breadcrumb.state, "resolved"); assert.equal(breadcrumb.items[0].path, "/");
  assert.equal(breadcrumb.items.at(-1).current, true); assert.equal("path" in breadcrumb.items.at(-1), false);
  assert.equal(api.getPublicationSafeSitemapRoutes(f)[0].path, "/about");
  for (const fragment of ["missing", "Bad Anchor", "../overview"]) {
    assert.equal(api.resolvePublicationSafeConsumerCTA(cta("route:about", fragment), f), undefined);
    assert.equal(api.getPublicationSafeNavigation([{ ...groups[0], items: [{ ...groups[0].items[1], fragment }] }], f).length, 0);
  }
  denied(replaceContent(f, { sections: tbf }));
  const badPrimary = { ...f,
    routes: f.routes.map(r => r.id === "route:about" ? { ...r, primaryCTA: approved(cta("route:about", "missing")) } : r),
  };
  denied(replaceContent(badPrimary, { cta: approved(cta("route:about", "missing")) }));
});
test("self-links and complete CTA cycles survive but incomplete cycles fail closed", () => {
  const f = fixture(true);
  assert.equal(api.resolvePublicationSafeConsumerCTA(cta("route:home", "overview"), f).path, "/");
  const cycle = { ...f,
    routes: f.routes.map(r => ["route:home", "route:about"].includes(r.id) ? { ...r, primaryCTA: approved(cta(r.id === "route:home" ? "route:about" : "route:home")) } : r),
    content: f.content.map(c => ["route:home", "route:about"].includes(c.routeId) ? { ...c, cta: approved(cta(c.routeId === "route:home" ? "route:about" : "route:home")) } : c),
  };
  assert.equal(api.getPublicationSafeNavigation(groups, cycle)[0].items.length, 2);
  assert.equal(api.resolvePublicationSafeConsumerCTA(cta("route:about"), cycle).path, "/about");
  denied(replaceContent(cycle, { heading: tbf }));
  const parentCycle = { ...f, routes: f.routes.map(r => r.id === "route:home" ? { ...r, parentId: "route:about" } : r) };
  assert.equal(api.getPublicationSafeBreadcrumbs("route:about", parentCycle).reason, "cycle");
  denied(parentCycle);
});
test("invalid route/content references, duplicates and canonical disagreement fail closed", () => {
  const f = fixture();
  for (const broken of [
    { ...f, content: [...f.content, f.content[0]] },
    replaceContent(f, { routeId: "route:missing" }),
    replaceContent(f, { canonicalPath: approved("/wrong") }),
    replaceContent(f, { relatedEntities: [{ kind: "industry", id: "industry:missing" }] }),
    { ...f, routes: [...f.routes, f.routes[0]] },
  ]) denied(broken);
  denied(f, "route:missing");
  for (const path of ["/About", "/about/", "/about?x=1", "/about#overview"]) assert.equal(api.getPublicationSafeRouteByPath(path, f), undefined);
});
test("navigation cycles, missing targets and draft disclosure children are handled safely", () => {
  const f = fixture();
  const disclosure = { kind: "disclosure", id: "nav:synthetic-disclosure", label: "SYNTHETIC ONLY", routeId: "route:home", children: [groups[0].items[1]] };
  const candidates = [{ ...groups[0], items: [disclosure] }];
  assert.equal(api.getPublicationSafeNavigation(candidates, f)[0].items[0].children.length, 1);
  const childDraft = replaceContent(f, { publication: { status: "draft" } });
  assert.equal(api.getPublicationSafeNavigation(candidates, childDraft)[0].items[0].kind, "link");
  const cyclic = { ...disclosure, children: [] }; cyclic.children.push(cyclic);
  assert.equal(api.getPublicationSafeNavigation([{ ...groups[0], items: [cyclic] }], f).length, 0);
  assert.equal(api.getPublicationSafeNavigation([{ ...groups[0], items: [{ ...groups[0].items[0], routeId: "route:missing" }] }], f).length, 0);
});
test("sitemap output requires approved origin, metadata and explicit index/sitemap decisions", () => {
  const f = indexAbout(fixture(true));
  for (const origin of [tbf, approved("http://localhost:3000"), approved("https://example.invalid/path")]) assert.equal(api.getPublicationSafeSitemapRoutes({ ...f, origin }).length, 0);
  assert.equal(api.getPublicationSafeSitemapRoutes(fixture()).length, 0);
  denied({ ...f, routes: f.routes.map(r => r.id === "route:about" ? { ...r, metadata: { ...r.metadata, title: tbf } } : r) });
});
test("CTA actions, empty labels, unknown references and draft selections never become links", () => {
  const f = fixture();
  assert.equal(api.resolvePublicationSafeConsumerCTA({ ...cta("route:about"), label: " " }, f), undefined);
  assert.equal(api.resolvePublicationSafeConsumerCTA({ kind: "submit-enquiry", intent: "request-consultation", label: "SYNTHETIC ONLY" }, f), undefined);
  assert.equal(api.resolvePublicationSafeConsumerCTA({ ...nav.consultationCTA, context: { familyId: "family:seo" } }, f), undefined);
});
test("adapters preserve inputs and return frozen serializable records without caching stale decisions", () => {
  const f = fixture(true), before = JSON.stringify(f);
  const outputs = [api.getPublicationSafeNavigation(groups, f), api.getPublicationSafeBreadcrumbs("route:about", f), api.getPublicationSafeSitemapRoutes(f)];
  for (const result of outputs) { assert.equal(Object.isFrozen(result), true); assert.doesNotThrow(() => JSON.stringify(result)); }
  assert.equal(JSON.stringify(f), before);
  f.content = replaceContent(f, { publication: { status: "draft" } }).content;
  denied(f);
});

// Regression-enforced public import boundary, including future components/utilities.
const root = fileURLToPath(new URL("../../", import.meta.url));
function unsafeImports(filename, source) {
  const issues = [], ast = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true);
  const check = (specifier) => {
    const target = specifier.startsWith("@/") ? resolve(root, specifier.slice(2)) : specifier.startsWith(".") ? resolve(dirname(filename), specifier) : undefined;
    if (!target) return;
    const path = relative(root, target).replaceAll("\\", "/").replace(/\.(ts|tsx|mjs|js)$/, "");
    if ((path === "lib/data" || path.startsWith("lib/data/")) && path !== "lib/data/public-consumers") issues.push(specifier);
  };
  function visit(node) {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      if (!node.isTypeOnly && !node.importClause?.isTypeOnly && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) check(node.moduleSpecifier.text);
    } else if (ts.isCallExpression(node) && (node.expression.kind === ts.SyntaxKind.ImportKeyword || (ts.isIdentifier(node.expression) && node.expression.text === "require"))) {
      if (node.arguments[0] && ts.isStringLiteral(node.arguments[0])) check(node.arguments[0].text);
    }
    ts.forEachChild(node, visit);
  }
  visit(ast); return issues;
}
test("public application imports must use the safe entry point, not raw registries or route-only helpers", () => {
  const file = resolve(root, "app/synthetic-test.tsx");
  for (const code of ['import { routes } from "@/lib/data/routes";', 'export { resolvePublicCTA } from "../lib/data/navigation";', 'const raw = import("@/lib/data/content");', 'const raw = require("@/lib/data/routes");']) assert.equal(unsafeImports(file, code).length, 1);
  assert.equal(unsafeImports(file, 'import { getPublicationSafeNavigation } from "@/lib/data/public-consumers";').length, 0);
  const issues = [];
  function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (["node_modules", ".next", ".git", ".agents", ".codex"].includes(entry.name)) continue;
      const path = resolve(dir, entry.name), local = relative(root, path).replaceAll("\\", "/");
      if (local === "lib/data" || local === "lib/domain") continue;
      if (entry.isDirectory()) walk(path);
      else if (/\.(ts|tsx|js|mjs)$/.test(path) && !/\.test\.|\.d\.ts$/.test(path)) {
        issues.push(...unsafeImports(path, readFileSync(path, "utf8")).map(specifier => ({ file: local, specifier })));
      }
    }
  }
  walk(root); assert.deepEqual(issues, []);
});
