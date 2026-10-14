import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

// Existing in-memory convention; no generated files, framework or private imports.
const paths = {
  "@/lib/domain/helpers": "../domain/helpers.ts",
  "@/lib/data/services": "./services.ts",
  "@/lib/data/industries": "./industries.ts",
  "@/lib/data/packages": "./packages.ts",
  "@/lib/data/relationships": "./relationships.ts",
};
const modules = new Map();
function load(name) {
  assert.equal(Object.hasOwn(paths, name), true, `Unexpected import: ${name}`);
  if (modules.has(name)) return modules.get(name);
  const compiled = ts.transpileModule(readFileSync(new URL(paths[name], import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const exports = {};
  modules.set(name, exports);
  runInNewContext(compiled, { exports, require: load });
  return exports;
}
const data = load("@/lib/data/relationships");
const base = data.relationshipRegistry;

// ALL BELOW ARE SYNTHETIC TEST FIXTURES ONLY. No business approval/content claim.
const reference = "SYNTHETIC TEST APPROVAL ONLY";
const approved = (value) => Object.freeze({ state: "approved", value: Object.freeze(value), approvalReference: reference });
const tbf = Object.freeze({ state: "tbf" });
const published = Object.freeze({ status: "published", approvalReference: reference, publishedAt: "2000-01-01T00:00:00Z" });
const custom = Object.freeze({ state: "custom", note: "SYNTHETIC TEST SCOPING ONLY" });
const quote = Object.freeze({ state: "custom-quote" });
const text = approved("SYNTHETIC TEST CONTENT ONLY");
const cta = approved(Object.freeze({ kind: "enquiry-link", intent: "request-consultation", label: "SYNTHETIC TEST CTA ONLY", destination: Object.freeze({ routeId: "route:consultation" }) }));
const scope = Object.freeze(Object.fromEntries(Object.keys(base.enterprise.scope).map((key) => [key, custom])));
const commercial = Object.freeze({ pricing: quote, billingBasis: custom, setupFee: quote, externalCosts: base.enterprise.externalCosts, scope });
const content = Object.freeze({ shortDescription: text, fullDescription: text, category: text, problemsSolved: approved([]), process: approved([]), intendedOutcomes: approved([]), faqs: approved([]), cta });
const identity = Object.freeze({ publication: published, availability: "consultation-required", positioning: text, targetCustomer: text, objective: text, commercial, faqs: approved([]), cta });

function fixture() {
  const family = Object.freeze({ ...base.families[1], publication: published, availability: "consultation-required", targetSegments: approved([]), content, scope });
  const service = Object.freeze({ id: "service:synthetic-one", familyId: family.id, slug: "synthetic-one", name: "SYNTHETIC TEST SERVICE ONLY", publication: published, availability: "consultation-required", targetSegments: approved([]), engagementModes: approved(["individual", "one-time-project"]), content, commercial, relatedServiceIds: approved([]) });
  const industry = Object.freeze({ ...base.industries[0], publication: published, description: text, problems: approved([]), faqs: approved([]), cta });
  const offer = Object.freeze({
    ...base.packages[0], ...identity,
    version: Object.freeze({ number: 1, status: "approved", approvalReference: reference, effectiveFrom: "2000-01-01T00:00:00Z" }),
    capabilities: Object.freeze(base.packages[0].capabilities.map((row) => Object.freeze({
      ...row, value: approved("SYNTHETIC TEST SCOPE ONLY"), services: approved([]),
    }))),
  });
  const project = Object.freeze({ ...identity, id: "project:synthetic-one", kind: "one-time-project", slug: "synthetic-one", name: "SYNTHETIC TEST PROJECT ONLY", services: approved([service.id]) });
  const addOn = Object.freeze({ ...identity, id: "add-on:synthetic-one", kind: "add-on", slug: "synthetic-one", name: "SYNTHETIC TEST ADD-ON ONLY", services: approved([service.id]) });
  const industryService = Object.freeze({ industryId: industry.id, serviceId: service.id, relevance: text, publication: published });
  const packageService = Object.freeze({ kind: "included", packageId: offer.id, serviceId: service.id, scope, approvalReference: reference });
  const industryPackage = Object.freeze({ industryId: industry.id, packageId: offer.id, suitability: text, publication: published });
  const industryPackages = approved([industryPackage]);
  return Object.freeze({
    ...base,
    families: Object.freeze(base.families.map((f) => f.id === family.id ? family : f)),
    services: Object.freeze([service]),
    industries: Object.freeze(base.industries.map((i) => i.id === industry.id ? industry : i)),
    packages: Object.freeze(base.packages.map((p) => p.id === offer.id ? offer : p)),
    enterprise: Object.freeze({ ...base.enterprise, publication: published, availability: "consultation-required", scope, cta, serviceOptions: approved([service.id]) }),
    industryServices: approved([industryService]), packageServices: approved([packageService]),
    industryPackages, packageIndustries: industryPackages,
    individualPlans: approved([service.id]), projects: approved([project]), addOns: approved([addOn]),
    compatibility: approved([
      Object.freeze({ kind: "service", addOnId: addOn.id, serviceId: service.id, approvalReference: reference }),
      Object.freeze({ kind: "package", addOnId: addOn.id, packageId: offer.id, approvalReference: reference }),
    ]),
  });
}
const codes = (r) => Array.from(data.validateRelationshipRegistry(r), (issue) => issue.code);
function resolved(result) {
  assert.equal(result.state, "resolved", JSON.stringify(result));
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.items), true);
  return result.items;
}

test("canonical counts/sources are unchanged, deeply frozen, TBF and integrity-clean", () => {
  assert.equal(base.families.length, 22);
  assert.equal(base.industries.length, 18);
  assert.equal(base.packages.length, 6);
  assert.equal(base.services.length, 0);
  assert.equal(base.enterprise.kind, "enterprise");
  assert.equal(data.validateRelationshipRegistry().length, 0);
  assert.equal(base.industryPackages, base.packageIndustries);
  assert.equal(base.packages, load("@/lib/data/packages").packages);
  const visit = (value) => {
    if (value && typeof value === "object") {
      assert.equal(Object.isFrozen(value), true);
      for (const child of Object.values(value)) visit(child);
    }
  };
  visit(base);
  for (const record of [...base.families, ...base.industries, ...base.packages, base.enterprise]) assert.equal(record.publication.status, "draft");
});

test("TBF stays distinct from resolved empty; invalid subjects are rejected", () => {
  assert.equal(data.getServiceRelationshipsForIndustry("industry:healthcare").state, "tbf");
  assert.equal(data.getServiceRelationshipsForPackage("package:startup:basic").state, "tbf");
  assert.equal(data.getPackageRelationshipsForIndustry("industry:healthcare").state, "tbf");
  assert.equal(data.getIndustryRelationshipsForPackage("package:startup:basic").state, "tbf");
  for (const query of [{ kind: "enterprise" }, { kind: "one-time-project", id: "project:unknown" }, { kind: "add-on", id: "add-on:unknown" }]) assert.equal(data.getServicesForOffer(query).state, "tbf");
  assert.equal(data.getAddOnCompatibility({ kind: "package", id: "package:startup:basic" }).state, "tbf");
  assert.equal(data.getServiceRelationshipsForIndustry("industry:unknown").state, "invalid");
  assert.equal(data.getIndustryRelationshipsForService("service:unknown").state, "invalid");
  assert.equal(data.getServiceRelationshipsForPackage("basic").state, "invalid");
  const r = Object.freeze({ ...base, industryServices: approved([]) });
  assert.equal(resolved(data.getServiceRelationshipsForIndustry("industry:healthcare", r)).length, 0);
});

test("valid synthetic pairs share exact forward/reverse records without copies", () => {
  const r = fixture();
  assert.deepEqual(codes(r), []);
  const checks = [
    [data.getServiceRelationshipsForIndustry("industry:healthcare", r), data.getIndustryRelationshipsForService("service:synthetic-one", r), r.industryServices.value[0]],
    [data.getServiceRelationshipsForPackage("package:startup:basic", r), data.getPackageRelationshipsForService("service:synthetic-one", r), r.packageServices.value[0]],
    [data.getPackageRelationshipsForIndustry("industry:healthcare", r), data.getIndustryRelationshipsForPackage("package:startup:basic", r), r.industryPackages.value[0]],
  ];
  for (const [forward, reverse, edge] of checks) {
    assert.equal(resolved(forward).length, 1);
    assert.equal(resolved(reverse).length, 1);
    assert.equal(forward.items[0], edge);
    assert.equal(reverse.items[0], edge);
  }
});

test("Enterprise, projects and add-ons preserve canonical service/offer references", () => {
  const r = fixture();
  for (const [kind, query, offer] of [
    ["enterprise", { kind: "enterprise" }, r.enterprise],
    ["one-time-project", { kind: "one-time-project", id: "project:synthetic-one" }, r.projects.value[0]],
    ["add-on", { kind: "add-on", id: "add-on:synthetic-one" }, r.addOns.value[0]],
  ]) {
    assert.equal(resolved(data.getServicesForOffer(query, r))[0], r.services[0]);
    assert.equal(resolved(data.getOffersForService(kind, "service:synthetic-one", r))[0], offer);
  }
  const forward = resolved(data.getAddOnCompatibility({ kind: "add-on", id: "add-on:synthetic-one" }, r));
  assert.equal(forward.length, 2);
  assert.equal(resolved(data.getAddOnCompatibility({ kind: "service", id: "service:synthetic-one" }, r))[0], forward[0]);
  assert.equal(resolved(data.getAddOnCompatibility({ kind: "package", id: "package:startup:basic" }, r))[0], forward[1]);
});

test("dangling references fail closed across all supported relationship sources", () => {
  const r = fixture();
  const broken = [
    { industryServices: approved([{ ...r.industryServices.value[0], serviceId: "service:missing" }]) },
    { packageServices: approved([{ ...r.packageServices.value[0], packageId: "package:startup:missing" }]) },
    { industryPackages: approved([{ ...r.industryPackages.value[0], industryId: "industry:missing" }]) },
    { enterprise: { ...r.enterprise, serviceOptions: approved(["service:missing"]) } },
    { projects: approved([{ ...r.projects.value[0], services: approved(["service:missing"]) }]) },
    { addOns: approved([{ ...r.addOns.value[0], services: approved(["service:missing"]) }]) },
    { compatibility: approved([{ ...r.compatibility.value[0], addOnId: "add-on:missing" }]) },
    { services: [{ ...r.services[0], familyId: "family:missing" }] },
    { individualPlans: approved(["service:missing"]) },
    { services: [{ ...r.services[0], relatedServiceIds: approved(["service:missing"]) }] },
  ];
  for (const change of broken) {
    const invalid = { ...r, ...change };
    assert.equal(codes(invalid).includes("invalid-reference"), true);
    assert.equal(data.getServiceRelationshipsForIndustry("industry:healthcare", invalid).state, "invalid");
  }
});

test("duplicate/conflicting edges, ID lists, identities and namespaces are rejected", () => {
  const r = fixture();
  for (const field of ["industryServices", "packageServices", "industryPackages", "compatibility"]) {
    assert.equal(codes({ ...r, [field]: approved([...r[field].value, ...r[field].value]) }).includes("duplicate-relationship"), true);
  }
  assert.equal(codes({ ...r, enterprise: { ...r.enterprise, serviceOptions: approved([r.services[0].id, r.services[0].id]) } }).includes("duplicate-relationship"), true);
  assert.equal(codes({ ...r, services: [r.services[0], r.services[0]] }).includes("duplicate-identity"), true);
  assert.equal(codes({ ...r, packages: [{ ...r.packages[0], id: "package:startup:premium" }, ...r.packages.slice(1)] }).includes("invalid-identity"), true);
  assert.equal(codes({ ...r, services: [{ ...r.services[0], id: "industry:wrong-kind" }] }).includes("invalid-identity"), true);
  assert.deepEqual(codes(base), []); // basic/standard/premium repeat only across segments.
});

test("stale reverse views and contradictory add-on/individual associations are detected", () => {
  const r = fixture();
  assert.equal(codes({ ...r, packageIndustries: approved([]) }).includes("inconsistent-reverse"), true);
  assert.equal(codes({ ...r, packageIndustries: tbf }).includes("inconsistent-reverse"), true);
  assert.equal(codes({ ...r, packageIndustries: approved([{ ...r.industryPackages.value[0], suitability: approved("SYNTHETIC DIFFERENT TEST CONTENT") }]) }).includes("inconsistent-reverse"), true);
  assert.equal(codes({ ...r, addOns: approved([{ ...r.addOns.value[0], services: approved([]) }]) }).includes("inconsistent-relationship"), true);
  assert.equal(codes({ ...r, services: [{ ...r.services[0], engagementModes: approved(["recurring"]) }] }).includes("inconsistent-relationship"), true);
});

test("published TBF records, missing approval and published links to drafts fail closed", () => {
  const r = fixture();
  const cases = [
    { industries: [{ ...r.industries[0], description: tbf }, ...r.industries.slice(1)] },
    { packages: [{ ...r.packages[0], commercial: { ...commercial, pricing: tbf } }, ...r.packages.slice(1)] },
    { enterprise: { ...r.enterprise, serviceOptions: tbf } },
    { industryServices: approved([{ ...r.industryServices.value[0], relevance: tbf }]) },
    { packageServices: approved([{ ...r.packageServices.value[0], scope: base.enterprise.scope }]) },
  ];
  for (const change of cases) {
    const invalid = { ...r, ...change };
    assert.equal(codes(invalid).includes("incomplete-publication"), true);
    assert.equal(data.getServicesForOffer({ kind: "enterprise" }, invalid).state, "invalid");
  }
  assert.equal(codes({ ...r, industryServices: approved([{ ...r.industryServices.value[0], publication: { ...published, approvalReference: "" } }]) }).includes("missing-approval"), true);
  assert.equal(codes({ ...r, services: [{ ...r.services[0], publication: { status: "draft" } }] }).includes("unpublished-target"), true);
});

test("draft associations and unavailable offers are excluded without promotion", () => {
  const r = fixture();
  const draftEdges = { ...r, industryServices: approved([{ ...r.industryServices.value[0], publication: { status: "draft" } }]) };
  assert.equal(resolved(data.getServiceRelationshipsForIndustry("industry:healthcare", draftEdges)).length, 0);
  const draftEnterprise = { ...r, enterprise: { ...r.enterprise, publication: { status: "draft" } } };
  assert.equal(resolved(data.getServicesForOffer({ kind: "enterprise" }, draftEnterprise)).length, 0);
  assert.equal(resolved(data.getOffersForService("enterprise", r.services[0].id, draftEnterprise)).length, 0);
  const unavailableEnterprise = { ...r, enterprise: { ...r.enterprise, availability: "unavailable" } };
  assert.equal(resolved(data.getServicesForOffer({ kind: "enterprise" }, unavailableEnterprise)).length, 0);
  assert.equal(resolved(data.getOffersForService("enterprise", r.services[0].id, unavailableEnterprise)).length, 0);
  const noPublicOffers = { ...r, packageServices: approved([]), industryPackages: approved([]), packageIndustries: approved([]), compatibility: approved([]), packages: r.packages.map((p) => ({ ...p, publication: { status: "draft" } })) };
  assert.equal(resolved(data.getServiceRelationshipsForPackage("package:startup:basic", noPublicOffers)).length, 0);
});

test("helpers/validation are pure; result diagnostics and serialization stay safe", () => {
  const r = fixture();
  const before = JSON.stringify(r);
  data.validateRelationshipRegistry(r);
  data.getServiceRelationshipsForIndustry("industry:healthcare", r);
  data.getServicesForOffer({ kind: "enterprise" }, r);
  assert.equal(JSON.stringify(r), before);
  assert.equal(JSON.stringify(JSON.parse(JSON.stringify(base))), JSON.stringify(base));
  const invalid = data.getIndustryRelationshipsForService("service:unknown");
  assert.equal(invalid.state, "invalid");
  assert.equal(Object.isFrozen(invalid.issues), true);
  for (const issue of invalid.issues) {
    assert.equal(Object.isFrozen(issue), true);
    assert.deepEqual(Object.keys(issue).sort(), ["code", "path"]);
  }
});

test("package versions and capability rows are validated; coming-soon is never public", () => {
  const r = fixture();
  assert.deepEqual(codes(r), []);
  const offer = r.packages[0];
  const withPackage = (change) => ({ ...r, packages: r.packages.map((p) => p.id === offer.id ? { ...p, ...change } : p) });
  assert.equal(codes(withPackage({ version: { number: 0, status: "draft" } })).includes("invalid-identity"), true);
  assert.equal(codes(withPackage({ version: { number: 1.5, status: "draft" } })).includes("invalid-identity"), true);
  assert.equal(codes(withPackage({ version: { number: 2, status: "approved", approvalReference: " ", effectiveFrom: "2000-01-01T00:00:00Z" } })).includes("invalid-identity"), true);
  assert.equal(codes(withPackage({ version: { number: 1, status: "draft" } })).includes("incomplete-publication"), true);
  const duplicate = [offer.capabilities[0], offer.capabilities[0]];
  assert.equal(codes(withPackage({ capabilities: duplicate })).includes("duplicate-identity"), true);
  assert.equal(codes(withPackage({ capabilities: [{ ...offer.capabilities[0], id: "capability:Bad Id" }] })).includes("invalid-identity"), true);
  assert.equal(codes(withPackage({ capabilities: [{ ...offer.capabilities[0], services: approved(["service:unknown"]) }] })).includes("invalid-reference"), true);
  // Coming Soon is not an active offer: a published edge targeting it is an unpublished target.
  const soon = { ...r, packages: r.packages.map((p) => p.id === offer.id ? { ...p, availability: "coming-soon" } : p) };
  assert.equal(codes(soon).includes("unpublished-target"), true);
  // Fail closed: a registry that publishes an edge to a Coming Soon offer never resolves.
  assert.equal(data.getServiceRelationshipsForPackage(offer.id, soon).state, "invalid");
});
