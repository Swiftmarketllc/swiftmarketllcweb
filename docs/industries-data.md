# Swift Market LLC — Centralized Industry Data

M4.5 establishes the approved industry candidate inventory using unchanged M4.3 contracts. Authority: [MVP requirements v3.0](mvp-requirements-v3.0.md) Section 6, [information architecture](information-architecture.md) Sections 17–18, [route architecture](route-architecture.md) Sections 16 and 38, [domain models](domain-models.md), [services data](services-data.md), and [AGENTS.md](../AGENTS.md).

## Files and usage

- [industries.ts](../lib/data/industries.ts): canonical `industries`, TBF relationship decisions and two exact lookup helpers. Import from `@/lib/data/industries`.
- [industries.test.mjs](../lib/data/industries.test.mjs): focused Node built-in tests using installed TypeScript in memory, following the existing services test convention.
- This document: inventory, pending inputs and future population/publication rules.

The module uses existing `Industry`, `IndustryServiceRelationship`, `IndustryPackageRelationship` and `Decision` contracts. It imports the existing `parseSlug` guard explicitly from `@/lib/domain/helpers`; other imports are type-only. No alternative schema, domain change, dependency, package script or configuration is introduced.

Installed Next.js 16 guidance in `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` was consulted for default server rendering, narrow client boundaries and serializable props. Records are frozen plain objects containing strings and nested decision objects; the slug brand exists only at compile time. The module contains no personal enquiry data, secrets, provider, environment access, network request or persistence.

## Canonical inventory

Exactly **11** candidates preserve requirements order and display names. Slugs preserve M4.1/M4.2. IDs use the existing `industry:` namespace followed by the stable canonical slug. These sources did not previously instantiate industry IDs; the convention does not change their naming or URL decisions.

Every record is **draft**. Candidate paths below document conditional architecture only; they are not implemented routes, public links, route registry entries or sitemap URLs.

| Approved name | Canonical ID | Slug | Conditional detail candidate |
| --- | --- | --- | --- |
| Healthcare | industry:healthcare | healthcare | /industries/healthcare |
| Real Estate | industry:real-estate | real-estate | /industries/real-estate |
| Home Services | industry:home-services | home-services | /industries/home-services |
| Ecommerce | industry:ecommerce | ecommerce | /industries/ecommerce |
| SaaS / AI / Technology | industry:saas-ai-technology | saas-ai-technology | /industries/saas-ai-technology |
| Restaurants / Franchises | industry:restaurants-franchises | restaurants-franchises | /industries/restaurants-franchises |
| Legal | industry:legal | legal | /industries/legal |
| Education | industry:education | education | /industries/education |
| Finance | industry:finance | finance | /industries/finance |
| Automotive | industry:automotive | automotive | /industries/automotive |
| B2B / Professional Services | industry:b2b-professional-services | b2b-professional-services | /industries/b2b-professional-services |

The candidate count is inventory, not a launch-page commitment or evidence of sector experience. Additional industries require approved identity/content and shared data updates. Regulated-sector names imply no compliance expertise or credentials. Ecommerce remains a client industry; this website remains enquiry/proposal-first.

## TBF content and relationships

All 11 descriptions, problems, FAQs and CTAs use `{ state: "tbf" }`. No summaries, SEO text, statistics, timelines, guarantees, prices, quantities, testimonials or performance claims are populated. Optional `routeId` is omitted until a concrete route registry is established.

| Capability | Current state | Existing contract / future rule |
| --- | --- | --- |
| Industry ↔ individual service | `industryServiceRelationships` is TBF; no associations populated | `Decision<readonly IndustryServiceRelationship[]>`; approved IDs, relevance and publication per association |
| Industry ↔ package recommendation | `industryPackageRelationships` is TBF; no recommendations populated | `Decision<readonly IndustryPackageRelationship[]>`; approved package ID, suitability and publication |
| Industry content / enquiry CTA | TBF for every record | `Industry` decisions; future CTA uses `SelectionContext.industryId` |
| Detail page / SEO / indexability | Unimplemented; SEO inputs and origin remain TBF | Optional `Industry.routeId` links to future `RouteDefinition`, whose metadata and indexability own these concerns |
| Contextual proof | No evidence populated | Existing `Proof.relatedEntities` can reference an industry; verification and publication rights are required |

TBF relationship decisions apply to the entire inventory. They do not mean confirmed absence of relationships, approved empty recommendations or availability of every service/package to every industry. Consumers must branch on `state` before accessing `value`. No speculative filtering helpers are added while mappings are unresolved.

