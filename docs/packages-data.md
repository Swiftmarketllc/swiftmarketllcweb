# Swift Market LLC — Centralized Package and Offer Data

M4.6 implements a typed draft offer foundation. Authority: [MVP requirements v3.0](mvp-requirements-v3.0.md) Sections 3–4 and 7–10; [information architecture](information-architecture.md) Sections 5 and 11–20; [route architecture](route-architecture.md) Sections 12–15 and 36; [domain models](domain-models.md), [services data](services-data.md), [industry data](industries-data.md), and [AGENTS.md](../AGENTS.md).

## Files and contracts

- [packages.ts](../lib/data/packages.ts): six canonical package records, the custom Enterprise offering, unresolved independent offer categories/relationships and exact lookup helpers. Import from `@/lib/data/packages`.
- [packages.test.mjs](../lib/data/packages.test.mjs): Node built-in integrity tests with installed TypeScript transpilation in memory, following the services/industry conventions.
- This document: complete populated inventory, unresolved offer categories, relationships and future content requirements.

Existing contracts remain unchanged. `PackageFor`, `PackageCatalog`, `EnterpriseOffering`, `OneTimeProject`, `AddOn`, `PackageServiceRelationship`, `AddOnCompatibility`, `ServiceId` and `Decision` are reused; no independent plan schema or commercial database model is added. The exact fresh catalog literal uses `satisfies PackageCatalog` to enforce its two segments, three tiers per segment and correlated IDs. Records, nested decisions, commercial fields, catalog segment objects and arrays are frozen. The flat `packages` view references the same records as `packageCatalog`.

Installed Next.js 16 guidance at `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` was reviewed for default Server Components, narrow client boundaries and serializable props. Data is plain JSON-compatible objects/arrays/strings with compile-time slug branding. Only public data and the existing slug guard are imported at runtime. No private enquiry records, personal data, secrets, environment access, provider, network, persistence, payment or framework routing API is introduced.

## Canonical package inventory

Exactly **six** packages are populated: **three Startup Business** and **three Growing Business** records. Approved display names remain Basic, Standard and Premium; segment is a separate field. A name alone cannot identify an offer or imply equal scope/pricing across segments.

| Segment | Name | Canonical ID | Slug | Architecture candidate path |
| --- | --- | --- | --- | --- |
| Startup Business | Basic | package:startup:basic | basic | /packages/startup-basic |
| Startup Business | Standard | package:startup:standard | standard | /packages/startup-standard |
| Startup Business | Premium | package:startup:premium | premium | /packages/startup-premium |
| Growing Business | Basic | package:growing-business:basic | basic | /packages/growing-business-basic |
| Growing Business | Standard | package:growing-business:standard | standard | /packages/growing-business-standard |
| Growing Business | Premium | package:growing-business:premium | premium | /packages/growing-business-premium |

IDs preserve M4.3's `package:segment:tier` convention. Slugs are the approved final URL segment and are unique **within their segment namespace**. The six IDs and six complete candidate paths are globally unique; repeating `basic` across two segments is intentional. Do not invent flattened slugs or silently rename M4.1/M4.2 paths. Optional package `routeId` remains omitted until a concrete route registry is implemented. The paths above are documentation, not implemented pages or public links.

## Enterprise and independent commercial categories

| Category | Current data | Existing contract / future population rule |
| --- | --- | --- |
| Tier packages | Six draft records | `PackageCatalog` / `PackageFor`; exactly Basic, Standard, Premium per segment |
| Enterprise | One draft `enterpriseOffering`, named Build Your Growth Stack | `EnterpriseOffering`; `segment: enterprise`, `scoping: consultation-led`, `pricing.state: custom-quote`, no tier |
| Individual service plans | `individualServicePlans` is TBF; zero approved selections | `Decision<readonly ServiceId[]>`; reference canonical `Service` records and their commercial terms, with approved individual engagement mode |
| One-time projects | `oneTimeProjects` is TBF; zero records populated | `Decision<readonly OneTimeProject[]>`; separate offering identities and approved canonical service references |
| Add-ons | `addOns` is TBF; zero records populated | `Decision<readonly AddOn[]>`; separate scope/pricing/availability and explicit approved compatibility |

