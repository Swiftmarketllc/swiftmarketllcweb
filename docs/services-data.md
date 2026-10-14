# Swift Market LLC — Centralized Services Data

M4.4 populates the approved service-family taxonomy using the existing M4.3 contracts. Authority: [MVP requirements v3.0](mvp-requirements-v3.0.md), [AGENTS.md](../AGENTS.md), [information architecture](information-architecture.md), [route architecture](route-architecture.md), and [domain models](domain-models.md).

Only the new data module, focused tests and this document are created. Existing M4.1/M4.2/M4.3 files, M3 app files, configuration, dependencies and lockfile are preserved. No domain contract change is necessary.

## Files and use

- [lib/data/services.ts](../lib/data/services.ts) exports serviceFamilies, services, serviceExternalCosts and four pure lookup/filter helpers.
- [lib/data/services.test.mjs](../lib/data/services.test.mjs) uses Node's built-in tests/assertions and the existing TypeScript transpiler in memory. No framework, dependency, config, package script or generated test output is added.
- This document records inventory, mappings, unresolved content and future population rules.

Import data from @/lib/data/services. The module imports only public domain types; those imports erase at runtime. It contains no enquiry/contact/lead data, credentials, environment access, provider, network or persistence code. Records are plain serializable objects; frozen data can safely be read on the server without mutating shared state. Draft data still must not become public page content by default.

Relevant installed Next.js 16 guidance was reviewed under node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md: keep server/client boundaries narrow and client props serializable. No framework routing/rendering API is introduced in M4.4.

## Source inventory and individual-service decision

Requirements Section 5 explicitly approves **22 service families**, not a separate child-service catalog. M4.1 Section 9 supplies the corresponding 22 family slugs; M4.3 correlates family IDs with those slugs.

The inspected sources establish no independently approved individual-service identities with confirmed family assignments. Therefore **individual-service records: 0**. Empty services means no records have been populated, not an approved conclusion that no individual services exist or are offered.

Do not split combined family labels into invented child services. SEO, Local SEO, AI Search, Website Care, CRO and other named capabilities are already approved families; a family name alone does not approve a duplicate individual-service identity. Google, Meta, TikTok, YouTube, Snapchat, Spotify and other example channels do not establish approved child services, providers, credentials or package inclusions. Any future child classification needs an explicit source reference and distinct scope/intent.

No unresolved classification has been guessed. Required input is an approved individual-service catalog: names, parent family, stable identity, scope, availability, allowed engagement modes and source/approval evidence. Publication content and exact commercial details can remain TBF until approved.

## Canonical family inventory

Each row has exactly one ServiceFamily record. IDs retain the M4.3 family:slug convention; names match requirements exactly; slugs match M4.1/M4.2. Candidate paths below are documentation of that architecture, **not implemented routes, route registry entries or public links**. All records are draft with TBF availability.

| Approved family name | Canonical ID | Slug | Conditional detail candidate | Populated children |
| --- | --- | --- | --- | --- |
| Strategy & Consulting | family:strategy-consulting | strategy-consulting | /services/strategy-consulting | 0 |
| SEO | family:seo | seo | /services/seo | 0 |
| Local SEO | family:local-seo | local-seo | /services/local-seo | 0 |
| AI Search Visibility | family:ai-search-visibility | ai-search-visibility | /services/ai-search-visibility | 0 |
| Authority & PR | family:authority-pr | authority-pr | /services/authority-pr | 0 |
| Paid Advertising | family:paid-advertising | paid-advertising | /services/paid-advertising | 0 |
| Specialist Campaigns | family:specialist-campaigns | specialist-campaigns | /services/specialist-campaigns | 0 |
| Social Media | family:social-media | social-media | /services/social-media | 0 |
| Content Marketing | family:content-marketing | content-marketing | /services/content-marketing | 0 |
| Branding & Design | family:branding-design | branding-design | /services/branding-design | 0 |
| Photo & Video | family:photo-video | photo-video | /services/photo-video | 0 |
| Website Development | family:website-development | website-development | /services/website-development | 0 |
| App / MVP Development | family:app-mvp-development | app-mvp-development | /services/app-mvp-development | 0 |
| Website Care | family:website-care | website-care | /services/website-care | 0 |
| Conversion Optimization | family:conversion-optimization | cro | /services/conversion-optimization | 0 |
| Email & SMS | family:email-sms | email-sms | /services/email-sms | 0 |
| CRM & Automation | family:crm-automation | crm-automation | /services/crm-automation | 0 |
| AI & Automation | family:ai-automation | ai-automation | /services/ai-automation | 0 |
| B2B Marketing | family:b2b-marketing | b2b-marketing | /services/b2b-marketing | 0 |
| Analytics & Tracking | family:analytics-tracking | analytics-tracking | /services/analytics-tracking | 0 |
| Business Technology & Integrations | family:business-technology-integrations | business-technology-integrations | /services/business-technology-integrations | 0 |
| Enterprise Leadership | family:enterprise-leadership | enterprise-leadership | /services/enterprise-leadership | 0 |

