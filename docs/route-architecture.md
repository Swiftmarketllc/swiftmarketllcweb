# Swift Market LLC — Production Route Architecture

**M4.2 proposal: documentation only.** No production route, data model, integration, configuration, or policy is implemented by this document.

## 1. Purpose and authority

Translate [M4.1 information architecture](information-architecture.md) into an implementable Next.js App Router blueprint. Product authority remains [MVP Requirements v3.0](mvp-requirements-v3.0.md); engineering authority remains [AGENTS.md](../AGENTS.md). Refer to [README](../README.md) and [QA checklist](qa-checklist.md) for setup and verification.

The frozen foundation is `baf5213` (`chore: freeze approved pre-M4 foundation`). M4.1 is uncommitted and must remain unchanged. Historical Step 0 status wording in governing documents is a checkpoint snapshot; the user confirms that foundation is frozen. Current application files are the M3 preview, root layout, CSS, custom 404, and starter favicon. Planned routes below are not evidence of live functionality.

Approved business model: U.S.-market digital growth, marketing, creative, web, app, AI/automation, and technology services; light-mode brand foundation; enquiry/proposal-first conversion. Retain all 22 service families, exactly Basic / Standard / Premium for Startup Business and Growing Business, and custom consultation-led Enterprise. Individual services, one-time projects, add-ons, and agency partnership enquiries remain supported. Ad/media spend and external software/tool/platform costs are separate unless explicitly included. Missing prices, quantities, scope limits, fees, timelines, commitments, and policies remain TBF.

## 2. Routing principles

A public route requires distinct user intent, sufficient unique approved content, a meaningful conversion purpose, and maintainable ownership. A keyword alone never justifies a page.

Use one canonical URL per content identity. Separate hierarchy from related-content relationships and engagement modes. Prefer a single shared shell, reusable templates, and centralized records. Navigation exposes only published destinations. Package/service selections carry enquiry context; there are no checkout, cart, payment, subscription-purchase, account, or admin routes in this proposal.

## 3. Next.js 16 assumptions verified from installed documentation

The installed package is Next.js 16.3.8. Sources consulted under `node_modules/next/dist/docs/`:

| Installed document | Verified convention and architectural consequence |
| --- | --- |
| `01-app/01-getting-started/02-project-structure.md` | Folders define segments; a page exposes UI and a route file exposes a request handler. A directory alone is not a public page. |
| `01-app/03-api-reference/03-file-conventions/page.md` | Pages are Server Components by default. Page params and searchParams are promises; use current async access. Reading searchParams introduces request-time rendering considerations. |
| `01-app/03-api-reference/03-file-conventions/dynamic-routes.md` | Single dynamic segments use brackets. Validate resolved parameters against actual records; generated route types do not validate arbitrary incoming slugs. |
| `01-app/03-api-reference/03-file-conventions/route-groups.md` | Parentheses organize files without changing URLs. Groups cannot resolve to conflicting paths; multiple root layouts cause full navigations between roots. No groups are justified here yet. |
| `01-app/03-api-reference/04-functions/generate-static-params.md` | Known dynamic-segment paths can be generated at build time. The function is not rerun during ISR; unknown-parameter behavior needs an explicit implementation decision. |
| `01-app/03-api-reference/03-file-conventions/loading.md` | loading creates a Suspense boundary for streamed segment content. Add only where real loading warrants useful feedback. |
| `01-app/03-api-reference/03-file-conventions/error.md` | Segment error boundaries are Client Components; installed examples use the recovery prop `retry`. Do not copy older reset-based examples without checking the installed version. |
| `01-app/03-api-reference/03-file-conventions/not-found.md` | Segment not-found handles missing records. Streamed not-found responses can have HTTP 200; non-streamed responses return 404. Global not-found is experimental and unnecessary for the current single-root structure. |
| `01-app/03-api-reference/03-file-conventions/route.md` | Route Handlers use Web Request/Response APIs. A lead-processing endpoint is an operational interface, not a public marketing page. |
| `01-app/03-api-reference/04-functions/generate-metadata.md` | Static metadata or generateMetadata belongs to Server Components; do not export both in one segment. Nested metadata is shallowly merged. Relative URL metadata needs an appropriate metadataBase. |
| `01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.md` | app/sitemap.ts can generate URLs. This metadata handler is cached by default unless request-time APIs or dynamic configuration change that behavior. |
| `01-app/03-api-reference/03-file-conventions/01-metadata/robots.md` | app/robots.ts can generate crawler rules; the same documented caching qualification applies. |
| `01-app/03-api-reference/05-config/01-next-config-js/trailingSlash.md` | Default behavior redirects trailing-slash URLs to their non-slash form. Retain that policy, with root / and framework/file exceptions. |
| `01-app/03-api-reference/05-config/01-next-config-js/redirects.md` | Config redirects support permanent 308 and temporary 307, preserving request methods. Redirects require a reviewed mapping. |

These are verified conventions, not implemented changes. No Pages Router, synchronous parameter access, blanket caching assumption, Cache Components configuration, static export, Proxy, parallel routes, intercepting routes, or catch-all router is assumed. Recheck relevant installed guidance when implementation begins.

## 4. Public route taxonomy

| Family | Canonical namespace | Role |
| --- | --- | --- |
| Brand/company | /, /about | Positioning and verified company context |
| Capabilities | /services | Hub, approved family details, selective individual services |
| Recurring packages | /packages | Segment evaluation, six tier records, comparison |
| Enterprise | /enterprise | Custom Build Your Growth Stack and consultation |
| Industry relevance | /industries | Hub and selected substantive sector details |
| Partnerships | /partnerships | Agency/strategic partnership discussion |
| Conversion | /consultation, /proposal, /contact | Different entry intents sharing one enquiry model |
| Projects/add-ons | /projects, /add-ons, if justified | Optional discovery; normally referenced within solution pages |
| Proof/resources | /case-studies, /insights, if approved | Verified work and approved educational content |
| Legal | /privacy; conditional /terms, /cookies | Approved factual disclosures |
| Utility | Optional /thank-you | Verified receipt acknowledgement; no search target |

Plans maps to Packages, Blog to Insights, and Portfolio to Case Studies. These alternate labels do not create additional URL trees.

## 5. MVP route tree

The following is the **20 fixed core routes** proposed by M4.1, not the current application route inventory:

```text
/
├── about
├── services
├── packages
│   ├── startup
│   │   ├── basic
│   │   ├── standard
│   │   └── premium
│   ├── growing-business
│   │   ├── basic
│   │   ├── standard
│   │   └── premium
│   └── compare
├── enterprise
├── industries
├── partnerships
├── consultation
├── request-proposal
├── contact
└── privacy
```

