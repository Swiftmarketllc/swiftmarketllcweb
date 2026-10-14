# M4.8: Route, navigation, CTA and breadcrumb data

## Authority and scope

Approved MVP v3.0, information architecture (M4.1), route architecture (M4.2), existing M4.3 contracts and M4.4–M4.7 registries remain authoritative and unchanged. This milestone adds architecture data, pure helpers and tests; it does not expose filesystem routes, implement navigation UI or establish working enquiry delivery.

Files:

- `lib/data/routes.ts`: immutable route identities, lookups, integrity/publication checks, breadcrumbs and sitemap eligibility.
- `lib/data/navigation.ts`: navigation groups, CTA candidates, reference validation and public filtering.
- `lib/data/routes.test.mjs`: Node built-in integrity tests using the existing in-memory TypeScript loader convention.
- `docs/route-navigation-data.md`: this reference.

No domain contract changes or file-structure deviations are required. Public data modules import public contracts and canonical registries; private enquiry contracts and personal data are not exported.

## Fixed route inventory

Exactly 20 fixed identities are retained. All are **draft**, not reviewed, with publication decisions unresolved. IDs are globally unique; `basic`, `standard` and `premium` are segment-scoped slugs, not globally unique identifiers.

| Route ID | Full path | Parent ID |
| --- | --- | --- |
| route:home | / | none |
| route:about | /about | route:home |
| route:services | /services | route:home |
| route:packages | /packages | route:home |
| route:packages:startup | /packages/startup | route:packages |
| route:package:startup:basic | /packages/startup-basic | route:packages:startup |
| route:package:startup:standard | /packages/startup-standard | route:packages:startup |
| route:package:startup:premium | /packages/startup-premium | route:packages:startup |
| route:packages:growing-business | /packages/growing-business | route:packages |
| route:package:growing-business:basic | /packages/growing-business-basic | route:packages:growing-business |
| route:package:growing-business:standard | /packages/growing-business-standard | route:packages:growing-business |
| route:package:growing-business:premium | /packages/growing-business-premium | route:packages:growing-business |
| route:packages:compare | /packages/compare | route:packages |
| route:enterprise | /enterprise | route:home |
| route:industries | /industries | route:home |
| route:partnerships | /partnerships | route:home |
| route:consultation | /consultation | route:home |
| route:proposal | /proposal | route:home |
| route:contact | /contact | route:home |
| route:privacy | /privacy | route:home |

Tier records reference the six canonical package IDs. Enterprise references the existing consultation-led custom offer and gains no tiers.

## Conditional inventory and unresolved destinations

The canonical service and industry registries generate exactly 33 conditional candidates:

- 22 families: `route:service-family:{family.slug}`, `/services/{family.slug}`, parent `route:services`, canonical family entity ID.
- 11 industries: `route:industry:{industry.slug}`, `/industries/{industry.slug}`, parent `route:industries`, canonical industry entity ID.

Together with the fixed inventory, `routes` contains **53 records, all draft; zero published**. Generation adds no service/industry mappings, recommendations or SEO content. Individual services currently have zero records, so no child service destinations are fabricated.

Additional architecture patterns (Projects, Add-ons, proof, Insights, audit, optional receipt, Terms and Cookies) are not instantiated in this milestone. Their content, scope or publication decisions remain pending. No unsupported Resources navigation group or external destination is populated.

## Lookups, hierarchy and integrity

`getRouteById` and `getRouteByPath` perform exact lookups, including drafts, and return `undefined` for unknown values. They do not normalize user input or silently resolve aliases. Paths are lowercase resolved full paths, with no query, hash or trailing slash except root; root has a null slug. Aliases remain empty.

`validateRouteRegistry` checks unique IDs/paths, normalized paths, slug agreement, canonical entity and CTA references, valid parents, cycles, package selection correlation, underlying relationship integrity and unsafe publication/indexing combinations. References are IDs, never guessed commercial relationships. Validation is intended for trusted typed registry data; future server-side enquiry input requires a separate untrusted-input validator.

`resolveBreadcrumbs` follows explicit parent IDs and detects missing parents, missing routes and cycles. Public mode is the default and requires eligible routes throughout the hierarchy. Editorial mode permits internal inspection of draft identities; its paths must not be used as public links. Breadcrumb ancestors carry paths and the current item is text without a link. Example hierarchy: Home → Packages → Startup Business → Basic.

## Navigation candidates

Labels come from the approved architecture or canonical entity names. Group descriptors organize data and do not settle future marketing copy or UI design.

| Group ID | Label | Destinations |
| --- | --- | --- |
| nav-group:primary | Primary navigation | Services, Packages, Enterprise, Industries, About, Request a Consultation |
| nav-group:utility | Utility navigation | Home, Contact, Partnerships |
| nav-group:company | Company | About, Contact, Partnerships |
| nav-group:solutions | Solutions | Services, Packages, Enterprise, Industries |
| nav-group:legal | Legal | Privacy |

Each item has a unique group-scoped `nav:` ID and a canonical route ID. `packageNavigation` additionally provides an independently navigable Packages disclosure candidate with Startup Business, Growing Business and Compare Packages children. The primary candidate uses a direct Packages link; future UI may consume the separately exported disclosure.