Existing M4.4 has 22 families and zero individual service records. Family IDs must not masquerade as `ServiceId` references. Approve actual individual services and their parents before creating industry-service associations; derive family/reverse views from that shared association source. Avoid independently copied lists and all-to-all mappings.

Package suitability never implies inclusion, pricing, an add-on or eligibility. Startup/Growing Business retain exactly Basic/Standard/Premium through existing package contracts. Enterprise remains consultation-led custom selection, using existing public selection context with `industryId` and optional `enterprise: true`; it is not an industry package tier. No Enterprise service options or industry recommendation are inferred here.

Commercial scope remains owned by service/package/project/add-on/Enterprise records. The existing external-cost baseline in `lib/data/services.ts` preserves separate advertising/media spend, third-party tools, hosting, premium assets, production and other external costs. Industry relevance does not include or waive these costs; no commercial values are duplicated in this module.

## Lookup behavior and enquiry intent

`getIndustryById(id)` and `getIndustryBySlug(slug)` return the canonical record or `undefined`. They are deterministic and exact: no aliases, case folding, trailing-slash coercion, fallback records or mutations. They intentionally return drafts for architecture/editorial use and are **not publication filters or server-side input validators**.

M4.1/M4.2 propose Request a Consultation → `/consultation` for industry details, retaining industry identity. That architecture is preserved while concrete CTA content remains TBF until the destination and content are approved and working. Later enquiry validation must verify supplied identity, allowed relationships and public eligibility. Do not put contact details, messages or budgets in public context, metadata or URLs. No checkout, payment, route, form, submission promise or integration is implemented.

## Publication gates and future population

All 11 candidates remain unpublished, with zero public/indexable industry pages introduced. A draft record or valid slug cannot satisfy a publication gate. Future route generation, navigation, related links and sitemap consumers must exclude drafts; syntax/readonly types alone cannot enforce that runtime policy.

Before publishing a selected industry detail:

1. Confirm the launch subset and publication approval against the M4.2 route gate; preserve its canonical identity and `/industries` parent.
2. Supply useful, distinct approved sector description, problems and FAQs where relevant; resolve or omit launch-facing unknowns. Avoid cloned keyword/doorway pages and unsupported sector claims.
3. Approve relevant relationships, reference existing canonical services/packages and verify their publication/availability. Record relevance/suitability and association publication; recommendations do not create inclusions.
4. Supply verified evidence with publication permission only if used; omit absent proof rather than fabricate it.
5. Establish a working consultation/enquiry destination with approved CTA content and safe validated industry context.
6. Approve unique title/description and other required SEO inputs in the route source, verified production origin, canonical URL, truthful applicable schema, deliberate indexability and sitemap eligibility. No domain or SEO wording is invented here.
7. Review actual content, internal links, responsive/accessibility behavior and applicable publication/technical QA in the authorized page milestone. Record approval and factual publication timestamp only when publishing.

Pending decisions: selected launch industries; sector content and ownership; actual service catalog and relevance mappings; package recommendations; proof and permissions if used; CTA wording/working enquiry workflow; production origin and metadata/indexing decisions. These are future publication inputs, not blockers to this draft data foundation.

No M4.1/M4.2 identity or route conflict was found. Existing README/AGENTS status text retains historical Step 0 wording; the user-confirmed freeze at `baf5213` governs this task without editing those files. M4.3's substep table is a planning proposal; the current M4.5 scope governs this implementation. Requirements, earlier documents, domain/services modules, M3 and configuration remain unchanged.

## Tests and validation

```sh
node lib/data/industries.test.mjs
node lib/data/services.test.mjs
pnpm exec tsc --noEmit
pnpm lint
pnpm build
git diff --check
git status --short
```

Six industry tests compare exact names/count with requirements Section 6 and slugs/names with both M4.1 Section 17 and M4.2 Section 38. They check unique correlated IDs, slug validation, canonical/missing lookup results, exact permitted record fields, draft/TBF state, unresolved relationships, immutability, ordering and JSON serialization. The services suite provides regression coverage of the existing service inventory and separate-cost baseline.

Only the trusted industry module and existing syntax helper are transpiled in memory. The test loader permits only the explicit helper import. Tests emit no files, add no framework and are not imported by production data. Compiler validation includes the unchanged M4.3 contracts. Review new-file whitespace and pre/post source hashes because ordinary Git diff does not include untracked work. Build/cache output is generated tooling output.

Passing these checks establishes data/type compatibility, not page publication, rendered QA, production SEO, lead delivery or launch readiness.
