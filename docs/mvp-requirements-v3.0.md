# Swift Market LLC — MVP Requirements v3.0

**Document status: APPROVED BASELINE**

| Document attribute | Baseline |
| --- | --- |
| Version | 3.0 |
| Purpose | Repository product requirements source of truth for the Swift Market LLC MVP |
| Approval status | Approved business/product baseline; approval does not mean implementation or operational launch is complete |
| Governing baseline | Approved MVP v3.0 requirements recorded in root `AGENTS.md` and the authorized Step 0.6 documentation request |
| Implementation relationship | This document specifies product requirements; `AGENTS.md` governs engineering, design, scope, and agent workflow. Read both before implementing a milestone. |
| Change control | Future changes require explicit approval and a recorded revision; do not silently overwrite approved requirements. |

This document consolidates approved intent into implementation-oriented requirements. It does not authorize implementation outside the current milestone, select providers, establish contractual offers, or invent missing business facts. Proposed field names describe future data capabilities, not an implemented schema. Final routes, interaction details, storage models, and integrations are resolved in their authorized milestones.

**TBF** means **To Be Finalized**. **Custom Quote** means pricing or scope is resolved through consultation and proposal; it is not a price. Unknown values must remain distinguishable from approved values, zero, free, unlimited, or unavailable. The pending decisions register records unresolved inputs without resolving them.

## 1. Product Vision

Swift Market LLC is building a U.S.-market consultancy/services platform covering digital growth, marketing, creative, web/app development, AI/automation, and technology solutions. The website must present these capabilities as a coherent service business and help visitors find an appropriate next step.

The platform must support both straightforward service discovery and more complex combinations of recurring work, one-time projects, add-ons, and enterprise requirements. It must remain scalable as approved services, industries, and content are added, without requiring a separate site architecture for each offer or niche.

## 2. MVP Business Objective

The website must:

- Establish credibility through verified messaging, clear scope, and professional presentation.
- Explain capabilities and organize complex services into understandable categories.
- Target relevant industries through useful, distinct content.
- Help visitors evaluate packages, individual services, projects, and enterprise options.
- Generate qualified enquiries, consultation requests, and proposal requests.
- Preserve the visitor's selected solution and context for operational follow-up.
- Support future scalable growth through reusable architecture and centralized content.

**The MVP is enquiry/proposal-first, not ecommerce-first.**

The conversion contract is: visitor discovers a service, industry, or package -> evaluates an appropriate solution -> selects or references a package/service -> submits a consultation/enquiry/proposal request -> Swift Market receives and manages the lead -> proposal and onboarding happen operationally.

No online checkout or payment is included unless separately approved. No numerical lead, revenue, or conversion-rate targets are established by this document. Technical performance targets remain those defined in `AGENTS.md` and Section 19.

## 3. Target Customer Segments

| Segment | Required discovery and enquiry support |
| --- | --- |
| Startup Business | Evaluate Basic, Standard, and Premium options and request guidance or a proposal. |
| Growing Business | Evaluate Basic, Standard, and Premium options against existing needs and growth objectives. |
| Enterprise | Describe requirements, select relevant services, and request a custom Build Your Growth Stack consultation/proposal. |
| Businesses needing individual services | Discover a specific capability and enquire without selecting a recurring package. |
| Businesses needing one-time projects | Describe a defined project and request scope, timing, and a quote without an assumed subscription. |
| Agency/strategic partnership opportunities | Submit partnership context and request an appropriate operational discussion. |

These segments do not establish eligibility thresholds, minimum budgets, headcounts, partnership terms, or contractual commitments. Such values require approval.

## 4. Commercial Architecture

| Commercial option | Approved structure |
| --- | --- |
| Startup Business | Basic / Standard / Premium |
| Growing Business | Basic / Standard / Premium |
| Enterprise | Build Your Growth Stack; consultation-led custom service selection and custom proposal/quote |
| Individual Services | Enquiry for a selected service without requiring a package |
| One-Time Projects | Project-specific enquiry and operational scoping/proposal |
| Add-ons | Optional approved additions whose availability and compatibility must be explicit |

