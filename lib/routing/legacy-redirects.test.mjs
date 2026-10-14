import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

// Same in-memory transpilation convention as the other data tests.
const paths = {
  "@/lib/domain/helpers": "../domain/helpers.ts", "@/lib/data/services": "../data/services.ts",
  "@/lib/data/industries": "../data/industries.ts", "@/lib/data/packages": "../data/packages.ts",
  "@/lib/data/relationships": "../data/relationships.ts", "@/lib/data/routes": "../data/routes.ts",
  "@/lib/routing/legacy-redirects": "./legacy-redirects.ts",
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
const { legacyRedirects } = load("@/lib/routing/legacy-redirects");
const { routes } = load("@/lib/data/routes");
const livePaths = new Set(routes.map((route) => route.path));
const sources = legacyRedirects.map((entry) => entry.source);

test("every legacy redirect lands on a live registry route in one hop", () => {
  assert.equal(legacyRedirects.length, 6 + 2 + 18);
  for (const { source, destination } of legacyRedirects) {
    assert.equal(livePaths.has(destination), true, `${source} -> ${destination} is not a registry path`);
    assert.equal(sources.includes(destination), false, `${source} chains through another redirect`);
  }
});

test("retired sources are unique and never shadow a live route", () => {
  assert.equal(new Set(sources).size, sources.length);
  for (const source of sources) assert.equal(livePaths.has(source), false, `${source} is still a live route`);
});

test("v3.0 decisions: partnerships/audit routes are gone, proposal and package paths are aligned", () => {
  for (const retired of ["/partnerships", "/digital-audit", "/request-proposal"]) assert.equal(livePaths.has(retired), false);
  assert.equal(livePaths.has("/proposal"), true);
  assert.equal(routes.some((route) => route.id === "route:partnerships" || route.id === "route:digital-audit"), false);
  const find = (source) => legacyRedirects.find((entry) => entry.source === source)?.destination;
  assert.equal(find("/request-proposal"), "/proposal");
  assert.equal(find("/partnerships"), "/contact");
  assert.equal(find("/packages/startup/basic"), "/packages/startup-basic");
  assert.equal(find("/packages/growing-business/premium"), "/packages/growing-business-premium");
  assert.equal(find("/services/cro"), "/services/conversion-optimization");
  assert.equal(find("/services/platform-advertising"), "/services/specialist-campaigns");
});

test("next.config.ts serves the map as explicit 301 redirects", () => {
  const config = readFileSync(new URL("../../next.config.ts", import.meta.url), "utf8");
  assert.match(config, /legacyRedirects/);
  assert.match(config, /statusCode:\s*301/);
  assert.doesNotMatch(config, /permanent:/);
});
