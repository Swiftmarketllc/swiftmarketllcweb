# Day 2 Phase 1 — draft launch foundation

Implementation does not authorize publication. All 53 canonical route/content
records, service/industry/offer data, contracts and publication gates remain
unchanged. No prices, claims, proof, integration choices or legal commitments
have been approved by this phase.

## Canonical scope

| Path | Route | Content |
| --- | --- | --- |
| / | route:home | content:home |
| /services | route:services | content:services |
| /industries | route:industries | content:industries |
| /packages | route:packages | content:packages |
| /about | route:about | content:about |
| /contact | route:contact | content:contact |
| /privacy | route:privacy | content:privacy |

The six new page entry points use PublicLaunchPage and the centralized public
consumer. They invoke Next.js notFound while canonical content is ineligible.
They do not import editorial drafts. Home preserves the existing noindex
design-system preview until eligible canonical Home content exists.

LaunchPageBody is a reusable presentation composition, not a registry or
publication validator. PublicLaunchPage supplies only eligible canonical
headings, summaries, sections and CTAs. It composes the header/footer outside
the single MainContent and renders H1/H2 hierarchy; CTA links independently
use the safe adapter. No raw registry or source overrides are used by pages.
Contact's future public composition deliberately has no operational form yet.

## Internal draft review

components/preview/launch-copy-drafts.ts holds seven editorial working drafts
associated with canonical IDs. This is not a parallel commercial schema or a
canonical content source: it has no approval reference, SEO, offers, prices,
availability, relationships, navigation or destination data.

LaunchPagesPreview displays these drafts as disclosure panels only when
NODE_ENV is development, inside the existing internal noindex preview.
Production and test output omit them. Review headings use H3/H4 and prefixed
IDs; they add no main/H1 or draft links. The development preview remains
accessible to anyone with access to the development server: noindex is not
authentication. Do not expose development servers publicly or put confidential
information in these drafts.

The disabled enquiry fieldset proposes required name/email/message and optional
company/website. Every field is disabled through its fieldset, inputs have no
name attributes, the button is disabled and type=button, and no form/action,
handler, storage or network integration exists. It cannot collect or submit an
enquiry. Native labels, types, required annotations and an explanatory legend
prepare later accessible implementation without pretending it works.

Privacy is an outline only. Controller/contact information, processing details,
applicable legal basis, providers, retention, rights, cookies and legal wording
are TBF. The draft makes no legal commitments.

## Metadata and future approval

Page metadata reads only eligible route metadata. Missing eligibility produces
a neutral unavailable title, empty description, no canonical/social URL and
noindex/nofollow. Phase 1 remains noindex even if later data approval occurs.
Home's existing preview metadata is retained; switching to approved homepage
metadata and indexing is a separately reviewed publication step.

Owner approval must precede migration of review copy into the canonical
Decision fields. Preserve IDs, sections/roles and CTA semantic alignment; do
not auto-convert these editorial drafts to approved values. Complete route,
content, factual, SEO/origin, parent and destination approval dependencies.
Privacy needs legal review; Contact needs operational review and working
server validation, spam/rate limiting, delivery and failure handling. Unknown
commercial fields stay TBF; detail destinations remain draft.

## Validation and remaining work

Run all lib/data/*.test.mjs suites and components/ui/primitives.test.mjs,
TypeScript, lint, production build and whitespace checks. Regression coverage
includes blocked canonical routes, metadata, draft identities, environment
isolation, one main/H1, ID uniqueness and disabled enquiry semantics.

Browser QA is pending, including narrow/intermediate widths, keyboard
disclosures/focus, text enlargement/reflow, forced colors and reduced motion.
These tests do not establish production readiness, accessibility conformance,
privacy compliance or enquiry delivery. No server integration, publication,
deployment, staging or commit is part of Phase 1.