Segment and tier must be modeled separately. A shared tier name does not imply equal scope or pricing across segments. Enterprise must not be forced into one fixed predefined package.

Commercial presentation must distinguish:

- Swift Market service/management fees.
- Advertising/media spend, separate unless explicitly stated otherwise in an approved offer.
- Paid third-party tools/software and subscriptions.
- Hosting.
- Premium assets.
- Production and other external costs.

External costs are separate unless explicitly included in an approved offer. Cards, detail pages, comparisons, enquiry selections, and proposals must use consistent inclusion/exclusion information.

Unknown prices, setup fees, post/campaign quantities, ad budgets, service limits, contract durations, turnaround times, discounts, guarantees, and performance claims must never be invented. Use TBF / To Be Finalized / Custom Quote where appropriate. Do not interpret an unknown value as zero, free, unlimited, or a guaranteed inclusion.

## 5. Master Service Architecture

The future system must support all approved service families below. Their inclusion defines architectural capability, not a requirement to publish every family immediately or a claim that every service is currently available.

| Approved service family | Data requirement |
| --- | --- |
| Strategy & Consulting | Shared service contract defined below |
| SEO | Shared service contract defined below |
| Local SEO | Shared service contract defined below |
| AI Search Visibility | Shared service contract defined below |
| Authority & PR | Shared service contract defined below |
| Paid Advertising | Shared service contract defined below |
| Specialist Campaigns | Shared service contract defined below |
| Social Media | Shared service contract defined below |
| Content Marketing | Shared service contract defined below |
| Branding & Design | Shared service contract defined below |
| Photo & Video | Shared service contract defined below |
| Website Development | Shared service contract defined below |
| App / MVP Development | Shared service contract defined below |
| Website Care | Shared service contract defined below |
| Conversion Optimization | Shared service contract defined below |
| Email & SMS | Shared service contract defined below |
| CRM & Automation | Shared service contract defined below |
| AI & Automation | Shared service contract defined below |
| B2B Marketing | Shared service contract defined below |
| Analytics & Tracking | Shared service contract defined below |
| Business Technology & Integrations | Shared service contract defined below |
| Enterprise Leadership | Shared service contract defined below |

Each family and its future service records must be able to use this typed content contract:

| Field capability | Requirement |
| --- | --- |
| `id`, `slug`, `name` | Stable unique identifier, route-ready slug finalized in M4, and approved display name. |
| `shortDescription`, `fullDescription`, `category` | Distinct summary/detail content and centralized categorization. |
| `availability`, `targetSegments`, `targetIndustries` | Explicit availability and relationships to approved segment/industry records. |
| `problemsSolved` | Relevant customer problems without fabricated market statistics. |
| `deliverables`, optional `quantities` | Approved scope and measurable quantities/frequencies only when confirmed; otherwise explicit TBF or custom scoping. |
| `process`, `outcomes` | Approved process and intended outcomes; no invented timing, guarantees, rankings, or achieved results. |
| `relatedServices`, `packageRelationships`, `addOns` | References to centralized records, with compatibility/inclusions defined only from approved data. |
| `faqs`, `cta` | Verified answers and an appropriate enquiry/consultation/proposal next step. |
| `seoMetadata` | Unique metadata based on approved content and a verified production origin. |

Advertising/social channels may include Google, Meta, TikTok, YouTube, Snapchat, Spotify, and other approved channels according to client requirements. Channel references do not establish partnerships, certifications, configured integrations, or inclusion in every offer.

## 6. Industry / Niche Architecture

Approved priority/representative industries are Healthcare; Real Estate; Home Services; Ecommerce; SaaS / AI / Technology; Restaurants / Franchises; Legal; Education; Finance; Automotive; B2B / Professional Services; Travel / Hospitality; Beauty; Fitness; Fashion; Construction; Logistics; and Recruitment.

Industry content must use reusable page composition with centralized industry records and relationships to relevant services. Records should support identity, description, relevant problems, linked services/packages, approved evidence, FAQs, CTA, and SEO fields. Additional industries must be addable through shared content/data rather than copying the whole site.

