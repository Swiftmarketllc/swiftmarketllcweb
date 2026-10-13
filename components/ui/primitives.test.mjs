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
  "components/ui/cta-link.tsx", "components/sections/color-block.tsx",
  "components/layout/site-header.tsx", "components/layout/site-footer.tsx",
  "components/navigation/public-navigation.tsx", "components/navigation/mobile-menu.tsx",
  "lib/data/public-consumers.ts", "lib/data/content.ts", "lib/data/navigation.ts", "lib/data/routes.ts",
  "lib/data/services.ts", "lib/data/industries.ts", "lib/data/packages.ts", "lib/data/relationships.ts",
  "components/pages/launch-page-body.tsx", "components/pages/public-launch-page.tsx",
  "components/preview/launch-copy-drafts.ts", "components/preview/enquiry-form-demo.tsx",
  "components/preview/launch-pages-preview.tsx",
  "components/forms/enquiry-form.tsx", "lib/enquiry/form-contract.ts",
  "components/pages/homepage.tsx", "components/preview/homepage-review.tsx",
  "components/sections/home-hero.tsx", "components/sections/ribbon-artwork.tsx",
  "components/sections/home-capabilities.tsx", "components/sections/home-story.tsx",
  ...["services", "industries", "packages", "about", "contact", "privacy"].map(name => `app/${name}/page.tsx`),
]);
const cache = new Map();
const testEnvironment = { env: { NODE_ENV: "production" } };
// DOM-free event fixtures only; no browser behavior is claimed by these tests.
class SyntheticElement {
  constructor(link = null) { this.link = link; }
  closest(selector) { assert.equal(selector, "a[href]"); return this.link; }
}
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
    if (name === "next/navigation") return { notFound() { throw new Error("TEST_NOT_FOUND"); } };
    if (["react", "react/jsx-runtime", "next/link"].includes(name)) return require(name);
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
  runInNewContext(output, { exports, require: localRequire, URL, Element: SyntheticElement, process: testEnvironment });
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
  assert.doesNotMatch(markup, /<form|<nav/);
  assert.equal((markup.match(/<header\b/g) ?? []).length, 1);
  assert.equal((markup.match(/<footer\b/g) ?? []).length, 1);
  assert.equal(page.metadata.robots.index, false); assert.equal(page.metadata.robots.follow, false);
  assert.match(markup, /M3 \/ Internal preview/); assert.match(markup, /M5.1.1 \/ Internal demonstration/);
  const fallback = render(load("app/not-found.tsx").default, {});
  assert.equal((fallback.match(/<main\b/g) ?? []).length, 1);
  assert.match(fallback, /id="main-content" tabindex="-1"/);
});

// SYNTHETIC TEST FIXTURES ONLY: never imported/exported as production content.
function publicationFixture() {
  const approved = value => ({ state: "approved", value, approvalReference: "SYNTHETIC TEST ONLY" });
  const published = { status: "published", approvalReference: "SYNTHETIC TEST ONLY", publishedAt: "2000-01-01T00:00:00Z" };
  const cta = routeId => ({ kind: "navigation", intent: "explore", label: "SYNTHETIC TEST ONLY", destination: { routeId } });
  const ids = ["route:home", "route:about"];
  return {
    routes: load("lib/data/routes.ts").routes.map(record => ids.includes(record.id) ? { ...record,
      publication: published, verification: "reviewed", generation: "static", audience: approved([]),
      seoIntent: approved("SYNTHETIC TEST ONLY"), dataSource: approved("SYNTHETIC TEST ONLY"),
      contentOwner: approved("SYNTHETIC TEST ONLY"), template: approved("SYNTHETIC TEST ONLY"), primaryCTA: approved(cta(record.id)),
      metadata: { title: approved(`SYNTHETIC ${record.id}`), description: approved(`SYNTHETIC DESCRIPTION ${record.id}`) },
      indexability: approved({ index: false, follow: true, sitemap: false }),
    } : record),
    content: load("lib/data/content.ts").content.map(record => ids.includes(record.routeId) ? { ...record,
      publication: published, title: approved("SYNTHETIC TEST ONLY"), summary: approved("SYNTHETIC TEST ONLY"),
      heading: approved("SYNTHETIC TEST ONLY"), canonicalPath: approved(record.routeId === "route:home" ? "/" : "/about"),
      factualReview: approved(true), cta: approved(cta(record.routeId)), sections: approved([
        { id: "overview", role: "overview", heading: "SYNTHETIC TEST ONLY", body: "SYNTHETIC TEST ONLY", proofIds: [], claims: [] },
      ]),
    } : record), proofs: [], origin: approved("https://example.invalid"),
  };
}

