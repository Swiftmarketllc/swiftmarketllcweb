import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

// Existing in-memory TypeScript convention; no emitted files or framework.
// CSS module names are substituted for SSR contracts, not visual CSS testing.
const root = fileURLToPath(new URL("../../", import.meta.url));
const require = createRequire(import.meta.url);
const files = new Set([
  "components/layout/container.tsx", "components/layout/section.tsx", "components/layout/main-content.tsx",
  "components/ui/element-id.ts", "components/ui/section-heading.tsx", "components/ui/button.tsx",
  "components/ui/card.tsx", "components/ui/badge.tsx", "components/preview/ui-primitives-preview.tsx",
  "lib/domain/helpers.ts", "app/page.tsx", "app/layout.tsx", "app/not-found.tsx",
]);
const cache = new Map();
function load(file) {
  assert.ok(files.has(file), `Unexpected source import: ${file}`);
  if (cache.has(file)) return cache.get(file);
  const exports = {}; cache.set(file, exports);
  const source = readFileSync(resolve(root, file), "utf8");
  const output = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017,
    jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
  } }).outputText;
  const localRequire = (name) => {
    if (["react/jsx-runtime", "next/link"].includes(name)) return require(name);
    const target = name.startsWith("@/") ? resolve(root, name.slice(2)) : resolve(root, dirname(file), name);
    if (name.endsWith(".module.css")) {
      const css = readFileSync(target, "utf8");
      return Object.fromEntries([...css.matchAll(/\.([a-zA-Z][\w-]*)/g)].map(([ , key]) => [key, key]));
    }
    if (target === resolve(root, "app/globals.css")) return {};
    const path = target.slice(root.length).replaceAll("\\", "/").replace(/^\//, "");
    const resolved = [...files].find(f => f === `${path}.tsx` || f === `${path}.ts`);
    assert.ok(resolved, `Unexpected module: ${name}`);
    return load(resolved);
  };
  runInNewContext(output, { exports, require: localRequire });
  return exports;
}
const { Container } = load("components/layout/container.tsx");
const { Section } = load("components/layout/section.tsx");
const { MainContent } = load("components/layout/main-content.tsx");
const { SectionHeading } = load("components/ui/section-heading.tsx");
const { Button } = load("components/ui/button.tsx");
const { Card } = load("components/ui/card.tsx");
const { Badge } = load("components/ui/badge.tsx");
const render = (component, { children, ...props }) => renderToStaticMarkup(createElement(component, props, children));