Each published industry page must offer useful, distinct approved content. Do not create duplicated doorway pages, fabricated locations, unsupported market statistics, or unverified industry-specific outcomes. Serving e-commerce clients does not make the Swift Market website a checkout platform.

## 7. Package Requirements

The future package model must support the following capabilities without supplying invented commercial values:

| Field capability | Requirement |
| --- | --- |
| Unique ID, slug, name | Stable identity, architecture-approved slug, and approved display name. |
| Segment, tier | Separate Startup Business/Growing Business segmentation and Basic/Standard/Premium tiers; enterprise retains custom scope. |
| Positioning, target customer, objective | Explain suitability and intended purpose using approved content. |
| Included services, deliverables | Reference centralized service records and approved scope. |
| Measurable quantities/frequency | Store confirmed units/cadence; support TBF/custom values without invented defaults. |
| Scope limits | Explicit approved limits; absence of a value never means unlimited. |
| Pricing basis, price status | Separate billing/pricing basis from amount and its approved/TBF/custom status; do not invent a currency amount or cadence. |
| Setup fee | Approved amount/status where applicable; distinguish unknown from approved no-fee treatment. |
| External costs | Identify approved inclusions and separate ad spend, tools, hosting, assets, and production costs. |
| Timeline | Approved timing or TBF/custom scope; no unsupported turnaround promises. |
| Reporting, support | Approved reporting/support arrangements without invented frequencies or response commitments. |
| Client responsibilities, exclusions | Clear approved inputs, dependencies, and excluded work. |
| Optional add-ons | References to approved compatible additions, with separate scope/cost status. |
| CTA, FAQs | Appropriate enquiry/proposal action and verified commercial answers. |
| Status, terms | Explicit availability/status and approved terms; do not equate incomplete data with a live purchasable offer. |

Package discovery, details, comparison, and enquiry payloads must reference the same identifiers and sources. Comparison must disclose unknowns and exclusions, not infer values from another tier. Retain context when a visitor requests a proposal. No package selection may silently trigger payment or establish a contract.

## 8. Enterprise Requirements

**Build Your Growth Stack** must support selectable requirements/services, consultation, custom scope, custom quote, and an operational proposal workflow. Visitors must be able to describe needs that do not fit a fixed package. Service selection is an expression of interest, not a finalized scope or price.

Desired enterprise enquiry field capabilities are conceptual; requiredness and validation are finalized during implementation:

- Company/business information and a suitable contact identity.
- Industry and website where relevant.
- Business goals and current challenges.
- Required services/requirements, linked to approved service identifiers where possible.
- Markets/locations the client wants to serve, without implying Swift Market office locations.
- Existing tools/CRM and relevant integration context.
- Service budget and a **separate advertising budget**, without invented preset bands or minimums.
- Desired start timing, distinguished from a promised delivery timeline.
- Attachments where appropriate and approved, subject to privacy, size/type, and security decisions.
- Preferred contact method.

The operational flow is enquiry receipt -> review and clarification/consultation -> scoped service selection -> custom proposal/quote -> operational onboarding if won. This does not require automatic document generation, a pricing calculator, or an enterprise admin portal. Do not implement the form as part of this documentation task.

## 9. Customer Journeys

| Journey | Discovery and evaluation | Conversion endpoint |
| --- | --- | --- |
| A. Package-led | Choose segment, examine tiers, compare approved scope, select/reference a package. | Package-context enquiry, consultation, or proposal request. |
| B. Service-led | Browse service families, review details/related services, identify a suitable capability. | Service-context consultation or proposal request. |
| C. Industry-led | Review relevant industry problems and approved service relationships. | Industry-context enquiry or consultation. |
| D. Enterprise | Explore Build Your Growth Stack, select requirements/services, describe business context. | Custom enterprise consultation/proposal request. |
| E. Individual-service | Identify one service, one-time project, or relevant add-on without a recurring package. | Focused service/project enquiry or proposal request. |
| F. Partnership/agency | Describe the organization, opportunity, and desired collaboration. | Partnership enquiry or consultation. |