Selected service-family and industry detail routes are additional content-dependent launch inventory. Conditional classification does not waive service/industry discovery or useful launch detail content. Count remains 20 + published family details + published industry details + published individual-service details + other approved conditional pages; no final total is invented.

## 6. Future route tree

Retain the fixed tree and extend only from approved records:

```text
/services/{family-slug}/{service-slug}     conditional distinct service detail
/industries/{industry-slug}               conditional sector detail
/projects                                conditional project-discovery hub
/add-ons                                 conditional compatible-addition hub
/case-studies
  /{case-slug}                            conditional verified proof
/insights
  /{article-slug}                         conditional article/guide content
  /topics/{topic-slug}                    Future: useful topic collection
/digital-audit                           conditional approved offer
/terms                                   conditional legal content
/cookies                                 conditional legal/tracking content
/thank-you                               optional receipt utility
```

Service-family URLs are /services/{family-slug}. Section 38 enumerates their 22 candidates and the 11 M4.1 industry candidates. Braces and brackets express patterns, never literal public URLs. No localization, city matrix, careers, team directory, search, newsletter, or customer portal is added by this tree.

## 7. Conditional/TBF routes

Conditional means a route cannot be published until its content, offer, legal need, and operational purpose are verified as applicable. It is not a draft URL to show in menus or sitemap. Future means deferred expansion.

Select launch families/industries during content planning; retain every approved family identity in the data architecture. Project/add-on discovery can be embedded. Proof requires verified supplied evidence and permission; resources require approved content. Audit scope/cost/eligibility and receiving workflow are unresolved, so no free-audit claim is approved. Legal variants depend on actual practices. Optional acknowledgement depends on verified receipt. Section 38 is the conditional manifest; Section 37 is the future manifest.

## 8. Exact proposed URL conventions

| Concern | Convention |
| --- | --- |
| Case/characters | Lowercase ASCII path slugs; words separated by one hyphen. No underscores, spaces, display-name punctuation, or accidental encoded variants. |
| Singular/plural | Plural collections: services, packages, industries, insights, case-studies, projects, add-ons. Singular purpose destinations: enterprise, consultation, contact, privacy. Keep about, partnerships, request-proposal, and approved fixed paths as specified. |
| Tiers/segments | startup and growing-business; only basic, standard, premium below each. No enterprise tier hierarchy. |
| Slash | No trailing slash except root /. Retain Next default and honor framework/file exceptions. |
| Stable identity | Immutable record ID separate from stable slug; changing a label must not automatically change its URL. |
| Canonical | One approved production origin plus the manifest path, without tracking/selection query or fragment. Origin remains TBF; no guessed domain or request-host-derived canonical. |
| Rename | Review slug change, map old to new when truly equivalent, update internal links/sitemap/metadata, verify one-hop redirect. |
| Deprecation | Remove from navigation/sitemap; redirect only to a meaningful replacement. Otherwise retain truthful unavailable content if appropriate or use not-found; no blanket home redirect. |
| Query | Optional non-sensitive context/filter/tracking; allowlist keys and validate values. Queries do not create new route identities. Parameter variants must not produce crawlable duplicate collections. |
| Fragment | Section navigation only, stable accessible IDs such as #basic within a segment hub. Never a separate page, sitemap entry, or canonical identity. |
| Reserved paths | Protect fixed children such as packages/compare and insights/topics from dynamic-record collisions. Block system/private/framework names and duplicate normalized slugs. |

Do not add alias routes merely to enforce conventions. Case/legacy normalization, if needed later, belongs to explicit redirect governance, not a new catch-all route.

## 9. Future App Router filesystem blueprint

**Proposal only: no files in this tree are created by M4.2.** Existing foundation stays intact until an authorized milestone changes it.

```text
app/
  layout.tsx                     existing root; future shared site shell
  globals.css                    existing M3 foundation
  page.tsx                       existing preview; production home in M5
  not-found.tsx                  preserve current accessible foundation
  favicon.ico                    existing starter; branding decision later
  error.tsx                      future segment fallback if warranted
  global-error.tsx               only if root-layout failure recovery warrants it
  sitemap.ts                     M9 published canonical inventory
  robots.ts                      M9 approved environment-aware crawler rules
  about/page.tsx
  services/
    page.tsx
    [familySlug]/
      page.tsx
      [serviceSlug]/page.tsx      conditional unique service
  packages/
    page.tsx
    compare/page.tsx
    startup/
      page.tsx
      [tier]/page.tsx             basic | standard | premium only
    growing-business/
      page.tsx
      [tier]/page.tsx             basic | standard | premium only
  enterprise/page.tsx
  industries/
    page.tsx
    [industrySlug]/page.tsx
  partnerships/page.tsx
  consultation/page.tsx
  proposal/page.tsx
  contact/page.tsx
  privacy/page.tsx
  projects/page.tsx               conditional
  add-ons/page.tsx                conditional
  case-studies/
    page.tsx                     conditional
    [slug]/page.tsx               conditional
  insights/
    page.tsx                     conditional
    [slug]/page.tsx               conditional article/guide
    topics/[topicSlug]/page.tsx   Future; no topics index implied
  digital-audit/page.tsx          conditional
  terms/page.tsx                  conditional
  cookies/page.tsx                conditional
  thank-you/page.tsx              optional
```

Root layout continues to own html/body, language, global CSS, skip link, and later shared navigation/footer. Pages/fallbacks provide exactly one main landmark with the current main-content target. Do not wrap page-owned main elements in a second main.

Use segment layouts only for genuinely shared persistent UI; nested path hierarchy alone does not require them. Keep the two explicit package-segment folders; avoid a generic segment parameter that could swallow compare or future fixed destinations. Shared tier rendering can live in a reusable component without duplicating six templates.

Add loading.tsx only at a segment that performs meaningful asynchronous work, with stable lightweight accessible feedback. Evaluate not-found status before streaming where feasible. Error boundaries are small client islands with retry and safe messaging; same-segment layout failures require a parent boundary, and root-layout recovery may require global-error with its own html/body. Preserve the simple single root; no route groups, experimental global-not-found, or extra layout trees are justified.

Future components and typed data live outside public routing, e.g. components/ and lib/ with exact M4.3 organization chosen then. No lead endpoint filename is prescribed: choose a Server Action or dedicated Route Handler after M8 threat/hosting/provider decisions, without a handler competing with a page at the same public path.