The sources approve these categories but supply no independent service plan names/IDs, project catalog or add-on catalog. Therefore no speculative records are created. TBF is not approved absence, an approved empty catalog, free service or universal compatibility. Branch on `state` before accessing `value`.

An individual plan uses a real `ServiceId` and that service's existing commercial contract; it is not another package tier or a duplicate commercial record. The current M4.4 collection has zero individual services and unresolved engagement modes, so no service can yet be asserted to support an individual plan. If separately named/multiple plans per service are later requested, obtain an approved specification and explicitly reviewed contract change before populating them; no such model is assumed here.

Enterprise has `routeId: route:enterprise` because the existing contract requires that architecture reference. It does not create a route or prove publication. Service options and every scope field remain TBF. The existing private `EnterpriseSelection` contract permits guidance without selected services and preserves requirements for consultation/custom proposal; no fixed tier, automatic quote engine or budget bands are added.

## Commercial TBF fields and costs

Every package is draft with TBF availability, positioning, target customer, objective, FAQs and CTA. `commercial.pricing`, `billingBasis` and `setupFee` each remain `{ state: "tbf" }`. No amount, currency, cadence or zero-price/default-fee interpretation is supplied.

Every package and Enterprise scope retains explicit TBF for deliverables, limits, inclusions, exclusions, timeline, reporting, support, client responsibilities and terms. No deliverable identities, measurable quantities/frequencies, commitments, guarantees, timelines, SLAs or exclusions are invented. TBF arrays are not replaced with approved empty arrays, and an unknown limit never means unlimited. Enterprise's `custom-quote` state is the approved consultation model, not a numeric price or finalized scope.

All six packages and Enterprise reuse the exact frozen `serviceExternalCosts` baseline from `lib/data/services.ts`, accounting for advertising/media spend, third-party tools, hosting, premium assets, production and other external costs. Every treatment is explicitly separate; no amount or provider is supplied. Reuse preserves one baseline source without duplicating commercial values. A future offer-specific inclusion must provide explicit approved scope and approval reference in that offer's typed external-cost record; it must not modify the baseline for every other offer.

Service/management fees, advertising spend and external costs remain distinct in future comparisons, enquiries and proposals. Serving Ecommerce clients does not introduce checkout or purchasing into this website.

## Relationships and enquiry selection

| Relationship | Current state | Rule |
| --- | --- | --- |
| Package ↔ service | `packageServiceRelationships` is TBF | Existing `PackageServiceRelationship`; included, excluded and related variants are distinct; included scope requires approval |
| Package ↔ industry | Re-export of the existing TBF `industryPackageRelationships` | One M4.5 source; derive reverse package views, never copy recommendations |
| Package → deliverables / limits | Every scope field TBF | Existing `OfferScope` / `Deliverable` / `ScopeLimit`; populate only verified quantities and terms |
| Package/service ↔ add-on | `addOnCompatibility` is TBF | Existing `AddOnCompatibility`; explicit IDs and approval per compatible pair |
| Enterprise → selectable services | `serviceOptions` is TBF | Existing `Decision<readonly ServiceId[]>`; family IDs are not service IDs |
| Offer → enquiry | Contracts preserved; concrete CTAs TBF | Existing `PackageSelection`, `SelectionContext` and enquiry intents; no fabricated live controls |

A family association must not include every child service. An industry recommendation must not imply package inclusion. No service, industry or add-on mapping is populated. Future validation must check IDs against canonical sources, relationship uniqueness, published availability and approved compatibility.

Selecting a package later carries its canonical ID with the matching segment/tier through the existing correlated `PackageSelection` contract to `/proposal`. Consultation remains available for undecided visitors. Enterprise retains custom consultation/proposal context; individual services and one-time projects need no recurring package. Add-ons update enquiry interest only. Selection never creates a purchase, contract, confirmed appointment or successful submission.