Each journey must preserve useful selection/context, make the next step clear, and reach a functioning enquiry pathway. Visitors may seek guidance without already knowing a package or service. No journey ends in an unsupported checkout, dead control, or fabricated submission confirmation.

## 10. Conversion Architecture

Primary conversion actions include Request a Consultation, Request a Proposal, and Send a Project Brief. Content variants may include Book a Consultation, Get a Digital Audit, or Discuss My Project when their destination and offer are approved and accurately described.

Secondary discovery/evaluation actions include Explore Services, Compare Packages, review service/package detail, explore relevant industries, and view approved supporting content. Secondary actions must help users progress toward an appropriate enquiry.

CTA wording is refinable content, not immutable commercial policy. A label must match actual behavior: do not imply a confirmed appointment, free audit, guaranteed delivery, or specific response time without an approved functioning process. Reusable CTAs must preserve relevant service/package/industry context and remain accessible. No checkout/payment is included without separate approval.

## 11. Sitemap / Route Intent

| Approved page intent | Purpose |
| --- | --- |
| Home | Explain the business and direct visitors into discovery and enquiries. |
| About | Present verified company information and positioning. |
| Services / service detail | Organize and explain approved capabilities. |
| Plans / Packages / package detail / comparison | Help visitors evaluate commercial options and request a proposal. |
| Enterprise | Present consultation-led Build Your Growth Stack. |
| Industries / industry detail | Connect relevant customer needs to approved capabilities. |
| Case Studies / Portfolio | Present verified, approved work/evidence when available. |
| Insights / Blog | Publish approved useful content through scalable architecture. |
| Contact / Consultation / Proposal request | Capture enquiries and preserve relevant context. |
| Legal pages | Present approved privacy/legal information required for launch. |

Route names, URL structure, grouping, and publication scope are architecture intent subject to M4 finalization. Do not invent a production domain or create empty indexable routes solely to satisfy the list. The existing internal root preview remains noindex until replaced by the production homepage.

## 12. Functional Requirements

The implemented MVP must provide responsive navigation; service and industry discovery; package discovery/detail/comparison; enterprise custom enquiry; consultation/contact/proposal enquiries; and a reusable CTA system. These must use approved content and shared context rather than duplicated commercial facts.

Public enquiry features require validation, accessible success/error states, spam/abuse protection, and verified email/internal notification routing. A submission must not report receipt before the intended server-side handling succeeds. Analytics-ready conversion events must distinguish starting an enquiry from successfully submitting one.

Scalable typed content/data architecture is required. Chatbot/support capability is scoped in the approved M8 milestone; implementation/provider and exact behavior remain TBF. This document does not independently authorize a chatbot integration or make speculative chatbot infrastructure a launch dependency.

Storage, libraries, endpoint style, detailed navigation interaction, notifications implementation, and provider APIs are implementation decisions for the relevant milestone, not facts established here.

## 13. Lead / Enquiry Requirements

Conceptual operational states are **New -> Contacted -> Proposal Sent -> Won / Lost**. These describe operational follow-up, not automated transitions or contractual commitments.

Future lead architecture must be capable of preserving enquiry identity, enquiry type, supplied business/contact context, selected package/services, source/attribution, and timestamps. It should support future assignment and internal notes within the relevant milestone. Capture UTM and landing-page context appropriately while treating client-supplied attribution as untrusted input.

Public acknowledgement, routing, follow-up, and eventual status management must be testable. CRM/provider, persistence, permissions, retention, required fields, and detailed transition rules remain TBF. Do not select a CRM or build a speculative internal application from this conceptual model.

## 14. Content Requirements

Business messaging must explain capabilities and the next step clearly for the U.S. market. Service content must explain suitability, scope, approved process, and intended outcomes. Package content must disclose inclusions, limits, exclusions, external costs, and known versus TBF values consistently.

Industry content must be distinct and useful. FAQs must answer approved service/commercial questions consistently. Case studies/portfolio, insights/blog, and legal content must use approved sources. Testimonials may be published only when supplied, verified, and approved; missing evidence must not be replaced with invented examples presented as real.

Never fabricate claims, clients, ratings, reviews, awards, addresses, statistics, results, certifications, partnerships, revenue, rankings, years of experience, team members, office locations, phone numbers, or social URLs. Do not publish fake counters, client logos, or unverified case-study metrics.