test("typography selects solid local fallback faces without changing the approved stack or heading tokens", () => {
  const css = readFileSync(resolve(root, "app/globals.css"), "utf8");
  const faces = [...css.matchAll(/@font-face\s*\{([^}]+)\}/g)].map(match => match[1]);
  assert.equal(faces.length, 2);
  for (const face of faces) {
    assert.match(face, /font-family:\s*"Helvetica Neue"/);
    assert.match(face, /font-style:\s*normal/);
    assert.doesNotMatch(face, /url\(|Outline/i);
  }
  assert.match(faces[0], /local\("HelveticaNeue-Roman"\)/);
  assert.match(faces[0], /font-weight:\s*400/);
  assert.match(faces[1], /local\("HelveticaNeue-Bold"\)/);
  assert.match(faces[1], /font-weight:\s*700/);
  assert.match(css, /--font-brand:\s*"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif/);
  assert.match(css, /--brand-outer-space:\s*#11182f/i);
  assert.match(css, /--weight-heading:\s*600/);
  for (const selector of ["h1, h2, h3, h4, h5, h6", ".type-display, .type-h1, .type-h2, .type-h3, .type-h4"]) {
    const start = css.indexOf(selector);
    assert.ok(start >= 0);
    const rules = css.slice(start, css.indexOf("}", start));
    assert.match(rules, /color:\s*var\(--foreground\)/);
    assert.match(rules, /-webkit-text-fill-color:\s*currentColor/);
    assert.match(rules, /text-shadow:\s*none/);
  }
  assert.doesNotMatch(css, /(?:-webkit-)?text-stroke\s*:|text-fill-color:\s*transparent/i);
});

test("containers compose the existing page and nested reading-width conventions without fixed sizing", () => {
  const markup = render(Container, { children: createElement(Container, { width: "reading" }, "TEST CONTENT ONLY") });
  assert.match(markup, /class="page-container container"/);
  assert.match(markup, /class="reading-container container"/);
  assert.doesNotMatch(markup, /style=|width=/);
});
test("sections validate optional IDs and accessible label references, reserving the main target", () => {
  const markup = render(Section, { id: "test-section", spacing: "compact", labelledBy: "test-heading test-description", children: "TEST CONTENT ONLY" });
  assert.match(markup, /^<section/); assert.match(markup, /id="test-section"/);
  assert.match(markup, /aria-labelledby="test-heading test-description"/);
  assert.match(markup, /section-compact/);
  for (const id of ["", "Invalid ID", "../test", "main-content"]) assert.throws(() => render(Section, { id, children: "TEST" }));
  for (const labelledBy of ["", "Bad Reference", "test-heading test-heading"]) assert.throws(() => render(Section, { labelledBy, children: "TEST" }));
  assert.throws(() => render(Section, { label: " ", children: "TEST" }));
  assert.throws(() => render(Section, { label: "TEST", labelledBy: "test-heading", children: "TEST" }));
  assert.match(render(Section, { label: "TEST SECTION ONLY", children: "TEST" }), /aria-label="TEST SECTION ONLY"/);
  assert.doesNotMatch(render(Section, { children: "TEST" }), /aria-label/);
});
test("main content fixes the skip target and programmatic focus even if untyped callers override props", () => {
  const markup = render(MainContent, { id: "wrong", tabIndex: 0, children: "TEST" });
  assert.match(markup, /^<main/); assert.match(markup, /id="main-content"/); assert.match(markup, /tabindex="-1"/);
  assert.doesNotMatch(markup, /wrong|tabindex="0"/);
});
test("section heading levels are explicit, content is escaped and absent supporting copy is omitted", () => {
  for (const level of [2, 3, 4]) {
    const markup = render(SectionHeading, { level, id: "test-heading", heading: "<script>TEST ONLY</script>", eyebrow: "TEST EYEBROW", description: "TEST DESCRIPTION" });
    assert.match(markup, new RegExp(`<h${level} id="test-heading"`));
    assert.match(markup, /&lt;script&gt;/); assert.doesNotMatch(markup, /<script>/);
    assert.match(markup, /TEST EYEBROW/); assert.match(markup, /TEST DESCRIPTION/);
  }
  assert.doesNotMatch(render(SectionHeading, { level: 2, heading: "TEST", eyebrow: " ", description: " " }), /<p/);
  for (const level of [1, 5, 6, 0]) assert.throws(() => render(SectionHeading, { level, heading: "TEST" }));
  assert.throws(() => render(SectionHeading, { level: 2, heading: " " }));
  assert.throws(() => render(SectionHeading, { level: 2, heading: "TEST", id: "main-content" }));
});
test("buttons default to safe native actions and preserve explicit types, disabled and popover attributes", () => {
  assert.match(render(Button, { children: "TEST" }), /^<button type="button" class="button-base button-primary button"/);
  const secondary = render(Button, { variant: "secondary", type: "reset", disabled: true, children: "TEST" });
  assert.match(secondary, /disabled=""/); assert.match(secondary, /type="reset"/); assert.doesNotMatch(secondary, /button-primary|href=/);
  assert.match(render(Button, { type: "submit", children: "TEST" }), /type="submit"/);
  assert.match(render(Button, { popoverTarget: "test-note", popoverTargetAction: "show", children: "TEST" }), /popovertarget="test-note"/i);
});
test("card semantics stay presentational by default and badges require text without inferred live announcements", () => {
  assert.match(render(Card, { children: "TEST" }), /^<div/);
  assert.match(render(Card, { as: "article", children: "TEST", "aria-labelledby": "test-heading" }), /^<article/);
  assert.doesNotMatch(render(Card, { children: "TEST" }), /role="button"|tabindex=|href=/);
  for (const tone of ["neutral", "success", "warning", "error"]) {
    const markup = render(Badge, { tone, children: `TEST ${tone}` });
    assert.match(markup, new RegExp(`badge ${tone}`)); assert.doesNotMatch(markup, /role=|aria-live=/);
  }
  assert.throws(() => render(Badge, { children: " " }));
});
test("mobile full-width sizing is scoped to both preview action groups and excludes badges", () => {
  const css = readFileSync(resolve(root, "components/preview/ui-primitives-preview.module.css"), "utf8");
  const [desktop, mobile] = css.split("@media (max-width: 40rem)");
  assert.ok(mobile, "Missing contextual mobile layout");
  assert.match(desktop, /\.samples,\s*\.actionGroup\s*\{[^}]*flex-wrap:\s*wrap/);
  assert.match(desktop, /gap:\s*var\(--space-4\)/);
  const badgeGroup = desktop.match(/\.samples\s*\{([^}]+)\}/)?.[1];
  assert.ok(badgeGroup, "Badge-specific rules must remain separate from action sizing");
  assert.match(badgeGroup, /gap:\s*var\(--space-2\)/);
  assert.match(badgeGroup, /align-items:\s*flex-start/);
  assert.doesNotMatch(badgeGroup, /(?:inline-size|width|flex-basis|flex-direction)\s*:/);
  assert.doesNotMatch(desktop, /inline-size:\s*100%|flex-direction:\s*column/);
  assert.match(mobile, /\.actionGroup\s*\{[^}]*flex-direction:\s*column;\s*align-items:\s*stretch/);
  const controls = mobile.match(/\.actionGroup > :is\(button, a\)\s*\{([^}]+)\}/)?.[1];
  assert.ok(controls, "Full-width rules must target direct action controls only");
  assert.match(controls, /inline-size:\s*100%/);
  assert.match(controls, /min-inline-size:\s*0/);
  assert.match(controls, /min-block-size:\s*var\(--control-min\)/);
  assert.match(controls, /white-space:\s*normal/);
  assert.match(controls, /overflow-wrap:\s*anywhere/);
  assert.doesNotMatch(mobile, /\.samples|\.badge/);
  const markup = render(load("app/page.tsx").default, {});
  const groups = [...markup.matchAll(/<div class="actionGroup">([\s\S]*?)<\/div>/g)];
  assert.equal(groups.length, 2, "Both M3 and M5 preview action groups must opt in");
  for (const [, contents] of groups) {
    assert.equal((contents.match(/<(?:button|a)\b/g) ?? []).length, 3);
    assert.doesNotMatch(contents, /<span|badge/);
  }
  assert.match(markup, /<div class="samples"><span class="badge/);
});

test("the integrated preview keeps one main, one H1, unique IDs and real local label/button targets", () => {
  const page = load("app/page.tsx"), layout = load("app/layout.tsx");
  const markup = render(layout.default, { children: createElement(page.default) });
  assert.equal((markup.match(/<main\b/g) ?? []).length, 1);
  assert.equal((markup.match(/<h1\b/g) ?? []).length, 1);
  const ids = [...markup.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.includes("main-content")); assert.match(markup, /href="#main-content"/);
  for (const [, values] of markup.matchAll(/aria-labelledby="([^"]+)"/g)) for (const id of values.split(" ")) assert.ok(ids.includes(id), `Missing label: ${id}`);
  for (const [, id] of markup.matchAll(/popovertarget="([^"]+)"/gi)) assert.ok(ids.includes(id), `Missing note: ${id}`);
  assert.match(markup, /popover="auto"/);
  assert.match(markup, /popovertargetaction="show"/i); assert.match(markup, /popovertargetaction="hide"/i);
  assert.doesNotMatch(markup, /<form|<nav|<header|<footer/);
  assert.equal(page.metadata.robots.index, false); assert.equal(page.metadata.robots.follow, false);
  assert.match(markup, /M3 \/ Internal preview/); assert.match(markup, /M5.1.1 \/ Internal demonstration/);
  const fallback = render(load("app/not-found.tsx").default, {});
  assert.equal((fallback.match(/<main\b/g) ?? []).length, 1);
  assert.match(fallback, /id="main-content" tabindex="-1"/);
});