## 10. Static versus dynamic route strategy

A dynamic URL segment does not imply request-time rendering.

| Family | Intended approach | Publication/runtime gate |
| --- | --- | --- |
| Home/about/partnerships/legal | Static Server Component pages from approved local content | Legal/company facts approved; rebuild on content change |
| Service hub/families/individual services | Static hub; build-generated known published slug records | Resolve publication and parent relationship; unknown/draft slugs not-found |
| Package hubs/compare/six tiers | Static pages and generated allowlisted tiers using shared records | Exactly six records; approved distinct tier content |
| Enterprise | Static explanatory content plus limited interactive selection/enquiry island if justified | Service selections remain non-binding |
| Industries | Static hub and generated published sector records | Unique sector content and valid relationships |
| Projects/add-ons | Static if approved hubs justify separate pages | Otherwise embedded solution content |
| Proof/resources/topics | Generate published records from approved content initially | CMS, fetching, revalidation and pagination require later decisions |
| Consultation/proposal/contact | Static informative shells where possible; client context can prefill validated IDs | Submission is server-side operational work; server use of searchParams may change rendering |
| Optional thank-you | Noindex utility; authoritative receipt state separate from the URL | Do not expose personal data or infer successful submission from navigation |
| Sitemap/robots | Generated metadata handlers using approved origin and publication state | Environment rules/revalidation designed in M9 |

Prefer approved repository data initially; no CMS or remote API is selected. Generate known paths with generateStaticParams where appropriate and validate records on lookup. Decide closed-set dynamicParams behavior against installed guidance during implementation; generation alone must not accidentally expose drafts. Cache invalidation/ISR choices follow real data sources, not older assumed defaults. Personalized enquiry results must never enter shared caches.

## 11. Service routing model

/services is the capability directory. /services/[familySlug] owns family-level intent. /services/[familySlug]/[serviceSlug] is permitted only for a distinct approved individual service with enough content; resolve both IDs and verify that the child belongs to the requested parent.

Preserve the exact 22 approved names and proposed M4.1 slugs listed in Section 38. Overlapping families need editorial boundaries: broad PPC versus platform-specific advertising, CRM/marketing automation versus AI & Automation, and AI Search versus general SEO must have differentiated content. A platform service can be a selective child rather than another duplicate family.

Link each published family to verified services, appropriate industries, compatible package scope, custom Enterprise, and consultation. An individual service points to proposal with its validated reference. Relationship links never imply that an unapproved service is included in a package.

## 12. Package routing model

Retain M4.1's two segment hubs and **six individual tier routes**, plus /packages and /packages/compare. Startup Business has exactly Basic, Standard, Premium; Growing Business has exactly Basic, Standard, Premium. Enterprise remains outside that hierarchy as custom.

/packages explains engagement choices; segment hubs summarize the three tiers; each tier detail answers that segment/tier's scope-evaluation intent. Compare reads the same six records. Hub anchors such as #basic may aid browsing but do not replace the six canonicals or create additional indexable pages.

This choice preserves approved M4.1 navigation/count, enables direct links and context-preserving enquiries, and keeps maintenance controlled through two allowlisted dynamic segments and one shared tier presentation. Six URL identities do not mean six handwritten implementations.

Publication requires unique approved scope content; no repetitive thin tier pages or invented numbers to fill a template. If future approved content cannot support separate details, request an explicit M4.1/M4.2 route-consolidation decision; do not silently switch to anchors or change the 20-core count. Prices, quantities, fees, billing/commitment terms and delivery policies remain TBF. Selection goes to /proposal, never checkout.

## 13. Enterprise route architecture

/enterprise is the custom engagement destination, with Build Your Growth Stack / custom service selection and consultation-led scoping. It may reference several approved service IDs, industry context, and project goals without producing a purchasable configuration or automatic quote.

Its primary CTA is /consultation; a defined brief may use /proposal. Do not add /enterprise/basic, /enterprise/standard, /enterprise/premium, configurator result URLs, or cart paths. The Enterprise Leadership family page describes a capability; /enterprise describes the custom engagement journey. Publish both only with clearly different intent and cross-links.

## 14. Individual services/projects architecture

One approved service identity can support recurring, standalone, or one-time work. Use a unique child detail only when warranted; otherwise present the individual offering within the family page and pass the service ID to enquiry.

One-time project enquiries go to /contact for a project brief or /proposal for defined scope. Conditional /projects is an aggregate discovery page only if it contributes distinct approved value; it is not a second copy of website/app/creative services. Do not confuse project offerings with proof: verified completed engagements belong to conditional Case Studies.

## 15. Add-ons architecture

Initially describe approved add-ons in their relevant package/service context. Model add-on IDs and compatibility rules centrally; referencing an add-on does not assert inclusion or universal eligibility.

Conditional /add-ons becomes public only with sufficient distinct discovery content. No individual add-on detail pattern is authorized here. Selection carries compatible approved IDs to proposal; the server later revalidates compatibility. No purchases, instant fulfilment, or assumed prices.

## 16. Industry routing model

/industries is the directory; /industries/[industrySlug] owns substantive sector intent. Preserve M4.1's 11 candidates in Section 38; select the approved launch subset.

Each published page needs sector-specific problems, relevant approved services, appropriate package/custom paths, useful explanatory content, and verified proof only if supplied. Link back to Industries and to published service detail URLs, rather than creating service-by-industry permutations. New sectors require the same publication gate and stable records.

No auto-generated city/sector keyword matrices, interchangeable industry paragraphs, unverified regulated-sector expertise, or duplicate /services/.../industries/... URLs. Ecommerce client support does not authorize website checkout.

## 17. Resources/content route model

Conditional /insights is the single resources hub; /insights/[slug] can hold an approved article or guide using a content-type field. Do not create parallel /blog or /guides hierarchies for identical content. Editorial program, CMS, author/date facts and content inventory remain TBF.

Future /insights/topics/[topicSlug] requires a substantial useful corpus and distinct collection intent. Topic membership can exist as data before any topic URL is published. Tags/categories remain non-indexable filters unless a separate approval establishes useful canonical collections; no additional category/tag patterns are prescribed.

If pagination becomes necessary, recommend an allowlisted positive page query on the hub: page 1 uses the base URL; subsequent genuinely different listing pages have their own canonical URL and valid crawlable previous/next links. Out-of-range/non-integer values must not create infinite spaces. This future pagination exception to query-free canonicals requires content-volume approval; no pagination exists now, and arbitrary filters remain excluded from sitemap/indexing.

