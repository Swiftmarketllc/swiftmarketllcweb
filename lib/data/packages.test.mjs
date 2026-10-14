import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

// Follow existing Node/in-memory TypeScript tests. Only trusted local imports run.
const modulePaths = {
  "@/lib/domain/helpers": "../domain/helpers.ts",
  "@/lib/data/services": "./services.ts",
  "@/lib/data/industries": "./industries.ts",
  "@/lib/data/packages": "./packages.ts",
};
const modules = new Map();
function load(specifier) {
  assert.equal(Object.hasOwn(modulePaths, specifier), true, `Unexpected import: ${specifier}`);
  if (modules.has(specifier)) return modules.get(specifier);
  const source = readFileSync(new URL(modulePaths[specifier], import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const exports = {};
  modules.set(specifier, exports);
  runInNewContext(compiled, { exports, require: load });
  return exports;
}
const data = load("@/lib/data/packages");
const services = load("@/lib/data/services");
const industries = load("@/lib/data/industries");
const helpers = load("@/lib/domain/helpers");
function readDoc(name) {
  return readFileSync(new URL(`../../docs/${name}`, import.meta.url), "utf8");
}
const requirements = readDoc("mvp-requirements-v3.0.md");
const architecture = readDoc("information-architecture.md");
const routes = readDoc("route-architecture.md");
const segments = ["startup", "growing-business"];
const tiers = ["basic", "standard", "premium"];
const names = ["Basic", "Standard", "Premium"];
const expectedPaths = segments.flatMap((segment) => tiers.map((tier) => `/packages/${segment}-${tier}`));
function packagePaths(document) {
  return document.split("\n").filter((line) => /^\| \/packages\/(startup|growing-business)-(basic|standard|premium) \|/.test(line))
    .map((line) => line.split("|")[1].trim());
}

test("exact six canonical tier records match requirements and M4.1/M4.2 paths", () => {
  const commercial = requirements.split("## 4. Commercial Architecture")[1].split("## 5.")[0];
  for (const label of ["Startup Business", "Growing Business"]) {
    assert.equal(commercial.includes(`| ${label} | Basic / Standard / Premium |`), true);
  }
  assert.deepEqual(Object.keys(data.packageCatalog), segments);
  assert.equal(data.packages.length, 6);
  for (const segment of segments) {
    assert.deepEqual(Object.keys(data.packageCatalog[segment]), tiers);
    const offers = data.getPackagesBySegment(segment);
    assert.equal(offers.length, 3);
    assert.deepEqual(Array.from(offers, (offer) => offer.name), names);
    for (const offer of offers) {
      assert.equal(offer.kind, "package");
      assert.equal(data.packageCatalog[segment][offer.tier], offer);
    }
  }
  assert.deepEqual(packagePaths(architecture), expectedPaths);
  assert.deepEqual(packagePaths(routes), expectedPaths);
  assert.deepEqual(Array.from(data.packages, (offer) => `/packages/${offer.slug}`), expectedPaths);
});

test("unique IDs and segment-scoped slugs; no aliases, default tier or Enterprise tier", () => {
  assert.equal(new Set(data.packages.map((offer) => offer.id)).size, 6);
  assert.equal(new Set(data.packages.map((offer) => offer.slug)).size, 6);
  for (const offer of data.packages) {
    assert.equal(offer.id, `package:${offer.segment}:${offer.tier}`);
    assert.equal(offer.slug, `${offer.segment}-${offer.tier}`);
    assert.equal(helpers.parseSlug(offer.slug), offer.slug);
    assert.equal(data.getPackageById(offer.id), offer);
    assert.equal(data.getPackageBySlug(offer.slug), offer);
  }
  for (const id of ["package:enterprise:basic", "package:startup:unknown", "basic", ""]) {
    assert.equal(data.getPackageById(id), undefined);
  }
  for (const slug of [
    "basic", "enterprise-basic", "Startup-basic", "startup-Basic", "startup-basic/", "startup/basic", "unknown", "",
  ]) assert.equal(data.getPackageBySlug(slug), undefined);
  assert.equal(data.getPackagesBySegment("enterprise").length, 0);
});

function assertTbf(decision) {
  assert.equal(decision.state, "tbf");
  assert.deepEqual(Object.keys(decision), ["state"]);
}
test("pricing, fees, cadence, content and every scope field stay unresolved", () => {
  for (const offer of data.packages) {
    for (const field of ["positioning", "targetCustomer", "objective", "faqs", "cta"]) assertTbf(offer[field]);
    for (const field of ["pricing", "billingBasis", "setupFee"]) assertTbf(offer.commercial[field]);
    assert.deepEqual(Object.keys(offer.commercial.scope).sort(), [
      "deliverables", "limits", "inclusions", "exclusions", "timeline", "reporting",
      "support", "clientResponsibilities", "terms",
    ].sort());
    for (const value of Object.values(offer.commercial.scope)) assertTbf(value);
  }
});

test("Enterprise is a draft custom consultation with no tier or invented options", () => {
  const enterprise = data.enterpriseOffering;
  assert.equal(requirements.includes("**Build Your Growth Stack**"), true);
  assert.equal(enterprise.name, "Build Your Growth Stack");
  assert.equal(enterprise.kind, "enterprise");
  assert.equal(enterprise.segment, "enterprise");
  assert.equal(enterprise.routeId, "route:enterprise");
  assert.equal(enterprise.scoping, "consultation-led");
  assert.equal(enterprise.pricing.state, "custom-quote");
  assert.deepEqual(Object.keys(enterprise.pricing), ["state"]);
  assert.equal("tier" in enterprise, false);
  assert.equal("commercial" in enterprise, false);
  assert.equal("id" in enterprise, false);
  assertTbf(enterprise.serviceOptions);
  assertTbf(enterprise.cta);
  for (const value of Object.values(enterprise.scope)) assertTbf(value);
});

test("independent offer categories and shared relationships stay TBF, not invented", () => {
  for (const decision of [
    data.individualServicePlans, data.oneTimeProjects, data.addOns,
    data.addOnCompatibility, data.packageServiceRelationships, data.industryPackageRelationships,
  ]) assertTbf(decision);
  assert.equal(data.industryPackageRelationships, industries.industryPackageRelationships);
  assert.equal(services.services.length, 0);
});

test("all external costs reuse the explicit separate baseline without amounts", () => {
  for (const offer of [...data.packages.map((offer) => offer.commercial), data.enterpriseOffering]) {
    assert.equal(offer.externalCosts, services.serviceExternalCosts);
    assert.deepEqual(Object.keys(offer.externalCosts).sort(), [
      "advertising-media-spend", "third-party-tools", "hosting", "premium-assets", "production", "other-external",
    ].sort());
    for (const cost of Object.values(offer.externalCosts)) {
      assert.equal(cost.treatment, "separate");
      assert.deepEqual(Object.keys(cost), ["treatment"]);
    }
  }
});

test("publication gates remain unsatisfied; no public metadata or fake approvals", () => {
  for (const offer of [...data.packages, data.enterpriseOffering]) {
    assert.equal(offer.publication.status, "draft");
    assert.deepEqual(Object.keys(offer.publication), ["status"]);
    assert.equal(offer.availability, "tbf");
    assert.equal("metadata" in offer, false);
    assert.equal("indexability" in offer, false);
    assert.equal("publishedAt" in offer, false);
  }
  for (const offer of data.packages) {
    assert.deepEqual(Object.keys(offer).sort(), [
      "id", "slug", "name", "kind", "segment", "tier", "publication", "availability",
      "positioning", "targetCustomer", "objective", "commercial", "faqs", "cta",
      "version", "capabilities",
    ].sort());
  }
  assert.deepEqual(Object.keys(data.enterpriseOffering).sort(), [
    "kind", "segment", "routeId", "name", "publication", "availability", "serviceOptions",
    "scoping", "pricing", "externalCosts", "scope", "cta",
  ].sort());
});

function assertDeepFrozen(value) {
  if (value && typeof value === "object") {
    assert.equal(Object.isFrozen(value), true);
    for (const child of Object.values(value)) assertDeepFrozen(child);
  }
}
test("canonical data is deeply immutable, serializable and preserved by lookups", () => {
  for (const value of Object.values(data)) if (typeof value !== "function") assertDeepFrozen(value);
  const before = JSON.stringify(data.packageCatalog);
  for (const offer of data.packages) {
    assert.throws(() => { offer.name = "SYNTHETIC MUTATION TEST ONLY"; }, TypeError);
    data.getPackageById(offer.id);
    data.getPackageBySlug(offer.slug);
    assert.equal(Object.isFrozen(data.getPackagesBySegment(offer.segment)), true);
  }
  assert.equal(JSON.stringify(data.packageCatalog), before);
  for (const value of [data.packageCatalog, data.enterpriseOffering]) {
    assert.equal(JSON.stringify(JSON.parse(JSON.stringify(value))), JSON.stringify(value));
  }
});

test("every package carries an unapproved version 1 so published scope can be preserved later", () => {
  for (const offer of data.packages) {
    assert.deepEqual({ ...offer.version }, { number: 1, status: "draft" });
    assert.equal("approvalReference" in offer.version, false);
  }
});

test("capability matrix follows doc 06 rows per segment and never invents a scope value", () => {
  const startup = ["strategy", "seo-local", "social", "ads-management", "content-creative", "tracking-reporting", "support"];
  const growing = ["strategy-review", "seo-local", "paid-channels", "social-content", "cro-web", "email-crm-automation", "analytics-reporting", "support-cadence"];
  for (const offer of data.packages) {
    const expected = offer.segment === "startup" ? startup : growing;
    assert.deepEqual(Array.from(offer.capabilities, (row) => row.id), expected.map((id) => `capability:${id}`));
    for (const row of offer.capabilities) {
      assert.equal(row.value.state, "tbf");
      assert.equal(row.services.state, "tbf");
      assert.equal(row.label.trim().length > 0, true);
    }
  }
  const basicAds = data.packageCatalog.startup.basic.capabilities.find((row) => row.id === "capability:ads-management");
  assert.equal(basicAds.value.note, "TBF / optional");
  assert.equal("note" in data.packageCatalog.startup.standard.capabilities.find((row) => row.id === "capability:ads-management").value, false);
});