Use clearly marked placeholders during development. Before launch, resolve, explicitly disclose, or omit incomplete content so TBF values are never accidentally presented as factual approved offers. Do not invent legal wording, commercial policies, or performance promises to fill content gaps.

## 15. Design System Requirements

Preserve the existing M3 foundation in `app/globals.css`, `app/layout.tsx`, and `app/page.tsx`. It is implemented foundation work awaiting the Step 0 checkpoint, not the final homepage.

| Area | Requirement |
| --- | --- |
| Mode and colors | Light mode; Warm Red #FF4E45, Outer Space #11182F, Perfect White #FFFFFF. White remains the primary canvas, navy carries solid primary headings/text, and red is an accent/action color. |
| Tokens | Centralized semantic colors, typography, spacing, borders, radii, shadows, focus, and motion; no scattered brand literals. |
| Font | Neue Haas Grotesk only when legally/licensably available. Do not download, bundle, redistribute, or fabricate font files. Preserve `"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif` until approved assets are available. |
| Typography | Fluid display/headings where appropriate, comfortable body line height, consistent restrained tracking, and solid rather than decorative outline headings. |
| Layout | Existing approximately 1280px/80rem maximum container, controlled 65ch reading width, fluid gutters, and responsive grids. |
| Rhythm | Consistent spacing scale, breathable desktop sections, and efficient mobile spacing. |
| Surfaces and cards | Subtle neutral surfaces, restrained borders/shadows/radii, and cards only when useful. |
| Buttons and CTAs | Distinguishable primary/secondary states, strong contrast, clear labels, keyboard focus, and accessible disabled behavior. Final reusable components belong to later milestones. |
| Forms | Accessible labels/instructions, clear field/error/status states, readable controls, and consistent tokens when implemented. |
| Motion and responsiveness | Preserve focus and reduced-motion handling; mobile-first reflow without device-specific hacks. |

Warm Red must not be assumed safe for arbitrary small text on white. Validate contrast across all relevant states and surfaces. The internal preview must remain explicitly identified and noindex until production replacement.

## 16. UI/UX Principles

The experience must be professional, premium, modern, breathable, balanced, aligned, energetic without clutter, and appropriate for a U.S. digital marketing and technology consultancy. Use clear hierarchy, readable content, restrained line lengths, and conversion-focused mobile-first composition.

Accessibility and progressive enhancement must inform navigation, evaluation, and enquiries. Motion must be restrained and purposeful. Avoid excessive gradients/shadows, unnecessary glassmorphism, scroll hijacking, autoplay background video, and heavy libraries added merely for visual effects. Do not force every content region into cards or a generic agency-template pattern.

## 17. Accessibility Requirements

Target WCAG 2.2 AA principles without claiming certification or conformance from automated checks alone. Required behavior includes:

- Semantic HTML, meaningful landmarks, descriptive headings, and a logical heading hierarchy.
- Keyboard-operable navigation, menus, controls, and enquiry flows without traps.
- Visible focus with logical order and appropriate focus management; focus must not be obscured by sticky UI.
- A working skip link and main-content target on relevant pages, including fallback pages.
- Sufficient text/UI contrast and state/meaning conveyed beyond color alone.
- Accessible field labels, instructions, errors, and success/pending statuses.
- Meaningful alt text for content images and appropriate treatment of decorative imagery.
- Reduced-motion support, usable touch targets, and responsive zoom/reflow.
- Native semantics first and ARIA only where needed.

Manual browser/keyboard review must complement source and automated checks. M3's prior source/contrast checks do not establish completion of rendered accessibility QA.

## 18. SEO Requirements

Use semantic information architecture and installed Next.js metadata APIs. Indexable production pages require unique titles/descriptions, a descriptive H1, logical headings, appropriate canonical URLs, Open Graph metadata, crawlable approved content, and relevant internal links.

The canonical production origin remains **TBF until verified/configured**. Centralize it; do not invent a URL, deploy localhost canonicals, or derive canonical identity from arbitrary untrusted request input.