The keyed source satisfies a mapped type covering every ServiceFamilySlug, with each ID/slug pair correlated to its key. A single ordered serviceFamilies view references those same canonical records; there is no second copy of the inventory. Display names do not automatically change IDs or slugs. Future renames follow the reviewed M4.2 migration process.

## Draft/TBF inventory and publication

All 22 families use publication.status = draft and availability = tbf. Target segments remain TBF rather than assuming every family is available in every segment.

Every family content field remains TBF: short/full descriptions, category, problems, process, intended outcomes, FAQs and CTA. Scope remains TBF for deliverables, limits, inclusions, exclusions, timeline, reporting, support, client responsibilities and terms. Shared immutable TBF leaves avoid repetitive invented content; approvals later replace a field with a new explicit value, never mutate the shared leaf.

No record has a routeId, published timestamp, approval reference, SEO title, description, keywords, indexing flag, testimonial, metric, price or quantity. The ServiceFamily contract keeps SEO/indexing in the separate future RouteDefinition, so no incompatible metadata field is added. There are **0 published records and 0 approved public/indexable destinations** in this data module.

Do not use the draft directory as a live menu, sitemap, public Enterprise selector or launch service listing. Future publication needs approved unique content, verified availability, distinct route intent, content ownership, metadata/origin and relevant conversion behavior. Service hubs may summarize families without requiring all 22 detail routes, as M4.1/M4.2 specify.

## Commercial cost separation

ServiceFamily owns scope rather than a priced offer. No fake commercial block is added to its contract. serviceExternalCosts uses the existing ExternalCosts type to record the approved baseline across six categories:

- Advertising/media spend.
- Third-party tools/software/platform costs.
- Hosting.
- Premium assets.
- Production.
- Other external costs.

Each is explicitly separate. No amount, currency, cadence, setup fee, quantity or external vendor is supplied. This is the general baseline, not a priced service offer, compatibility matrix or claim that a particular external cost applies to every engagement. A future approved inclusion must be explicitly recorded with scope and approval in the actual Service/Package/Project/AddOn/Enterprise commercial record; nothing automatically becomes included.

Service fees, advertising budgets and external costs must remain distinguishable in future pages/comparisons and enquiries. Unknown amounts are TBF/custom, never zero, free or unlimited. No checkout, payment, cart, subscription purchase or automatic contract is introduced.

## Relationships and enquiry coverage

| Relationship/capability | Current data coverage | Future source / rule |
| --- | --- | --- |
| Family → service | All 22 family identities; no child records yet | Every child references an existing family; meaningful approved scope and source |
| Service ↔ industry | No populated associations | Existing IndustryServiceRelationship source; derive reverse links, no guessed all-to-all mappings |
| Service → package | No inclusions/exclusions populated | Existing PackageServiceRelationship; included scope requires explicit approval |
| Enterprise selection | Family identities ready; no selectable ServiceId records | Existing EnterpriseOffering.serviceOptions stays an approved/TBF decision; no family ID masquerading as ServiceId |
| Individual enquiry | Supported by existing domain and future ServiceId | Family context may guide consultation; individual-service intent needs a real service ID |
| One-time project enquiry | Domain capability preserved; no offerings/mode assignments invented | Approve service engagement modes/project references; project brief can request scoping without a fixed project |
| Add-ons | No records or compatibility assumed | Existing AddOn plus AddOnCompatibility; a service is not automatically an add-on |
| Related services | No invented peers | Populate Service.relatedServiceIds only from approved relationships |
| Family/individual routes | M4.1 candidate slugs; no route IDs instantiated | Future route registry and publication gates; selective child pages only |

