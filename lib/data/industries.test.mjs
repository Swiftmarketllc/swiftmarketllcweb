import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

// Existing in-memory TypeScript convention; no emitted files or new test framework.
function compile(relativePath) {
  return ts.transpileModule(
    readFileSync(new URL(relativePath, import.meta.url), "utf8"),
    { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 } },
  ).outputText;
}
const helpers = {};
runInNewContext(compile("../domain/helpers.ts"), { exports: helpers });
const data = {};
runInNewContext(compile("./industries.ts"), {
  exports: data,
  require(specifier) {
    assert.equal(specifier, "@/lib/domain/helpers");
    return helpers;
  },
});

function readDoc(name) {
  return readFileSync(new URL(`../../docs/${name}`, import.meta.url), "utf8");
}
const requirements = readDoc("mvp-requirements-v3.0.md");
const architecture = readDoc("information-architecture.md");
const routes = readDoc("route-architecture.md");
const approvedNames = requirements.split("## 6. Industry / Niche Architecture")[1]
  .split("\n").find((line) => line.startsWith("Approved priority/representative industries are "))
  .replace("Approved priority/representative industries are ", "")
  .replace(/\.$/, "").split("; ").map((name) => name.replace(/^and /, ""));
const approvedMappings = architecture.split("## 17. Industries architecture")[1]
  .split("## 18.")[0].split("\n")
  .filter((line) => line.startsWith("| /industries/"))
  .map((line) => {
    const columns = line.split("|");
    return {
      name: columns[3].trim().replace(/ solution evaluation$/, ""),
      slug: columns[1].trim().slice("/industries/".length),
    };
  });
const routeMappings = routes.split("### Industry candidates — 10 launch-priority and 8 secondary (v3.0 doc 04 §3)")[1]
  .split("### Additional conditional")[0].split("\n")
  .filter((line) => line.startsWith("| /industries/"))
  .map((line) => {
    const columns = line.split("|");
    return {
      name: columns[2].trim().replace(/ sector evaluation$/, ""),
      slug: columns[1].trim().slice("/industries/".length),
    };
  });

test("exact 18 candidates (10 launch + 8 secondary) match requirements and both approved route inventories", () => {
  assert.equal(approvedNames.length, 18);
  assert.equal(approvedMappings.length, 18);
  assert.equal(routeMappings.length, 18);
  assert.equal(data.industries.length, 18);
  assert.deepEqual(Array.from(data.industries, (industry) => industry.name), approvedNames);
  const actual = Array.from(data.industries, ({ name, slug }) => ({ name, slug }));
  assert.deepEqual(actual, approvedMappings);
  assert.deepEqual(actual, routeMappings);
});

test("stable unique identities, syntax-valid slugs and exact canonical lookups", () => {
  assert.equal(new Set(data.industries.map((industry) => industry.id)).size, 18);
  assert.equal(new Set(data.industries.map((industry) => industry.slug)).size, 18);
  for (const industry of data.industries) {
    assert.equal(industry.id, `industry:${industry.slug}`);
    assert.equal(helpers.parseSlug(industry.slug), industry.slug);
    assert.equal(data.getIndustryById(industry.id), industry);
    assert.equal(data.getIndustryBySlug(industry.slug), industry);
  }
  for (const unknown of ["industry:unknown", "healthcare", "industry:Healthcare", ""]) {
    assert.equal(data.getIndustryById(unknown), undefined);
  }
  for (const unknown of ["unknown", "Healthcare", "healthcare/", "/industries/healthcare", ""]) {
    assert.equal(data.getIndustryBySlug(unknown), undefined);
  }
});

test("all candidates stay draft with only approved identity and TBF content", () => {
  for (const industry of data.industries) {
    assert.deepEqual(Object.keys(industry).sort(), [
      "id", "slug", "name", "priorityBand", "publication", "description", "problems", "faqs", "cta",
    ].sort());
    assert.deepEqual(Object.keys(industry.publication), ["status"]);
    assert.equal(industry.publication.status, "draft");
    for (const field of ["description", "problems", "faqs", "cta"]) {
      assert.equal(industry[field].state, "tbf");
      assert.deepEqual(Object.keys(industry[field]), ["state"]);
    }
    // Exact keys exclude invented metadata, indexability, proof and commercial values.
    assert.equal("routeId" in industry, false);
  }
});

test("unresolved relationships remain TBF rather than invented recommendations", () => {
  for (const decision of [data.industryServiceRelationships, data.industryPackageRelationships]) {
    assert.equal(decision.state, "tbf");
    assert.deepEqual(Object.keys(decision), ["state"]);
    assert.equal(Object.isFrozen(decision), true);
  }
});

test("canonical records are immutable and helpers do not mutate or reorder them", () => {
  const before = JSON.stringify(data.industries);
  assert.equal(Object.isFrozen(data.industries), true);
  for (const industry of data.industries) {
    assert.equal(Object.isFrozen(industry), true);
    for (const field of ["publication", "description", "problems", "faqs", "cta"]) {
      assert.equal(Object.isFrozen(industry[field]), true);
    }
    assert.throws(() => { industry.name = "SYNTHETIC MUTATION TEST ONLY"; }, TypeError);
    data.getIndustryById(industry.id);
    data.getIndustryBySlug(industry.slug);
  }
  assert.equal(JSON.stringify(data.industries), before);
});

test("industry data round-trips as plain JSON without secrets or personal fields", () => {
  const roundTrip = JSON.parse(JSON.stringify(data.industries));
  assert.equal(roundTrip.length, 18);
  assert.equal(JSON.stringify(roundTrip), JSON.stringify(data.industries));
  assert.deepEqual(Object.keys(data).sort(), [
    "industries", "industryServiceRelationships", "industryPackageRelationships",
    "getIndustryById", "getIndustryBySlug",
  ].sort());
});

test("doc 04 §3 priority bands: 10 launch then 8 secondary; long-tail niches are not registered", () => {
  const bands = Array.from(data.industries, (industry) => industry.priorityBand);
  assert.deepEqual(bands, [...Array(10).fill("launch"), ...Array(8).fill("secondary")]);
  assert.equal(data.industries.find((i) => i.slug === "b2b-professional-services").priorityBand, "secondary");
  for (const longTail of ["events", "sports", "pets", "wedding", "nonprofit-community", "gaming-esports", "entertainment-media"]) {
    assert.equal(data.getIndustryBySlug(longTail), undefined);
  }
});