test("ColorBlock composes validated sections and reading containers with approved opt-in surfaces", () => {
  const { ColorBlock } = load("components/sections/color-block.tsx");
  for (const surface of ["warm", "cool"]) {
    const markup = render(ColorBlock, { surface, id: "test-block", labelledBy: "test-heading", children: createElement("h3", { id: "test-heading" }, "SYNTHETIC TEST ONLY") });
    assert.match(markup, /^<section/); assert.match(markup, /aria-labelledby="test-heading"/);
    assert.match(markup, new RegExp(`block ${surface}`)); assert.match(markup, /reading-container/);
    assert.doesNotMatch(markup, /<main|<h1|style=/);
  }
  assert.throws(() => render(ColorBlock, { surface: "invalid", labelledBy: "test-heading" }));
  assert.throws(() => render(ColorBlock, { surface: "warm", id: "main-content", labelledBy: "test-heading" }));
});

test("CTA anchors fail closed for drafts, missing records and submit actions without placeholder links", () => {
  const { CTALink } = load("components/ui/cta-link.tsx");
  for (const routeId of ["route:home", "route:missing"]) assert.equal(render(CTALink, {
    cta: { kind: "navigation", intent: "explore", label: "SYNTHETIC TEST ONLY", destination: { routeId } },
  }), "");
  assert.equal(render(CTALink, { cta: { kind: "submit-enquiry", intent: "request-proposal", label: "SYNTHETIC TEST ONLY" } }), "");
  assert.equal(render(CTALink, { cta: { kind: "enquiry-link", intent: "request-consultation", label: "SYNTHETIC TEST ONLY",
    destination: { routeId: "route:consultation" }, context: { enterprise: true } } }), "");
});

test("CTA links require eligible target content and verified fragments, preserving native anchor semantics", () => {
  const { CTALink } = load("components/ui/cta-link.tsx");
  const sources = publicationFixture();
  const cta = { kind: "navigation", intent: "explore", label: "SYNTHETIC TEST ONLY", destination: { routeId: "route:about", fragment: "overview" } };
  assert.match(render(CTALink, { cta, sources }), /^<a href="\/about#overview" class="button-base pill button-primary"/);
  assert.doesNotMatch(render(CTALink, { cta, sources, variant: "secondary" }), /button-primary|<button/);
  assert.match(render(CTALink, { cta, sources, variant: "text" }), /class="textLink"/);
  assert.equal(render(CTALink, { cta: { ...cta, destination: { ...cta.destination, fragment: "missing" } }, sources }), "");
  const drafts = { ...sources, content: sources.content.map(record => record.routeId === "route:about" ? { ...record, publication: { status: "draft" } } : record) };
  assert.equal(render(CTALink, { cta, sources: drafts }), "");
});

test("empty canonical shell omits navigation and menu controls and never links to the internal preview", () => {
  const header = render(load("components/layout/site-header.tsx").SiteHeader, {});
  const footer = render(load("components/layout/site-footer.tsx").SiteFooter, {});
  assert.match(header, /^<header/); assert.match(header, /<span class="brand">Swift Market LLC/);
  assert.match(footer, /^<footer/);
  assert.doesNotMatch(header + footer, /href=|<nav|<summary|<details|<button|<main|<h1/);
});

test("populated synthetic shell resolves only eligible canonical header/footer destinations", () => {
  const sources = publicationFixture();
  const header = render(load("components/layout/site-header.tsx").SiteHeader, { sources });
  const footer = render(load("components/layout/site-footer.tsx").SiteFooter, { sources });
  assert.match(header, /href="\/"/); assert.match(header, /<summary class="button-base">Menu/);
  assert.match(header + footer, /href="\/about"/);
  const links = [...(header + footer).matchAll(/href="([^"]+)"/g)].map(match => match[1]);
  assert.ok(links.length > 0); assert.ok(links.every(path => path === "/" || path === "/about"));
  assert.doesNotMatch(header + footer, /<main|<h1|role="menu"/);
});