`validateNavigation` checks duplicate IDs, missing destinations, recursive disclosure cycles and unverified fragments. `filterPublicNavigation` removes unpublished destinations and empty groups, requires a published parent before exposing disclosure children, and converts a childless eligible disclosure to a normal link. Invalid navigation fails closed. The canonical filtered result currently contains **zero groups**.

## CTA candidates and destination validation

| Export / journey | Intent | Destination |
| --- | --- | --- |
| consultationCTA | request-consultation | route:consultation |
| proposalCTA | request-proposal | route:proposal |
| enterpriseCTA | request-consultation; Enterprise context | route:consultation |
| partnershipCTA | discuss-partnership | route:contact |
| projectBriefCTA | send-project-brief | route:contact |
| comparePackagesCTA | compare | route:packages:compare |
| packageEnquiryCTAs (six) | request-proposal; canonical package selection | route:proposal |
| getIndividualServiceEnquiryCTA | request-proposal; valid individual service selection | route:proposal |

The individual-service helper returns `undefined` for unknown IDs, including family IDs. No current individual-service candidate is generated because the canonical service inventory is empty. Package selection retains package ID, segment and tier independently; it does not create a price, inclusion or recommendation. Enterprise retains custom selection intent. Enquiry context stays structured data; this module does not serialize selections or personal data into URLs.

`validateCTAReferences` checks approved internal route identities, intent/destination agreement and canonical selection references. Audit remains unavailable because there is no approved audit offer/destination in this registry. Existing CTA contracts model internal destinations only: unresolved external journeys remain unpopulated and unpublished rather than receiving placeholder URLs.

`resolvePublicCTA` additionally requires eligible destination and selected entities. It never resolves submit actions or unverified fragments into links. All canonical CTA candidates currently resolve to **no public link**. Declaring a CTA or submit intent does not imply a functioning form, backend or received submission.

## Publication and SEO gates

Every canonical route retains TBF audience, SEO intent, primary CTA, indexability, metadata title/description, data source, content owner, template and generation strategy. Production origin is separately `siteOrigin: { state: "tbf" }`. Optional social imagery is absent until approved. Content, operational integrations, commercial quantities and pricing remain unresolved in their existing sources.

Public resolution requires published state with approval reference/date, reviewed verification, approved nonempty metadata, approved indexing and primary CTA decisions, approved architecture ownership/source/template decisions, a resolved generation strategy, valid parent hierarchy and published applicable entities. Linked primary CTAs must target eligible routes. A registry integrity issue fails public lookup closed. Draft index/sitemap activation and noindex-plus-sitemap combinations are rejected.

Review flags and approval references are attestations supplied by later implementation and review. These helpers cannot verify a filesystem page, actual useful content, legal correctness, business facts or operational backend delivery; those checks remain mandatory before publication. Publication prerequisites are recorded for that review.

`getSitemapRoutes` adds an approved HTTPS production-origin gate, rejects malformed origins, localhost, credentials, paths, queries and fragments, and requires explicit index/sitemap eligibility. It emits no sitemap handler, canonical URL, robots file or structured data. Current sitemap eligibility is empty. Origin checking is a configuration guard, not a general network-security validator.

The existing M3 preview at `/` remains intact with its existing noindex. The draft production Home identity does not publish or replace that preview. No public page, placeholder link, checkout, payment, form or integration is created.

## Tests and version guidance

The 13 new tests cover exact architecture inventory, conditional canonical references, segment-scoped tiers, uniqueness, immutable draft data, exact lookups, parent breadcrumbs/cycles, invalid references, CTA context, synthetic publication filtering, disclosure behavior and SEO/origin gates. Synthetic approved metadata, timestamps and the reserved `example.invalid` origin exist only in test fixtures; they are not production records or business claims.

Run the new suite with `node lib/data/routes.test.mjs`, and regression suites with `node lib/data/services.test.mjs`, `node lib/data/industries.test.mjs`, `node lib/data/packages.test.mjs` and `node lib/data/relationships.test.mjs`. Also run `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm build` and whitespace/scope checks. No test framework or dependency is added.

Installed Next.js guidance consulted under `node_modules/next/dist/docs/` includes `01-app/01-getting-started/02-project-structure.md` and `01-app/03-api-reference/05-config/01-next-config-js/trailingSlash.md`: data folders do not expose pages, and the default URL convention removes trailing slashes. Existing Server/Client Component guidance supports serializable public data and keeping private integration data server-side. No framework API or configuration change is needed.

## Pending inputs and recommended next work

- Approve launch subsets, distinct content and publication owners for conditional routes.
- Supply unique verified metadata, production origin and reviewed indexing decisions.
- Resolve commercial scope and service/industry/package mappings in canonical sources without invented values.
- Supply company, proof and legally approved privacy content; approve additional conditional destinations only when warranted.
- Implement and verify intended pages and enquiry delivery before enabling publication or public links.
- Review context transport, operational integrations and future external destinations in their authorized milestones.

There is no architecture blocker to continuing with draft data. Recommended M4.9 prerequisite work is a review of unresolved content/publication inputs and any remaining centralized-data scope. This is a recommendation, not an invented approved M4.9 specification; obtain the next milestone's explicit scope before implementation. Production navigation, pages, forms and SEO handlers remain in their approved later delivery stages.