## 18. Conversion route architecture

Use one underlying enquiry model with different entry intents: general/project brief, consultation, scoped proposal, package interest, individual service, custom Enterprise, partnership, and optional approved audit. Model entry route/source separately from enquiry type and optional entity references.

Contact uses /contact; consultation uses /consultation; package and defined service/project proposal uses /proposal; Enterprise primarily uses consultation with custom context; partnership uses /contact with partnership context. An approved audit uses /digital-audit and the same lead pipeline. No separate endpoint or duplicated form model per package/service is needed.

Transport allowlisted IDs through optional query state or an accessible form selection, with server validation and graceful recovery if a record is missing/stale. No names, emails, messages, budgets, credentials, or other sensitive data in URLs. Do not accept client-supplied prices or arbitrary return URLs as authoritative. Success means verified receiving-system acceptance according to the eventual design; a click, attempted send, or /thank-you visit is not evidence of receipt.

## 19. CTA destination matrix

| CTA/context | Destination | Allowed non-sensitive context |
| --- | --- | --- |
| Brand/general guidance: Request a Consultation | /consultation | Source route; optional approved service/industry ID |
| Compare Packages | /packages/compare | Optional known segment |
| Explore Startup / Growing packages | /packages/startup or /packages/growing-business | None required |
| Request a Proposal from a tier | /proposal | Package ID resolving segment + one approved tier |
| Defined individual service / add-on | /proposal | Service ID; compatible add-on IDs |
| Send a Project Brief | /contact | Project enquiry type; optional service references |
| Build Your Growth Stack / Enterprise consultation | /consultation | Enterprise intent; selected approved service IDs |
| Discuss a Partnership | /contact | Partnership enquiry type |
| Explore Services / relevant capability | /services or published family/detail | Canonical record path |
| Explore an industry | /industries or published industry detail | Canonical record path |
| Request an Audit | /digital-audit, only if approved | Approved offer ID; no free claim until confirmed |
| Privacy/terms question | /contact | Appropriate general enquiry context; no invented dedicated email |
| Return to homepage after 404/confirmation | / | None |

Conversion-page primary actions submit an enquiry within that page; they do not link recursively to themselves. Exact query key names and form schema belong to later typed/operational work.

## 20. Navigation-to-route mapping

| M4.1 navigation label | Destination | Optional disclosure children |
| --- | --- | --- |
| Brand/Home | / | None |
| Services | /services | Published family references and individual/project guidance |
| Packages | /packages | /packages/startup, /packages/growing-business, /packages/compare |
| Enterprise | /enterprise | None required |
| Industries | /industries | Selected published sector references |
| About | /about | None |
| Request a Consultation | /consultation | Primary action |
| Contact / Partnerships utility | /contact, /partnerships | None |
| Insights / Case Studies conditional | /insights, /case-studies | Only after content is published |

Do not expose all 22 families in an oversized menu merely because records exist. A parent navigation link must work independently of its disclosure control. Navigation organization does not create URLs or extra families.

## 21. Footer-to-route mapping

Company links About, Contact, Partnerships; Solutions links Services, Packages, Enterprise, Industries; conditional Resources links Insights and Case Studies; Legal links Privacy and only applicable approved Terms/Cookies pages. Consultation remains a clear next step.

Resolve the same published route IDs used by the header/content. No invented social profile, office, phone, badge, email, or placeholder destination. No link to internal preview, system fallback, drafts, or an unimplemented future route.

## 22. Breadcrumb route logic

Use manifest parent IDs, not naive URL splitting. Examples: Home → Services → Family → Individual Service; Home → Packages → Startup Business → Basic; Home → Packages → Compare Packages; Home → Industries → Sector. Enterprise, Partnerships, and conversions sit directly below Home.

Insights topic breadcrumbs are Home → Insights → Topic even though the URL contains topics; no /insights/topics page is implied. Current page is text with aria-current, ancestors are working published links, and breadcrumb navigation has an accessible label. Parent chains must terminate without cycles; derive future BreadcrumbList structured data from the same visible hierarchy.

## 23. Internal linking route rules

Resolve links centrally by immutable route/entity ID, render canonical published paths, and omit unresolved/draft references. Descriptive labels should identify destinations and avoid repetitive keyword anchors. Every published detail is reachable from its real hub; ensure no orphan pages.

Use contextual links from service to relevant industry, compatible package, Enterprise, and enquiry, and from sectors to relevant capabilities. A related link is not a second breadcrumb parent. Links to comparison use the shared package data. Validate broken links, reserved path conflicts, anchor targets, and renamed paths in later QA.

## 24. SEO route controls

Use one verified production origin, self-canonical paths for distinct approved pages, and consistent slash/case rules. Query selections/tracking do not enter canonical URLs or sitemap. Keep the M3 home preview noindex until its authorized production replacement has approved metadata.

Recommend index/follow for published core discovery, company, contact and truthful legal pages; noindex/follow for consultation and proposal utility pages, with no sitemap inclusion. Optional receipt/system/error/internal preview pages are noindex and excluded. Drafts should not be publicly exposed; noindex is not access control. Indexing recommendations here are proposed controls, not claims of business-approved legal policy or current metadata.

Sitemap includes only published indexable canonical pages with approved origin. Exclude redirects, missing records, drafts, selection variants and non-page interfaces. Only use verified modification dates, not fresh timestamps that pretend content changed. Future substantive pagination needs the explicit Section 17 decision.

Robots rules guide crawling, not privacy or reliable deindexing. Do not disallow a public URL whose noindex directive needs to be crawled. Preview/staging environments need deliberate non-indexing and appropriate access controls where required. Generated metadata must not fall back to a guessed production host. Structured data in M9 reflects visible verified facts only; no invented reviews, prices, office locations, or certifications.

## 25. Metadata ownership by route level

| Level | Future responsibility |
| --- | --- |
| Root layout | Existing brand title template/description, en-US/light foundation; later verified metadataBase and approved site-level defaults |
| Hub page | Unique hub title/description, canonical, intentional indexing, approved social representation |
| Detail page | Same approved record lookup as page rendering; unique intent, canonical, publication state and factual social metadata |
| Conversion/legal page | Explicit utility/legal title and indexing choice; actual disclosure text, not inherited marketing assumptions |
| System/preview | Explicit noindex where applicable; never marketed as content or included in sitemap |
| Sitemap/robots | Manifest publication/indexability plus approved origin/environment controls |