test("mobile disclosure Escape restores summary focus and link activation closes without trapping Tab", () => {
  const { MobileMenu } = load("components/navigation/mobile-menu.tsx");
  assert.equal(MobileMenu({ children: null }), null);
  const menu = MobileMenu({ children: createElement("nav", null, "SYNTHETIC TEST ONLY") });
  assert.equal(menu.type, "details");
  let focused = 0, prevented = 0;
  const details = { open: true, querySelector: selector => { assert.equal(selector, "summary"); return { focus: () => focused++ }; } };
  menu.props.onKeyDown({ key: "Tab", currentTarget: details, preventDefault: () => prevented++ });
  assert.equal(details.open, true); assert.equal(prevented, 0);
  menu.props.onKeyDown({ key: "Escape", currentTarget: details, preventDefault: () => prevented++ });
  assert.equal(details.open, false); assert.equal(focused, 1); assert.equal(prevented, 1);
  details.open = true;
  menu.props.onClick({ target: new SyntheticElement({}), currentTarget: details });
  assert.equal(details.open, false);
});

test("Day 1 presentation remains opt-in, token-based, wrap-safe and contrast-safe", () => {
  const css = readFileSync(resolve(root, "components/sections/color-block.module.css"), "utf8");
  const brand = readFileSync(resolve(root, "components/ui/brand-presentation.module.css"), "utf8");
  assert.match(css, /background:\s*var\(--surface-story-warm\)/);
  assert.match(css, /background:\s*var\(--surface-story-cool\)/);
  assert.match(css, /:global\(\.text-muted\)\s*\{\s*color:\s*var\(--text-secondary\)/);
  assert.match(css, /padding:\s*clamp\(/); assert.match(css, /forced-colors/);
  assert.match(brand, /\.pill\s*\{\s*border-radius:\s*var\(--radius-pill\)/);
  assert.doesNotMatch(css + brand, /text-stroke\s*:|text-fill-color:\s*transparent|overflow:\s*hidden/);
});

test("Day 2 route entry points fail closed for canonical drafts and unknown references", () => {
  const { PublicLaunchPage } = load("components/pages/public-launch-page.tsx");
  for (const name of ["home", "services", "industries", "packages", "about", "contact", "privacy", "unknown"]) {
    assert.throws(() => render(PublicLaunchPage, { routeId: `route:${name}` }), /TEST_NOT_FOUND/);
  }
  for (const name of ["services", "industries", "packages", "about", "contact", "privacy"]) {
    assert.throws(() => render(load(`app/${name}/page.tsx`).default, {}), /TEST_NOT_FOUND/);
  }
});

test("Day 2 metadata fails closed without draft SEO copy or fabricated canonicals", () => {
  const { launchPageMetadata } = load("components/pages/public-launch-page.tsx");
  for (const name of ["home", "services", "industries", "packages", "about", "contact", "privacy"]) {
    const metadata = launchPageMetadata(`route:${name}`);
    assert.equal(metadata.robots.index, false);
    assert.equal(metadata.robots.follow, false);
    assert.equal(metadata.title, "Page unavailable");
    assert.equal(metadata.description, "");
    assert.equal(metadata.alternates, undefined);
    assert.equal(metadata.openGraph, undefined);
  }
});

test("Day 2 editorial drafts preserve exactly seven canonical pairs without approvals or destinations", () => {
  const { launchCopyDrafts } = load("components/preview/launch-copy-drafts.ts");
  const names = ["home", "services", "industries", "packages", "about", "contact", "privacy"];
  assert.equal(launchCopyDrafts.length, 7);
  assert.equal(new Set(launchCopyDrafts.map(draft => draft.routeId)).size, 7);
  for (const [index, draft] of launchCopyDrafts.entries()) {
    assert.equal(draft.routeId, `route:${names[index]}`);
    assert.equal(draft.contentId, `content:${names[index]}`);
    assert.equal(draft.status, "draft");
    assert.match(draft.pending, /TBF/);
    assert.equal(draft.body.cta, undefined);
    assert.ok(draft.body.sections.every(section => !section.cta));
  }
});

test("Day 2 copy review is development-only and does not add landmarks, links or duplicate IDs", () => {
  const { LaunchPagesPreview } = load("components/preview/launch-pages-preview.tsx");
  assert.equal(render(LaunchPagesPreview, {}), "");
  for (const environment of ["test", "production"]) {
    testEnvironment.env.NODE_ENV = environment;
    assert.equal(render(LaunchPagesPreview, {}), "");
  }
  testEnvironment.env.NODE_ENV = "development";
  try {
    const markup = render(load("app/page.tsx").default, {});
    assert.equal((markup.match(/<main\b/g) ?? []).length, 1);
    assert.equal((markup.match(/<h1\b/g) ?? []).length, 1);
    assert.match(markup, /Day 2 \/ Internal page-copy drafts/);
    assert.equal((markup.match(/— DRAFT \/ TBF/g) ?? []).length, 7);
    const ids = [...markup.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length);
    assert.doesNotMatch(markup, /href="\/(services|industries|packages|about|contact|privacy)/);
  } finally { testEnvironment.env.NODE_ENV = "production"; }
});

test("Day 2 provisional enquiry UI cannot submit or serialize personal input", () => {
  const { EnquiryFormDemo } = load("components/preview/enquiry-form-demo.tsx");
  const markup = render(EnquiryFormDemo, {});
  assert.match(markup, /<fieldset disabled=""/);
  assert.match(markup, /aria-describedby="draft-enquiry-note"/);
  assert.equal((markup.match(/required=""/g) ?? []).length, 3);
  assert.equal((markup.match(/<label\b/g) ?? []).length, 5);
  assert.match(markup, /type="email"/); assert.match(markup, /type="url"/);
  const button = markup.match(/<button\b[^>]*>/)?.[0] ?? "";
  assert.match(button, /type="button"/);
  assert.match(button, /disabled=""/);
  assert.doesNotMatch(markup, /<form\b|\baction=|\bname=|type="submit"/);
});

test("Day 2 production root preserves the internal preview and excludes editorial review copy", () => {
  const markup = render(load("app/page.tsx").default, {});
  assert.doesNotMatch(markup, /Day 2 \/ Internal page-copy drafts|draft-enquiry-name|Digital growth, marketing and technology/);
  const metadata = load("app/page.tsx").metadata;
  assert.equal(metadata.robots.index, false); assert.equal(metadata.robots.follow, false);
  assert.equal((markup.match(/<main\b/g) ?? []).length, 1);
  assert.equal((markup.match(/<h1\b/g) ?? []).length, 1);
});

test("Phase 2 enquiry form uses labelled provisional fields and disables public submission by default", () => {
  const { EnquiryForm } = load("components/forms/enquiry-form.tsx");
  const markup = render(EnquiryForm, {});
  assert.match(markup, /<form[^>]*aria-describedby=/);
  assert.match(markup, /<fieldset disabled=""/);
  assert.match(markup, /role="status" aria-live="polite" tabindex="-1"/);
  assert.equal((markup.match(/required=""/g) ?? []).length, 3);
  for (const name of ["name", "email", "message", "company", "website"]) assert.match(markup, new RegExp(`name="${name}"`));
  const ids = [...markup.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  for (const [, id] of markup.matchAll(/for="([^"]+)"/g)) assert.ok(ids.includes(id));
  const honeypot = markup.match(/<input[^>]*name="companyFax"[^>]*>/)?.[0] ?? "";
  assert.match(honeypot, /tabindex="-1"/);
  assert.match(markup, /Submission unavailable/);
  assert.doesNotMatch(markup, /action=|info@swiftmarketllc|Your enquiry was accepted/);
});

test("premium homepage public entry fails closed and never renders provisional review copy", () => {
  const { Homepage } = load("components/pages/homepage.tsx");
  const { HomepageReview } = load("components/preview/homepage-review.tsx");
  assert.equal(render(Homepage, {}), "");
  assert.equal(render(HomepageReview, {}), "");
  testEnvironment.env.NODE_ENV = "development";
  try {
    const markup = render(HomepageReview, {});
    assert.match(markup, /DRAFT \/ TBF/);
    assert.match(markup, /provisional/);
    assert.equal((markup.match(/<main\b/g) ?? []).length, 1);
    assert.equal((markup.match(/<h1\b/g) ?? []).length, 1);
    assert.equal((markup.match(/<header\b/g) ?? []).length, 1);
    assert.equal((markup.match(/<footer\b/g) ?? []).length, 1);
    assert.equal((markup.match(/<article\b/g) ?? []).length, 3);
    assert.match(markup, /id="main-content" tabindex="-1"/);
    assert.doesNotMatch(markup, /<a\b|<button\b|<form\b|<canvas\b|<img\b/);
    const ids = [...markup.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length);
    for (const [, label] of markup.matchAll(/aria-labelledby="([^"]+)"/g)) assert.ok(ids.includes(label));
    assert.match(markup, /block warm/); assert.match(markup, /block cool/);
  } finally { testEnvironment.env.NODE_ENV = "production"; }
  assert.doesNotMatch(render(load("app/page.tsx").default, {}), /Make room|what&#x27;s next/);
});

test("original ribbon is decorative, self-contained and uses unique gradient IDs", () => {
  const { RibbonArtwork } = load("components/sections/ribbon-artwork.tsx");
  const markup = renderToStaticMarkup(createElement("div", null, createElement(RibbonArtwork), createElement(RibbonArtwork)));
  assert.equal((markup.match(/aria-hidden="true"/g) ?? []).length, 2);
  assert.equal((markup.match(/focusable="false"/g) ?? []).length, 2);
  const ids = [...markup.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const [, id] of markup.matchAll(/url\(#([^)]*)\)/g)) assert.ok(ids.includes(id));
  assert.doesNotMatch(markup, /https?:|<image\b|<text\b|<script\b/);
});

test("homepage compositions omit empty cards and publication-ineligible CTA destinations", () => {
  const { HomeCapabilities } = load("components/sections/home-capabilities.tsx");
  assert.equal(render(HomeCapabilities, { items: [] }), "");
  const markup = render(load("components/pages/homepage.tsx").HomepageComposition, {
    heading: "SYNTHETIC TEST ONLY", summary: "SYNTHETIC TEST ONLY", capabilities: [], stories: [],
    cta: { kind: "navigation", intent: "explore", label: "SYNTHETIC ONLY", destination: { routeId: "route:contact" } },
  });
  assert.doesNotMatch(markup, /<a\b/);
  assert.equal((markup.match(/<h1\b/g) ?? []).length, 1);
});

test("homepage layout is token-based, wrap-safe and progressively enhanced without motion dependence", () => {
  const css = ["home-hero", "home-capabilities", "home-story"].map(name => readFileSync(resolve(root, `components/sections/${name}.module.css`), "utf8")).join("\n");
  assert.match(css, /repeat\(12, minmax\(0, 1fr\)\)/);
  assert.match(css, /prefers-reduced-motion/); assert.match(css, /forced-colors/);
  assert.match(css, /hover: hover/); assert.match(css, /pointer: fine/);
  assert.match(css, /:focus-within/); assert.match(css, /:active/);
  assert.match(css, /var\(--type-display\)/); assert.match(css, /var\(--weight-heading\)/);
  assert.doesNotMatch(css, /text-stroke|text-fill-color:\s*transparent|opacity:\s*0[;}]|100vh|position:\s*fixed/);
});

test("redesigned hero preserves headline text with intentional lines and one accessible heading", () => {
  const markup = render(load("components/sections/home-hero.tsx").HomeHero, {
    heading: "SYNTHETIC FIRST\nSYNTHETIC SECOND", summary: "SYNTHETIC REVIEW ONLY",
  });
  assert.equal((markup.match(/<h1\b/g) ?? []).length, 1);
  assert.match(markup, /<span class="line">SYNTHETIC FIRST<\/span><span class="line"> SYNTHETIC SECOND<\/span>/);
  assert.doesNotMatch(markup, /<button|<canvas|<iframe/);
});

test("bento capabilities vary visual treatment without inventing interaction or losing supplied copy", () => {
  const items = ["one", "two", "three"].map(id => ({ id, heading: `SYNTHETIC ${id}`, body: `SYNTHETIC BODY ${id}` }));
  const markup = render(load("components/sections/home-capabilities.tsx").HomeCapabilities, { items });
  for (const variant of ["orbit", "paper", "system"]) assert.match(markup, new RegExp(`data-visual="${variant}"`));
  for (const item of items) assert.ok(markup.includes(item.heading) && markup.includes(item.body));
  assert.doesNotMatch(markup, /tabindex=|onclick=|role="button"/);
});

test("sticky scenes retain static content and restrict motion to optional decorative transforms", () => {
  const css = readFileSync(resolve(root, "components/sections/home-story.module.css"), "utf8");
  assert.match(css, /position: sticky/);
  assert.match(css, /min-height: 44rem/);
  assert.match(css, /prefers-reduced-motion: no-preference/);
  assert.match(css, /@supports \(animation-timeline: view\(\)\)/);
  assert.match(css, /\.scene:focus-within\s*\{ position: relative/);
  assert.match(css, /prefers-reduced-motion: reduce[^]*?\.scene\s*\{ position: relative/);
  assert.doesNotMatch(css, /opacity:\s*0|visibility:\s*hidden|animation:[^;]*infinite/);
});