These empty mappings are unresolved population, not approved statements that services cannot relate to those offers/industries. M4.3 types remain the sole relationship contracts; no parallel schema or placeholder associations are created.

Conversions remain enquiry/proposal-first. M4.1 defines family guidance through consultation; defined individual/project/package scope can go to proposal or a project brief. Family CTA content stays TBF here rather than claiming a working destination. Future CTA context uses familyId or actual service IDs from the canonical source, never personal contact/message/budget data. Enterprise stays custom and consultation-led; Startup/Growing retain their existing three-tier contracts unchanged.

## Helpers

| Helper | Behavior |
| --- | --- |
| getServiceFamilyById(id) | Exact canonical family ID lookup; unknown returns undefined |
| getServiceFamilyBySlug(slug) | Exact slug lookup; no case folding, aliases or trailing-slash coercion |
| getServiceById(id) | Canonical individual-service lookup; currently undefined for all IDs |
| getServicesByFamily(familyId) | Filters the canonical service collection by parent; currently empty |

Helpers are deterministic and preserve approved order. They do not mutate, publish, infer availability, approve selections, supply fallback records, generate routes, validate a form or invent relationships. Inventory arrays, family records and their shared nested draft fields are frozen. A filtered result is a fresh array; modifying it cannot change the canonical collection.

Exact lookup is not server-side input validation. Future public inputs need type/length checks, availability/publication checks, valid relationships and compatible approved options. Readonly types and syntax-valid IDs alone cannot establish operational eligibility.

## Future population rules

1. Use the canonical family source; add no duplicate family records or synonym routes. Taxonomy changes require an approved requirements/model revision.
2. Add a child only when an approved source establishes its identity and parent. Keep stable service: IDs distinct from family: IDs and display names.
3. Validate IDs globally and service slugs within their family URL namespace. A repeated slug in a different family is not automatically the same content, but duplicate intent still needs review.
4. Record missing field values explicitly as TBF/custom where the domain allows. Do not fill unknowns with empty approved arrays, fabricated summaries, numbers, guarantees or policies.
5. Do not infer package inclusion from a family association or an industry relationship; use shared typed relationship records and approved scope.
6. Keep selectable Enterprise services and individual/project/add-on eligibility tied to real approved ServiceId records. Guidance without a known service stays available through the approved enquiry model.
7. Build SEO metadata, resolved route IDs, navigation and sitemap only in the authorized architecture/publication milestone. A candidate slug is not a publishable page.
8. Validate source facts, uniqueness, parents, engagement modes, compatibility, visibility, cost separation and publication prerequisites before rendering or accepting selections.
9. Preserve current family order unless a separately approved presentation requires a derived view. Never silently rewrite canonical IDs/slugs.
10. Update the focused integrity tests when explicitly approved inventory/publication changes occur; do not weaken checks merely to accommodate accidental fabricated data.

## Tests and validation

Run the focused suite without installing a framework:

```sh
node lib/data/services.test.mjs
```

Six tests compare names directly with requirements Section 5 and slugs with M4.1 Section 9; verify exact count, unique correlated IDs/slugs, lookup behavior, draft/TBF fields, absent SEO/commercial values, baseline cost separation, serialization and immutability. Service-parent/ID/namespace assertions are included; with zero children they verify the intentionally unpopulated state and are not evidence of completed service mappings.

The suite transpiles only the trusted services module using installed TypeScript in memory. Type-only imports erase; no test files are emitted and no production module imports tests. It uses built-in node:test/node:assert, following M4.3's dependency-free in-memory verification approach.

Required repository checks: pnpm exec tsc --noEmit (including existing M4.3 type contracts), pnpm lint, pnpm build, git diff --check and git status --short. Also review new-file whitespace/encoding and pre/post hashes to verify preservation. Build/cache artifacts are generated by tooling; they are not source changes.

Passing these checks does not establish rendered QA, service availability, publication readiness, lead receipt, production SEO or operational launch.

## Risks and conflicts

No business/model/route conflict was found and no domain model change was required. M4.3's proposed remaining substep mapping is planning only; the current user-authorized M4.4 services-data scope takes precedence without editing that earlier document.

The main unresolved input is the approved child-service catalog and its mappings. Family-level approval does not supply child identities, descriptions, SEO content, commercial scope or launch availability. Draft states intentionally preserve these gaps. Later content approval is required before public service discovery/selection; the taxonomy alone is not an operational service catalog.