Use static metadata for fixed facts and generateMetadata where records determine values. Both remain server-owned. Shallow merging means detail openGraph/robots/etc. must deliberately retain needed parent fields; the title template applies to descendants rather than being a reason to duplicate the company suffix. M4.3 defines reusable metadata inputs; M9 verifies rendered tags and truthful structured data.

## 26. 404 behavior

Preserve app/not-found.tsx, its main-content target, heading, explanatory message and working Home link. There is no public /404 or /_not-found marketing route and no sitemap entry.

Unknown, unpublished, invalid tier, or wrong-parent service paths use not-found when implemented. Check existence before streaming where feasible and verify real status/noindex behavior in QA; Next documents 200 for already-streamed not-found responses versus 404 for non-streamed ones. Do not promise every fallback will return 404 regardless of boundary placement. Experimental global-not-found is unnecessary for this single-root foundation.

## 27. Redirect architecture

No redirects are created in M4.2. Maintain a future reviewed mapping with old path, destination route ID, reason, permanence, and approval/history. Use a permanent redirect for a genuine stable rename and temporary redirects only for temporary routing needs. Next config supports 308/307 respectively; do not assume a generic 301 recipe.

Verify one hop, no loops, no open redirects, valid published destination, and appropriate query handling. Update all owned links/canonicals/sitemap rather than leaving redirects as normal navigation. Do not redirect every retired service to Home, invent old aliases that never existed, or use redirects to mask thin duplicate pages.

## 28. Route security considerations

Later form/lead interfaces must validate enquiry type, entity IDs, publication, parent relationships, compatibility, lengths and payload structure server-side. Treat query, hidden fields, client context and return paths as untrusted. Abuse controls, rate-limit persistence, origin/request validation, safe error responses, and payload/log minimization belong to the approved M8 design.

Email/CRM/chatbot/analytics/monitoring providers, receiving addresses, hosting and credentials remain TBF. Secrets stay server-only and never use NEXT_PUBLIC_; real credentials belong in uncommitted environment files or approved hosting secret storage. Public-prefixed variables are browser-visible/build-time exposed. Never put personal data or credentials in route paths, query strings, analytics labels or logs.

Choose Server Actions versus a dedicated Route Handler after integration/runtime constraints are known. No API path, authentication, admin route, CSP/security header, provider, database or persistence layer is introduced here. M9 security/privacy configuration follows actual integrations; robots/noindex cannot protect sensitive data. Enquiry receipt, delivery failure and retries must be auditable without exposing lead content.

## 29. Accessibility implications

Preserve en-US, solid navy headings, existing focus-visible/reduced-motion behavior and skip link. One main landmark per rendered page must accept the skip target; unique H1 and meaningful page title identify the destination.

Use Next Link for internal navigation and native anchors for sections, buttons for disclosures/submission, with no click-only pseudo-links. Mark active navigation with aria-current. Verify focus behavior after navigation, menu closure, validation errors, loading, receipt and 404; do not assume client navigation alone resolves every focus requirement.

Breadcrumbs and menus need labels, keyboard operation and understandable order. Selection context must be editable through accessible form controls without relying solely on a query. Errors and outcomes need perceivable text/status handling, and operation must not depend on animation.

## 30. Performance implications

Favor static generation, shared content records, Server Components and a single root shell. Keep client code limited to necessary menu/form/comparison/selection behavior; do not make the entire page/layout a client component to read enquiry context.

Avoid excessive prefetch across every family/industry combination, duplicate data fetches, heavy menu libraries and speculative loading states. Use published-record lookups consistently for content and metadata. Future images use verified assets, dimensions, responsive sizing and deliberate remote-image configuration only when an actual source is selected.

No performance scores are claimed. Later QA measures representative production routes, navigation, form interactions and errors. Content-source changes require renewed caching/build-cost decisions rather than assuming the initial local-data strategy scales indefinitely.

## 31. Mobile navigation implications

Use the same URLs and published navigation records on every viewport. Present a manageable hierarchy and direct primary consultation action. Preserve independent parent links, touch targets, keyboard access, focus restoration, scroll behavior, long-label wrapping and appropriate menu dismissal.

Review 320, 375, 768, 1024, 1440 and 1920px plus intermediate widths; no device-specific routes or hacks. Comparison must remain understandable through accessible reflow without inventing alternative mobile pages. Breadcrumbs, project briefs and custom Enterprise selection must work without horizontal page overflow.

## 32. Route naming governance

A route addition/change requires a recorded intent, approved content owner, publication gate, parent, canonical path, CTA, indexing choice and milestone. Review collisions and business-model compliance before adding it to data or filesystem.

Renames distinguish presentation-label edits from slug migration. Route families stay limited to the canonical namespaces here. A proposed new keyword, city, sector, tier, engagement mode or alias is not authorization for another page. M4.1/count changes need an explicit documented architecture decision.

## 33. Centralized slug governance

M4.3 should centralize stable IDs, normalized slugs and resolved paths for routes, service families, services, package segments/tiers, industries, add-ons and approved content. Keep entity identity separate from its public route publication status.

Validate uniqueness within namespace, full-path uniqueness, reserved words, allowed tier enums, valid parents, child membership, publication relationships and historic aliases. Navigation, breadcrumbs, CTA context, metadata, sitemap and redirects consume those records; avoid scattered string concatenation in components. Relationship data references IDs rather than copying records. All 22 families exist architecturally even when only a subset has a published detail.

## 34. Proposed route manifest schema

Conceptual fields for future M4.3 typing; this is not TypeScript implementation:

| Field | Purpose / constraint |
| --- | --- |
| id | Stable unique route identity, independent of label and slug |
| entityId / entityType | Optional referenced family/service/package/industry/content identity |
| slug / path | Normalized stable slug and unique resolved canonical-relative path |
| label / routeType | Accessible display label and finite family/type classification |
| scopeClass | MVP fixed, Conditional/TBF, Future, or system utility |
| status | Planned/draft/published/retired; distinguish readiness from architecture class |
| parentId | Single breadcrumb/hierarchy parent; acyclic |
| audience / seoIntent | Distinct user audience and search/evaluation intent |
| primaryCTA | Action label, destination route ID or submit action, allowed context references |
| indexability / sitemapInclusion | Explicit directives and inclusion gate; sitemap requires published indexable canonical page |
| metadata | Approved title/description/social inputs; canonical derives from verified origin + path |
| dataSource / contentOwner | Source reference and accountable approval role; assigned identity TBF |
| template / generationStrategy | Shared rendering template, fixed/generated/request-time approach where justified |
| publicationPrerequisites | Content/offer/legal/operational dependencies |
| relatedEntityIds | Verified contextual links, distinct from the parent tree |
| aliases / redirectHistory | Reviewed migration information, never extra canonical content |
| milestone / verificationState | Implementation planning and recorded QA evidence |
| modifiedAt | Factual content modification date only when known |