Provide sitemap and robots behavior consistent with intended public routes, preview/draft treatment, and launch configuration. Keep the internal design preview noindex; do not include unapproved drafts or placeholder pages in production sitemaps. Robots directives are not security controls.

Service and industry SEO must provide useful distinct content rather than keyword stuffing, hidden text, fake locations, or doorway pages. Plan internal linking, breadcrumbs, and scalable metadata from shared content. Structured data must match visible verified facts; never fabricate reviews, ratings, organization facts, addresses, or results. Core Web Vitals must inform implementation without being presented as achieved results before measurement.

## 19. Performance Requirements

Preserve Next.js App Router, React, strict TypeScript, Tailwind, pnpm, and installed versions unless a change is explicitly approved. Use Server Components by default and static rendering where appropriate. Keep client boundaries narrow and browser JavaScript minimal.

Use optimized responsive images with appropriate dimensions/sizes and loading behavior, reserve space to avoid layout shifts, and lazy-load noncritical assets. Preserve safe image defaults and add remote sources only when verified assets require them. Font loading must remain licensed and performance-conscious. Avoid unnecessary dependencies and heavy animation systems.

Core Web Vitals targets from `AGENTS.md` are **LCP <= 2.5 seconds, INP <= 200 ms, and CLS <= 0.1**. They are targets, not measured scores. Measure representative production-like pages before launch, record limitations and findings, and address material failures. A successful build is not performance measurement.

## 20. Security / Privacy Requirements

Secrets, provider/API/email credentials, and privileged configuration must remain server-only. Never expose them through `NEXT_PUBLIC_*`, client props, source control, logs, documentation, or tool output. Separate development, preview, and production configuration and document required names without real credentials.

Public forms need server-side type/format/length validation, spam protection, rate limiting/abuse controls, and safe errors. Client-side validation is a usability aid. Treat selections, attribution, attachments, and other submitted fields as untrusted input. Apply least privilege and minimize personal data collection/logging. Do not expose raw provider failures or credential-bearing errors to users.

Finalize secure headers/CSP alongside hosting, rendering, and approved integrations; do not add policies that silently break required scripts or static rendering. Privacy/legal wording, retention, consent behavior, and operational access requirements must be approved before production launch. Do not select providers, invent policies, or assume authentication/customer portals are required.

## 21. Analytics / Measurement Requirements

Conceptually support page views; service interest; package interest; package comparisons; CTA interactions; consultation starts/submissions; proposal starts/submissions; enterprise enquiries; qualified lead attribution; and Web Vitals.

Events must distinguish intent, attempt, successful receipt, and operational qualification where applicable. Do not count a CTA click or failed request as a delivered lead. Preserve useful context through stable service/package/industry identifiers and approved attribution fields. Event schemas must avoid unnecessary personal data or submitted message contents.

Provider, exact event names, dashboards, consent requirements, and reporting destinations remain **TBF**. Verify approved tracking with real test journeys before launch; do not invent performance scores or conversion results.

## 22. Content/Data Architecture Principle

Services, packages, industries, deliverables, availability, add-ons, FAQs, and related commercial content must use centralized typed sources rather than duplicated hard-coded copies. Route summaries, detail pages, comparisons, CTAs, SEO, and enquiry selections must agree on record identity and approved facts.

Use explicit models for approved, TBF, custom, and unavailable/not-applicable information where needed; unknown data must not silently become an offer. Validate relationships and published availability. M4 finalizes model/storage choices without assuming a CMS, database, or vendor. Build the smallest maintainable architecture that supports approved requirements.

## 23. Admin / Operational Requirements

The MVP website must deliver usable enquiries to the approved operational workflow. Lead receipt, notification, follow-up ownership, and status handling must be clear and verifiable. This does not require a speculative custom admin application.

Future administration capability may cover enquiries, lead status, package/service content updates, pricing changes, availability, case studies, insights/blog, FAQs, and SEO fields. Content/commercial updates must preserve approval history and cross-page consistency.