Public context contains reference IDs only; contact details, messages and budgets belong to future trusted server handling. The canonical catalog exposes exact segment/tier slots for constructing typed selections; no parallel selection list or private enquiry fixture is populated. All public eligibility and input validation remains part of the later route/lead implementation.

## Lookup behavior

- `getPackageById(id)`: exact canonical package lookup, or `undefined`.
- `getPackageBySlug(segment, slug)`: exact segment-scoped lookup; a slug alone is ambiguous.
- `getPackagesBySegment(segment)`: immutable ordered derived view; unknown or Enterprise segment returns an empty view of tier packages.

These helpers are pure and include drafts for architectural/editorial use. They perform no alias coercion, default-tier selection, publication approval or server-side enquiry validation. An empty derived view means no tier records matched; it does not resolve the independent TBF offer categories.

## Publication gates and future content requirements

All **six packages and one Enterprise offering** remain draft/unpublished. No pages, metadata, indexable URLs, navigation entries or forms are implemented. Availability is independent of the approved structural identity and remains TBF.

Before public offer pages/selections:

1. Approve distinct positioning, suitability, objective, FAQs where appropriate and launch availability; shared tier names do not establish a commercial progression.
2. Approve actual services/engagement modes and each package's scope, deliverables, measurable quantities, limits, inclusions, exclusions and compatible add-ons independently.
3. Resolve pricing treatment, currency/amount if applicable, billing basis, setup fee, external-cost inclusions if any, timing, reporting/support, responsibilities and terms. Any public TBF/custom treatment or omission must be deliberately approved; never silently borrow another tier's values.
4. Approve package-industry suitability and service/add-on relationships, preserving canonical identifiers and valid published targets.
5. Implement functioning enquiry/proposal/consultation destinations and safe contextual selection validation without checkout.
6. Satisfy M4.2's publication gate: approved content, verified commercial relationships/data, truthful SEO with verified origin and explicit indexability, and functioning behavior. Supply required unique page/SEO content in the future route source; resolve or omit launch-facing placeholders before publication.
7. Review rendered responsive/accessibility behavior, comparison consistency, navigation and applicable operational QA before publishing. Record real approval references and publication timestamps only then.

Pending inputs are commercial/content approvals, actual service/project/add-on inventories, valid relationships, launch readiness, origin/metadata and enquiry operations. They do not block the draft foundation. There is no identified domain or route blocker and no contract change is required. Historical Step 0/M3 status wording and M4.3's proposed substep table remain unchanged; current user-authorized M4.6 scope governs this implementation.

## Integrity and validation

```sh
node lib/data/packages.test.mjs
node lib/data/services.test.mjs
node lib/data/industries.test.mjs
pnpm exec tsc --noEmit
pnpm lint
pnpm build
git diff --check
git status --short
```

Eight focused package tests compare exact tier counts/names with requirements, verify the six paths against both M4.1 and M4.2, canonical catalog/view identity, globally unique IDs, segment-scoped slug uniqueness and lookup rejection. They check TBF pricing/scope/content, Enterprise custom selection structure, unresolved separate categories/relationships, reuse of the existing separate-cost source, draft publication gates, exact permitted fields, deep immutability and JSON serialization. Only trusted allowlisted local modules are transpiled in memory; no files are emitted or framework installed.

Type compatibility is enforced by the exact `PackageCatalog` literal, generic `PackageFor` constructor, typed relationships/category decisions and `EnterpriseOffering` check, plus unchanged M4.3 compile-only contracts under `tsc --noEmit`. The services and industry suites provide regression coverage. New-file whitespace and pre/post source hashes are reviewed because ordinary Git diff excludes untracked work; generated build/cache output is not hand-edited.

Passing these checks confirms the data foundation, not commercial approval, published pages, rendered QA, working lead delivery or operational launch.