Dynamic patterns describe templates; concrete published records resolve paths. Do not count a pattern as an extra page alongside each record. Registry validation is proposed M4.3 work, not a completed check on production code.

## 35. Route relationship model

Service → Industry → Package → Enterprise → Enquiry describes optional discovery/evaluation relationships, not a required linear funnel or a breadcrumb chain. Services reference verified applicable industries; sectors reference relevant capabilities and compatible package options; packages offer Enterprise as a custom alternative; every appropriate path can go directly to enquiry.

Contextual related links may be reciprocal, but the parent hierarchy and navigation ownership remain acyclic. Store relationship IDs once with clear meaning; reverse views derive from the same source where appropriate. Do not duplicate route records, create service/industry cross-product URLs, or force prospects through every hub. Enquiry is a terminal operational action, not another content taxonomy.

## 36. MVP route manifest

**Exactly 19 fixed core routes**, aligned to v3.0 doc 00 §5. I = proposed index/follow after approved production publication; N = proposed noindex/follow utility. Sitemap Yes is conditional on publication, indexability and verified origin; nothing is currently generated. Primary CTA text on conversion pages describes the future submit action.

| Route | Route type | Parent | Audience | Search intent | Indexability | Sitemap inclusion | Primary CTA | Data source planned | Implementation milestone |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| / | Home | None | All U.S.-market prospects | Brand discovery and solution orientation | I | Yes | Request a Consultation | Company content | M5 |
| /about | Company | / | All prospects and partners | Company evaluation | I | Yes | Request a Consultation | Company content | M5 |
| /services | Services hub | / | All business segments; individual-service prospects | Capability discovery | I | Yes | Request a Consultation | Service families/services | M6 |
| /packages | Package hub | / | Startup and Growing Business prospects | Recurring solution evaluation | I | Yes | Compare Packages | Six package records + segment content | M6 |
| /packages/startup | Package hub | /packages | Startup Business | Startup package evaluation | I | Yes | Request a Proposal | Six package records + segment content | M6 |
| /packages/startup-basic | Package tier | /packages/startup | Startup Business | Startup Basic scope evaluation | I | Yes | Request a Proposal | Six package records + segment content | M6 |
| /packages/startup-standard | Package tier | /packages/startup | Startup Business | Startup Standard scope evaluation | I | Yes | Request a Proposal | Six package records + segment content | M6 |
| /packages/startup-premium | Package tier | /packages/startup | Startup Business | Startup Premium scope evaluation | I | Yes | Request a Proposal | Six package records + segment content | M6 |
| /packages/growing-business | Package hub | /packages | Growing Business | Growing Business package evaluation | I | Yes | Request a Proposal | Six package records + segment content | M6 |
| /packages/growing-business-basic | Package tier | /packages/growing-business | Growing Business | Growing Business Basic scope evaluation | I | Yes | Request a Proposal | Six package records + segment content | M6 |
| /packages/growing-business-standard | Package tier | /packages/growing-business | Growing Business | Growing Business Standard scope evaluation | I | Yes | Request a Proposal | Six package records + segment content | M6 |
| /packages/growing-business-premium | Package tier | /packages/growing-business | Growing Business | Growing Business Premium scope evaluation | I | Yes | Request a Proposal | Six package records + segment content | M6 |
| /packages/compare | Comparison | /packages | Startup and Growing Business | Compare approved package scope | I | Yes | Request a Proposal | Six package records + segment content | M6 |
| /enterprise | Custom enterprise | / | Enterprise decision makers | Custom growth-stack evaluation | I | Yes | Request a Consultation | Enterprise content + service references | M8 |
| /industries | Industry hub | / | Prospects seeking sector relevance | Industry solution discovery | I | Yes | Request a Consultation | Industries + relationship records | M7 |
| /consultation | Conversion | / | Any prospect, including undecided visitors | Request guidance on business needs | N | No | Request a Consultation | Enquiry definitions + validated references | M5 shell; M8 operational |
| /proposal | Conversion | / | Package, project, individual-service, enterprise prospects | Request scoped proposal | N | No | Request a Proposal | Enquiry definitions + validated references | M5 shell; M8 operational |
| /contact | Conversion | / | All prospects and partners | General enquiry and project brief | I | Yes | Send a Project Brief | Enquiry definitions + validated references | M5 shell; M8 operational |
| /privacy | Legal | / | Visitors and form users | Understand disclosed data handling | I | Yes | Contact with a privacy question | Approved disclosure content | M8 draft inputs; M9 approved |

Count reconciliation: 1 Home + 1 About + 1 Services hub + 10 package routes (1 overall hub, 2 segment hubs, 6 tiers, 1 comparison) + 1 Enterprise + 1 Industries hub + 3 conversions + 1 Privacy = **19**. Dynamic tier templates resolve six concrete routes, not two additional pages.

No M4.1 path/count discrepancy is introduced. Utility indexing choices, allowlisted tier implementation and publication controls refine architecture without changing that inventory. Exact milestone scheduling for company/partnership/legal content can be confirmed during implementation; all public lead collection requires operational handling and approved disclosure, regardless of when its shell is built.

## 37. Future route manifest

| Route pattern | Type / parent | Audience / intent | Primary CTA | Data / generation | Indexability / sitemap | Milestone / gate |
| --- | --- | --- | --- | --- | --- | --- |
| /insights/topics/[topicSlug] | Topic collection / /insights | Researchers; substantial topic discovery | Explore related services | Approved topic + article records; generate published paths | Index/follow and include only if useful/published | Post-launch expansion; substantial approved corpus and distinct intent |

This is M4.1's only explicit Future pattern. Articles/guides/proof remain Conditional/TBF below rather than silently reclassified as guaranteed deferred features. No /insights/topics index, tag tree, search endpoint, or editorial program is authorized.

## 38. Conditional/TBF route manifest

All rows require the four-part route publication gate. Discovery/detail rows propose index/follow and sitemap inclusion **only when approved and published**; otherwise they have no public link or sitemap entry. No concrete inventory count is claimed for patterns.

### Service-family candidates — all 22 preserved

Each has route type Service family, primary CTA Request a Consultation → /consultation, and Conditional/TBF publication status.