Assignment, internal notes, CMS/admin interfaces, authentication, roles, storage, and publishing workflow are later scoped decisions. No CMS has been selected. Operational administration may occur outside the website through an approved process; internal tooling must not be assumed as an MVP launch dependency.

## 24. Integrations — TBF

| Integration category | Decision status |
| --- | --- |
| Email provider and notification routing | TBF; receiving addresses and sender configuration require confirmation. |
| Analytics | TBF; provider, events, and consent requirements unresolved. |
| CRM | TBF; no product or synchronization workflow selected. |
| Chatbot/support provider or implementation | TBF; capability and implementation subject to approved M8 scope. |
| Spam protection | TBF; approach must suit accessible public enquiries. |
| Rate-limit persistence | TBF; must suit hosting/runtime and abuse-control requirements. |
| Hosting/deployment specifics | TBF; production/preview configuration and domain verification required. |
| Monitoring/error reporting | TBF; routing, privacy, and operational ownership unresolved. |
| CMS if needed | TBF; do not assume a CMS or admin platform is necessary. |

No category establishes an approved provider, credentials, API contract, account, pricing, or implemented connection. Do not add speculative dependencies or integrations.

## 25. Explicit MVP Exclusions / Deferred Decisions

- Ecommerce checkout/payment unless separately approved later.
- Invented pricing, setup fees, quantities, frequencies, budgets, limits, discounts, commitments, timelines, guarantees, or achieved results.
- Unsupported provider integrations, partnerships, credentials, or third-party configuration.
- Unnecessary authentication/customer portal unless later approved.
- Speculative admin/CMS systems or automatic enterprise proposal/pricing engines.
- Full dark mode unless later approved; approved navy contrast sections remain compatible with the light-first design.
- Heavy visual-effect libraries and distracting motion without a justified approved requirement.

Deferred decisions must remain recorded rather than silently resolved through implementation. Architectural support for future content does not require publishing every service family, industry, or article at launch.

## 26. Milestone Mapping

| Milestone | Responsibility and current relationship |
| --- | --- |
| M0 | Environment/setup foundation; complete according to the approved baseline. |
| M1 | Git/GitHub foundation; complete. |
| M2 | Next.js foundation; complete. |
| M3 | Design-system foundation; implemented, awaiting final Step 0 checkpoint and outstanding rendered QA. Preserve existing work. |
| Step 0 | Repository audit, synchronization, requirements documentation, and authorized freeze/checkpoint. Currently in progress. |
| M4 | Architecture, final route decisions, and centralized typed content/data models. |
| M5 | Core conversion UX and production homepage. |
| M6 | Services and packages, including their discovery/evaluation content. |
| M7 | Industries and authority content. |
| M8 | Enterprise, lead operations, enquiry system, and chatbot as approved. |
| M9 | SEO, analytics, and security/privacy integration. |
| M10 | QA, performance verification, and deployment. |
| M11 | Operational launch, verified workflows, and documented ownership. |

Cross-cutting accessibility, security, content integrity, and performance apply during every implementation milestone; they are not postponed until final QA. Documenting future work does not authorize starting it. Do not commit/push without explicit authorization or declare a milestone/checkpoint complete without actual verification.

## 27. Acceptance Framework

Each implemented requirement must be traceable to this baseline and verified through checks appropriate to its behavior:

| Evidence | Expected verification |
| --- | --- |
| Source review | Scope, approved content, centralized types/tokens, valid relationships, secrets protection, and maintainability. |
| Lint | Run the repository lint command and fix relevant failures; production build does not replace lint. |
| TypeScript/build | Verify types and production build with installed tooling; report external/preexisting blockers precisely. |
| Responsive browser QA | Review representative widths including 320, 375, 768, 1024, 1440, and 1920px; inspect intermediate widths, long content, and reflow without device-specific hacks. |
| Keyboard/accessibility QA | Check skip links, focus/order, menus, contrast, labels, validation/status messages, zoom, and reduced motion. |
| Functional testing | Verify discovery, comparisons, selection context, enquiry receipt, notifications, and failure/abuse behavior as implemented. |
| SEO checks | Inspect rendered metadata, verified canonicals, indexing rules, sitemap, social previews, internal links, and truthful structured data. |
| Performance measurement | Measure representative production-like pages where applicable; record findings rather than assuming scores. |