| Route | Approved family | Intent / audience | Parent | Planned data | Milestone |
| --- | --- | --- | --- | --- | --- |
| /services/strategy-consulting | Strategy & Consulting | Strategy and consulting support; Business decision makers | /services | Families/services + verified relationships | M6 |
| /services/seo | SEO | Organic search service evaluation; Businesses seeking organic discovery | /services | Families/services + verified relationships | M6 |
| /services/local-seo | Local SEO | Local search and GBP support; Businesses with verified local needs | /services | Families/services + verified relationships | M6 |
| /services/ai-search-visibility | AI Search Visibility | AI search visibility support; Businesses evaluating AI search discovery | /services | Families/services + verified relationships | M6 |
| /services/authority-pr | Authority & PR | Authority and digital PR services; Businesses evaluating authority-building work | /services | Families/services + verified relationships | M6 |
| /services/paid-advertising | Paid Advertising | Paid advertising management; Businesses considering paid acquisition | /services | Families/services + verified relationships | M6 |
| /services/specialist-campaigns | Specialist Campaigns | Channel-specific advertising support; Businesses evaluating an approved channel | /services | Families/services + verified relationships | M6 |
| /services/social-media | Social Media | Social management services; Businesses seeking managed social activity | /services | Families/services + verified relationships | M6 |
| /services/content-marketing | Content Marketing | Content marketing support; Businesses evaluating content programs | /services | Families/services + verified relationships | M6 |
| /services/branding-design | Branding & Design | Brand and graphic design services; Businesses and project prospects | /services | Families/services + verified relationships | M6 |
| /services/photo-video | Photo & Video | Video and creative production services; Businesses with creative/project needs | /services | Families/services + verified relationships | M6 |
| /services/website-development | Website Development | Website design/development evaluation; Businesses needing web projects | /services | Families/services + verified relationships | M6 |
| /services/app-mvp-development | App / MVP Development | App and MVP development evaluation; Businesses seeking product/project development | /services | Families/services + verified relationships | M6 |
| /services/website-care | Website Care | Website maintenance support; Businesses with existing websites | /services | Families/services + verified relationships | M6 |
| /services/conversion-optimization | Conversion Optimization | Conversion optimization services; Businesses evaluating conversion improvement | /services | Families/services + verified relationships | M6 |
| /services/email-sms | Email & SMS | Email/SMS marketing services; Businesses evaluating lifecycle marketing | /services | Families/services + verified relationships | M6 |
| /services/crm-automation | CRM & Automation | CRM and marketing automation services; Businesses evaluating marketing operations | /services | Families/services + verified relationships | M6 |
| /services/ai-automation | AI & Automation | AI automation service evaluation; Businesses evaluating approved automation needs | /services | Families/services + verified relationships | M6 |
| /services/b2b-marketing | B2B Marketing | B2B marketing and lead support; B2B businesses | /services | Families/services + verified relationships | M6 |
| /services/analytics-tracking | Analytics & Tracking | Measurement and reporting services; Businesses evaluating measurement needs | /services | Families/services + verified relationships | M6 |
| /services/business-technology-integrations | Business Technology & Integrations | Business system integration support; Businesses evaluating integration projects | /services | Families/services + verified relationships | M6 |
| /services/enterprise-leadership | Enterprise Leadership | Enterprise growth leadership evaluation; Enterprise decision makers | /services | Families/services + verified relationships | M6 |

### Industry candidates — 10 launch-priority and 8 secondary (v3.0 doc 04 §3)

Each has route type Industry detail, audience the named sector's business prospects, primary CTA Request a Consultation → /consultation, and Conditional/TBF publication status.

| Route | Intent | Parent | Planned data | Milestone |
| --- | --- | --- | --- | --- |
| /industries/healthcare | Healthcare sector evaluation | /industries | Approved sector content + verified service/package references | M7 |
| /industries/real-estate | Real Estate sector evaluation | /industries | Approved sector content + verified service/package references | M7 |
| /industries/home-services | Home Services sector evaluation | /industries | Approved sector content + verified service/package references | M7 |
| /industries/ecommerce | Ecommerce sector evaluation | /industries | Approved sector content + verified service/package references | M7 |
| /industries/saas-ai-technology | SaaS / AI / Technology sector evaluation | /industries | Approved sector content + verified service/package references | M7 |
| /industries/restaurants-franchises | Restaurants / Franchises sector evaluation | /industries | Approved sector content + verified service/package references | M7 |
| /industries/legal | Legal sector evaluation | /industries | Approved sector content + verified service/package references | M7 |
| /industries/education | Education sector evaluation | /industries | Approved sector content + verified service/package references | M7 |
| /industries/finance | Finance sector evaluation | /industries | Approved sector content + verified service/package references | M7 |
| /industries/automotive | Automotive sector evaluation | /industries | Approved sector content + verified service/package references | M7 |
| /industries/b2b-professional-services | B2B / Professional Services sector evaluation | /industries | Approved sector content + verified service/package references | M7 |
| /industries/travel-hospitality | Travel / Hospitality sector evaluation | /industries | Approved sector content + verified service/package references | M7 |
| /industries/beauty | Beauty sector evaluation | /industries | Approved sector content + verified service/package references | M7 |
| /industries/fitness | Fitness sector evaluation | /industries | Approved sector content + verified service/package references | M7 |
| /industries/fashion | Fashion sector evaluation | /industries | Approved sector content + verified service/package references | M7 |
| /industries/construction | Construction sector evaluation | /industries | Approved sector content + verified service/package references | M7 |
| /industries/logistics | Logistics sector evaluation | /industries | Approved sector content + verified service/package references | M7 |
| /industries/recruitment | Recruitment sector evaluation | /industries | Approved sector content + verified service/package references | M7 |

### Additional conditional patterns and destinations

| Route | Type / parent | Audience / intent | Primary CTA | Planned data | Indexability / sitemap when published | Milestone / specific gate |
| --- | --- | --- | --- | --- | --- | --- |
| /services/[familySlug]/[serviceSlug] | Individual service / family | Specific approved service need | Request a Proposal → /proposal | Service record + valid family relationship | Index/follow; Yes | M6; distinct child content, no family-intent duplicate |
| /projects | Project hub / / | One-time project prospects; distinct discovery | Send a Project Brief → /contact | Approved project modes and service references | Index/follow; Yes | M6; otherwise embedded discovery |
| /add-ons | Add-on hub / / | Prospects evaluating compatible additions | Request a Proposal → /proposal | Approved add-ons + compatibility | Index/follow; Yes | M6; otherwise embedded additions |
| /case-studies | Proof hub / / | Prospects evaluating verified work | Request a Consultation → /consultation | Approved evidence records | Index/follow; Yes | M7; supplied proof and publication rights |
| /case-studies/[slug] | Proof detail / /case-studies | Relevant prospects; specific verified engagement | Request a Consultation → /consultation | Verified engagement and factual relationships | Index/follow; Yes | M7; unique supplied evidence |
| /insights | Resources hub / / | Researchers; educational discovery | Explore Services → /services | Approved content records | Index/follow; Yes | M7; useful approved inventory |
| /insights/[slug] | Article/guide / /insights | Researchers; distinct informational question | Request a Consultation → /consultation | Approved article/guide content | Index/follow; Yes | M7; no invented editorial program |
| /terms | Legal / / | Visitors; approved website terms | Contact with a terms question → /contact | Approved legal content | Proposed index/follow; Yes | M9; legal need/content approval |
| /cookies | Legal / / | Visitors; actual cookie/tracking practices | Review privacy information → /privacy | Approved factual disclosures | Proposed index/follow; Yes | M9; tracking/legal need/content approval |
| /thank-you | Utility / / | Submitters; verified receipt acknowledgement | Return to homepage → / | Minimal receipt state; no personal-data URL | Noindex; No | M8; optional, inline confirmation valid |

No audit indexing decision or legal copy is asserted as final. Selected launch family/industry details still require useful approved content, not empty templates.

## 39. Later implementation sequence

| Milestone | Routing work when authorized |
| --- | --- |
| M4.3 | Type centralized route/entity/CTA/publication relationships, validate paths/tiers/parents, select approved launch inventory and record unresolved content inputs |
| M5 | Implement shared navigation/footer and production Home/core conversion UX; company/partnership shells as scheduled; preserve M3 foundation |
| M6 | Services, approved individual/project/add-on discovery, package hubs/comparison/six allowlisted tier paths |
| M7 | Industries and approved proof/resources; no empty or thin detail routes |
| M8 | Custom Enterprise and operational enquiry delivery/abuse handling; optional audit/receipt only if approved; approved chatbot integration as scoped |
| M9 | Origin-based metadata/canonicals, sitemap/robots, truthful structured data, approved analytics/security/privacy and applicable legal publication |
| M10 | Production-like route/link/status/SEO, keyboard/mobile, failure, performance and deployment verification |
| M11 | Verified operational ownership, receiving workflows and launch readiness |
| Future | Topic collections only after useful approved content volume warrants expansion |

Cross-cutting accessibility, security and content approval apply during implementation; later SEO/security milestones do not permit unsafe forms or indexed previews beforehand. A built shell must not imply operational submission.

## 40. Risks and anti-patterns

| Risk | Required prevention |
| --- | --- |
| Duplicate routes/aliases | One canonical identity; shared registry; reviewed migrations only |
| Keyword doorway pages | No service × industry × city matrix; distinct intent/content/ownership gate |
| Thin industry pages | Sector-specific substance; omit unready sectors |
| Tier proliferation | Exactly three allowlisted tiers per approved segment; no enterprise tiers |
| Repetitive six tier pages | Shared rendering with distinct approved scope; explicit consolidation decision if publication gate fails |
| Duplicated hard-coded navigation | Header/footer/breadcrumb/CTA consume centralized IDs and publication state |
| Scattered slugs | Stable central entity identities and collision validation |
| Package checkout | Selection ends in enquiry; no transactional URLs or auto-priced custom cart |
| Internal/system indexation | Preserve preview noindex; explicit utility indexing; sitemap publication filter |
| Stale/unsafe enquiry context | Server allowlists and relationship validation; no personal data in URLs |
| Soft-404 from streaming | Early record checks and actual status/noindex QA; no unconditional 404 assertion |
| Premature provider/CMS complexity | Choose only from authorized operational requirements |
| Fabricated facts | No invented commercial numbers, policies, regulated expertise, proof or vendor settings |

## 41. TBF decisions

- Launch subset and approved unique content for family/industry/individual-service routes; package scope differentiating all six tier pages.
- Prices, quantities/frequencies, limits, fees, billing/commitment terms, timelines and commercial policies.
- Production origin, hosting, deployment environments and operational owners.
- Enterprise selection UX and exact enquiry schema/context transport keys; add-on compatibility and service relationships.
- Whether standalone Projects/Add-ons, proof, resources, an audit offer or a receipt URL is useful and approved.
- Audit scope, eligibility, cost/free status, terms and receiving workflow.
- Verified company/proof/author/date content, publication rights, legal/disclosure wording and final utility/legal indexing review.
- Email provider/receivers, CRM, chatbot, analytics/consent, monitoring, spam protection and rate-limit persistence.
- Server Action versus Route Handler, delivery/receipt semantics, retention and failure/retry operations.
- CMS/editorial tooling, later revalidation, collection volume, pagination and useful topic publication.
- Asset/image sources, licensed font availability, favicon branding and integration-dependent security configuration.

These are unresolved inputs. This document assigns no invented credentials, domain, address, provider, owner identity, price, quantity, or contractual policy.

## 42. M4.2 acceptance criteria

- [ ] Only docs/route-architecture.md is created; M4.1 and all foundation/config/package files remain unchanged.
- [ ] Installed Next.js 16 conventions are cited; future filesystem is a proposal, not created routes.
- [ ] All 20 fixed M4.1 paths/count are reconciled without silent changes.
- [ ] All 22 approved service families and 11 M4.1 industry candidates remain supported.
- [ ] Startup Business and Growing Business each have exactly Basic / Standard / Premium; Enterprise is custom/consultation-led.
- [ ] Individual services, one-time projects, add-ons, partnerships, resources and legal/trust needs have appropriate gates.
- [ ] Every proposed route needs distinct intent, unique content, conversion purpose and ownership.
- [ ] No checkout/payment/account/admin/API implementation is introduced.
- [ ] Shared enquiry model and CTA/navigation/footer/breadcrumb/internal-link mappings are defined.
- [ ] Canonical/indexing/sitemap/robots/metadata/404/redirect controls are planned without invented origin or policies.
- [ ] Publication classes, data/slug governance, route relationships and later implementation sequence are clear.
- [ ] No prices/quantities/provider settings/policies are invented; unresolved decisions remain TBF.
- [ ] UTF-8/document consistency, whitespace and file-scope validation are recorded; no staging/commit/push occurs.

These are review criteria for this architecture proposal. Production accessibility, performance, SEO, metadata, lead receipt and route behavior still require implementation and the repository QA process.