Tests should verify meaningful behavior rather than mirror static markup. Preserve unrelated work, inspect the final diff, and report changed files and actual results. Documentation-only tasks require content/encoding/whitespace/scope verification, not unnecessary application builds. Missing evidence remains outstanding; do not report an unrun check as passed.

## 28. Pending Decisions Register

All entries below remain unresolved. The register identifies inputs, not invented owners, deadlines, or answers.

| Pending decision | Status / implementation dependency |
| --- | --- |
| Final package pricing and billing basis | TBF; required for any factual published price/approved commercial proposal. |
| Exact quantities/frequencies and scope limits | TBF; required before numeric inclusions or unlimited-scope claims. |
| Setup fees | TBF; distinguish unknown from an approved no-fee offer. |
| Commitment terms and timelines | TBF; required before contractual or turnaround claims. |
| Production domain/origin confirmation | TBF; required for production deployment, canonicals, and absolute SEO URLs. |
| Hosting/deployment provider/configuration | TBF; affects environments, security controls, persistence, and rollback. |
| Email provider and receiving addresses | TBF; required for verified enquiry notification delivery. |
| Analytics provider | TBF; exact events, consent treatment, and destinations require approval. |
| CRM | TBF; no system or synchronization process chosen. |
| Chatbot implementation/provider | TBF; subject to approved scope and verified behavior. |
| Spam/rate-limit approach | TBF; required before public enquiry endpoints are operational. |
| Privacy/legal wording | TBF; requires approved production content and data-handling requirements. |
| Licensed font availability | TBF; the approved fallback remains valid until lawful assets are available. |
| Final production assets | TBF; verify identity, rights, and suitability before publication. |
| Verified case studies/testimonials | TBF; omit or defer unsupported evidence rather than fabricate it. |
| Detailed enterprise policies | TBF; service selection, proposal/scoping, attachment handling, and commercial terms require approval. |
| Monitoring/error reporting and CMS if needed | TBF; resolve only where approved operational scope requires them. |

Use explicit TBF/custom handling during development. Determine whether unresolved launch-facing content should be approved, clearly disclosed, omitted, or deferred; do not silently convert missing decisions into facts.

## 29. Change Control

This approved document is the product baseline. Future changes must be explicitly approved and recorded. Do not silently overwrite approved requirements.

Record the changed requirement/section, approval reference, rationale, and milestone/acceptance impact for an approved revision. Keep product requirements and engineering guidance in `AGENTS.md` consistent through separately authorized edits. An implementation shortcut, provider limitation, generated artifact, or missing business value does not authorize changing the baseline.

If requirements and implementation appear to conflict, preserve existing work, identify the conflict, and obtain explicit direction for the affected scope. Do not fabricate a resolution or treat TBF as approval. This Step 0.6 task creates only this document and does not change any other repository file.

## 30. Definition of MVP Operational

The MVP is operational only when the applicable launch requirements are verified:

- Production site is deployed on a verified domain/origin with correct environment configuration.
- Core approved routes and discovery/conversion paths function end-to-end.
- Services/packages/industries are populated with approved content for the agreed launch scope.
- Responsive and accessibility QA are complete, with material issues resolved and evidence recorded.
- Enquiries preserve context, validate server-side, receive abuse protection, and reach the intended operational process.
- Notifications are verified; failures produce safe, accurate outcomes rather than false success.
- Approved analytics/conversion tracking is verified, including success/attempt distinctions and relevant attribution.
- Security/privacy and technical SEO launch checks are complete.
- No fabricated or TBF content is accidentally exposed as factual production content; unresolved values are approved for disclosure, omitted, or deferred explicitly.
- Performance has been measured and material findings addressed; no invented scores or unverified compliance claims are published.
- Version control and an available rollback/recovery process support the deployment.
- Operational ownership for enquiries, content updates, monitoring, and launch follow-up is documented.

M0–M3 completion, requirements approval, or a successful build alone does not establish an operational MVP. M11 operational launch depends on verified customer journeys and the agreed production/operational checks above.
