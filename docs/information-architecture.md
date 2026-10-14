# Swift Market LLC — Production Information Architecture

**M4.1 architecture proposal — documentation only.** Product authority: [MVP Requirements v3.0](mvp-requirements-v3.0.md). Engineering authority: [AGENTS.md](../AGENTS.md). Operations/setup: [README](../README.md). Verification: [QA checklist](qa-checklist.md).

Verified starting point: clean repository at `baf5213` (`chore: freeze approved pre-M4 foundation`). The user confirms Step 0 is complete; older status wording in governing files is a historical checkpoint snapshot. This document does not edit those sources or claim rendered QA is complete. Current `app/` contains the M3 preview, root layout, global CSS, accessible not-found page, and starter favicon. No production route is created here.

Route names, navigation grouping, publication priorities, and data relationships below are proposals derived from the approved baseline, not new business facts or implemented capabilities. MVP means proposed core launch architecture; Future means deferred expansion; Conditional/TBF means publication needs an unresolved content/offer/legal decision. Every route, including MVP routes, still requires approved content and functioning behavior before launch. URL paths are relative; production origin remains TBF.

## 1. Architecture objectives

Organize a U.S.-market digital growth, marketing, creative, web/app, AI/automation, and technology consultancy into clear discovery, evaluation, and enquiry paths. Preserve the approved M3 light-mode foundation, accessible semantics, controlled reading widths, and mobile-first behavior.

Use shared templates and centralized typed records so services, industries, packages, comparisons, SEO, and enquiries agree. One intent should have one authoritative page. Prioritize useful content over a large page count; preserve unknowns rather than inventing scope or commercial values.

## 2. Primary user types

| User type | Primary need |
| --- | --- |
| Startup prospect | Understand options and choose guidance or one of three tiers |
| Growing Business prospect | Evaluate existing needs against three tiers |
| Enterprise prospect | Combine services and describe custom requirements |
| Individual-service / one-time project prospect | Enquire without a recurring package |
| Add-on prospect | Understand approved compatibility and additional scope |
| Agency/partnership prospect | Explain a collaboration opportunity without assumed partnership terms |


## 3. Primary conversion goals

Request a Consultation, Request a Proposal, and Send a Project Brief are primary conversion goals. Partnership discussion is a specialized enquiry. Discover -> evaluate -> select/reference -> submit -> verified receipt -> operational follow-up -> proposal/onboarding.

No checkout, cart, payment, subscription purchase, automatic contract, or automatic enterprise pricing is proposed. An interest selection is not a finalized scope. Track attempt separately from receipt and later qualification when analytics is approved.

## 4. Global navigation architecture

Proposed main navigation: Services, Packages, Enterprise, Industries, About, plus a clearly differentiated Request a Consultation action. Brand/home link returns to `/`. Services exposes approved family links and individual/project guidance; Packages exposes the two segment hubs and comparison. Contact and Partnerships remain available as utility/footer links.

Insights and Case Studies become navigation destinations only when their conditional content exists. Do not render empty links or all 22 families merely to fill a menu. Grouping is editorial organization, not additional service families or automatic package inclusion.

## 5. Complete proposed sitemap

The following register is the complete proposed route inventory for this document. Fixed core routes, family candidates, industry candidates, and optional/expansion patterns are enumerated here and in Sections 9 and 17. Bracketed segments denote templates, not literal URLs. Sections outside the inventory refer to these same routes; aliases are not additional pages.

| Proposed route | Class | Search intent / user intent | Target audience | Primary CTA | Parent route | Relationships |
| --- | --- | --- | --- | --- | --- | --- |
| / | MVP | Brand discovery and solution orientation | All U.S.-market prospects | Request a Consultation | None | Entry to services, packages, enterprise, industries |
| /about | MVP | Company evaluation | All prospects and partners | Request a Consultation | / | Verified company context; links to capabilities/proof |
| /services | MVP | Capability discovery | All business segments; individual-service prospects | Request a Consultation | / | Family directory; individual/project entry; package links |
| /packages | MVP | Recurring solution evaluation | Startup and Growing Business prospects | Compare Packages | / | Segment hubs; custom enterprise alternative |
| /packages/startup | MVP | Startup package evaluation | Startup Business | Request a Proposal | /packages | Exactly Basic, Standard, Premium; approved service references |
| /packages/startup-basic | MVP | Startup Basic scope evaluation | Startup Business | Request a Proposal | /packages/startup | Startup + Basic record; approved services/add-ons |
| /packages/startup-standard | MVP | Startup Standard scope evaluation | Startup Business | Request a Proposal | /packages/startup | Startup + Standard record; approved services/add-ons |
| /packages/startup-premium | MVP | Startup Premium scope evaluation | Startup Business | Request a Proposal | /packages/startup | Startup + Premium record; approved services/add-ons |
| /packages/growing-business | MVP | Growing Business package evaluation | Growing Business | Request a Proposal | /packages | Exactly Basic, Standard, Premium; approved service references |
| /packages/growing-business-basic | MVP | Growing Business Basic scope evaluation | Growing Business | Request a Proposal | /packages/growing-business | Growing Business + Basic record; approved services/add-ons |
| /packages/growing-business-standard | MVP | Growing Business Standard scope evaluation | Growing Business | Request a Proposal | /packages/growing-business | Growing Business + Standard record; approved services/add-ons |
| /packages/growing-business-premium | MVP | Growing Business Premium scope evaluation | Growing Business | Request a Proposal | /packages/growing-business | Growing Business + Premium record; approved services/add-ons |
| /packages/compare | MVP | Compare approved package scope | Startup and Growing Business | Request a Proposal | /packages | Same six records; segment-aware comparison; enterprise alternative |
| /enterprise | MVP | Custom growth-stack evaluation | Enterprise decision makers | Request a Consultation | / | Custom service selection; industry/context relationships |
| /industries | MVP | Industry solution discovery | Prospects seeking sector relevance | Request a Consultation | / | Published industry records linked to relevant services/packages |
| /consultation | MVP | Request guidance on business needs | Any prospect, including undecided visitors | Request a Consultation | / | Optional validated service/package/industry context |
| /proposal | MVP | Request scoped proposal | Package, project, individual-service, enterprise prospects | Request a Proposal | / | Selected records/context; no purchase or contract |
| /contact | MVP | General enquiry and project brief | All prospects and partners | Send a Project Brief | / | Enquiry type plus optional solution context |
| /privacy | MVP | Understand disclosed data handling | Visitors and form users | Contact with a privacy question | / | Approved disclosure for forms/integrations; wording TBF |

| Proposed route | Class | Search intent / user intent | Target audience | Primary CTA | Parent route | Relationships |
| --- | --- | --- | --- | --- | --- | --- |
| /services/[familySlug]/[serviceSlug] | Conditional/TBF | Distinct individual service intent | Prospects with a specific approved need | Request a Proposal | /services/[familySlug] | Approved service in that family; optional package/add-on links |
| /projects | Conditional/TBF | One-time project discovery | Project prospects | Send a Project Brief | / | Optional collection of approved project offerings; no duplicated services |
| /add-ons | Conditional/TBF | Evaluate compatible additions | Package/service prospects | Request a Proposal | / | Approved add-on records and compatibility; initially embedded instead |
| /case-studies | Conditional/TBF | Evaluate verified work | Business prospects | Request a Consultation | / | Only supplied, verified, approved evidence; linked solutions |
| /case-studies/[slug] | Conditional/TBF | Evaluate a specific verified engagement | Relevant segment/industry prospects | Request a Consultation | /case-studies | Approved case and service/industry/package references where factual |
| /insights | Conditional/TBF | Find useful educational content | Prospects researching problems | Explore Services | / | Approved articles related to services/industries |
| /insights/[slug] | Conditional/TBF | Answer a distinct informational question | Relevant researching prospects | Request a Consultation | /insights | Article links to relevant published services/industries |
| /terms | Conditional/TBF | Understand approved website terms | Visitors | Contact with a terms question | / | Legal need and wording subject to approval |
| /cookies | Conditional/TBF | Understand cookie/tracking behavior | Visitors | Review privacy information | / | Only if approved tracking/legal requirements warrant it |
| /thank-you | Conditional/TBF | Submission acknowledgement; no search target | Visitors after verified receipt | Return to homepage | / | Optional noindex utility; inline confirmation is valid alternative |
| /insights/topics/[topicSlug] | Future | Browse a substantial topic collection | Researching prospects | Explore related services | /insights | Only after enough distinct approved articles exist |

All 22 family candidates in Section 9 and all 11 industry candidates in Section 17 are Conditional/TBF until the launch content subset is selected. The service-family template is `/services/[familySlug]`; the industry template is `/industries/[industrySlug]`. Each template inherits the class and fields of its concrete candidate rows. The existing unmatched-route 404 is a system fallback, not a selectable sitemap page; it has no search intent, serves lost visitors, offers Return to homepage, and remains noindex. Do not publish `/_not-found` as a navigation URL.

## 6. Route hierarchy

Home is the information root. Services -> family -> individual service only when the child has distinct approved intent. Packages -> segment -> tier, with comparison as a sibling of segment hubs. Industries -> industry detail. Conditional Case Studies and Insights hubs -> record details; future topic collections sit below Insights. Enterprise and conversion destinations remain top-level for straightforward access.

Use `/packages` as the single Plans/Packages URL, `/insights` for Insights/Blog, and `/case-studies` for Case Studies/Portfolio evidence rather than creating parallel synonym pages. Use lowercase descriptive hyphenated slugs with stable IDs independent of display names. Unpublished/unknown slugs should use the existing accessible not-found behavior when routes are implemented.

## 7. Homepage role

The future homepage explains the approved positioning, helps users choose a discovery path, introduces package segments and custom enterprise scope, and presents verified proof only where available. It routes undecided users to consultation and specific requests to proposal/project brief.

It must not duplicate every service detail, fabricate metrics, or promise unapproved offers. Replace the internal preview only during authorized production homepage implementation; the current `/` remains temporary/noindex until then.

## 8. Services architecture

The Services hub is the canonical capability directory. Organize all approved families through shared records, concise summaries, verified availability, and relevant links. Published family pages carry the authoritative family intent; distinguish a concrete service child only when it answers a materially different question.

Individual services, ongoing work, one-time projects, and add-ons are engagement modes, not four duplicate service catalogs. A single service identity can be referenced in several modes without creating equivalent URLs.

## 9. Service-family architecture using the approved 22 service families

All family names below are preserved exactly from the approved baseline. Slugs and search intents are proposed editorial architecture, not evidence of current service availability. Every family row uses Request a Consultation as its primary CTA, `/services` as parent, and relationships to its approved service records, compatible package records, and relevant industry records; those specific relationships remain TBF until verified in later M4 data work.

| Approved family | Proposed route | Class | Search intent | Target audience | Primary CTA / parent / relationships |
| --- | --- | --- | --- | --- | --- |
| Strategy & Consulting | /services/strategy-consulting | Conditional/TBF | Strategy and consulting support | Business decision makers | Request a Consultation; /services; approved services/packages/industries |
| SEO | /services/seo | Conditional/TBF | Organic search service evaluation | Businesses seeking organic discovery | Request a Consultation; /services; approved services/packages/industries |
| Local SEO | /services/local-seo | Conditional/TBF | Local search and GBP support | Businesses with verified local needs | Request a Consultation; /services; approved services/packages/industries |
| AI Search Visibility | /services/ai-search-visibility | Conditional/TBF | AI search visibility support | Businesses evaluating AI search discovery | Request a Consultation; /services; approved services/packages/industries |
| Authority & PR | /services/authority-pr | Conditional/TBF | Authority and digital PR services | Businesses evaluating authority-building work | Request a Consultation; /services; approved services/packages/industries |
| Paid Advertising | /services/paid-advertising | Conditional/TBF | Paid advertising management | Businesses considering paid acquisition | Request a Consultation; /services; approved services/packages/industries |
| Specialist Campaigns | /services/specialist-campaigns | Conditional/TBF | Channel-specific advertising support | Businesses evaluating an approved channel | Request a Consultation; /services; approved services/packages/industries |
| Social Media | /services/social-media | Conditional/TBF | Social management services | Businesses seeking managed social activity | Request a Consultation; /services; approved services/packages/industries |
| Content Marketing | /services/content-marketing | Conditional/TBF | Content marketing support | Businesses evaluating content programs | Request a Consultation; /services; approved services/packages/industries |
| Branding & Design | /services/branding-design | Conditional/TBF | Brand and graphic design services | Businesses and project prospects | Request a Consultation; /services; approved services/packages/industries |
| Photo & Video | /services/photo-video | Conditional/TBF | Video and creative production services | Businesses with creative/project needs | Request a Consultation; /services; approved services/packages/industries |
| Website Development | /services/website-development | Conditional/TBF | Website design/development evaluation | Businesses needing web projects | Request a Consultation; /services; approved services/packages/industries |
| App / MVP Development | /services/app-mvp-development | Conditional/TBF | App and MVP development evaluation | Businesses seeking product/project development | Request a Consultation; /services; approved services/packages/industries |
| Website Care | /services/website-care | Conditional/TBF | Website maintenance support | Businesses with existing websites | Request a Consultation; /services; approved services/packages/industries |
| Conversion Optimization | /services/conversion-optimization | Conditional/TBF | Conversion optimization services | Businesses evaluating conversion improvement | Request a Consultation; /services; approved services/packages/industries |
| Email & SMS | /services/email-sms | Conditional/TBF | Email/SMS marketing services | Businesses evaluating lifecycle marketing | Request a Consultation; /services; approved services/packages/industries |
| CRM & Automation | /services/crm-automation | Conditional/TBF | CRM and marketing automation services | Businesses evaluating marketing operations | Request a Consultation; /services; approved services/packages/industries |
| AI & Automation | /services/ai-automation | Conditional/TBF | AI automation service evaluation | Businesses evaluating approved automation needs | Request a Consultation; /services; approved services/packages/industries |
| B2B Marketing | /services/b2b-marketing | Conditional/TBF | B2B marketing and lead support | B2B businesses | Request a Consultation; /services; approved services/packages/industries |
| Analytics & Tracking | /services/analytics-tracking | Conditional/TBF | Measurement and reporting services | Businesses evaluating measurement needs | Request a Consultation; /services; approved services/packages/industries |
| Business Technology & Integrations | /services/business-technology-integrations | Conditional/TBF | Business system integration support | Businesses evaluating integration projects | Request a Consultation; /services; approved services/packages/industries |
| Enterprise Leadership | /services/enterprise-leadership | Conditional/TBF | Enterprise growth leadership evaluation | Enterprise decision makers | Request a Consultation; /services; approved services/packages/industries |

Paid Advertising owns broad management intent. Specialist Campaigns owns channel selection intent; its potential children require distinct content, not a duplicate PPC page. SEO, local search, and AI search retain separate approved scope/intents. Enterprise Leadership explains that service family; `/enterprise` explains the custom buying journey and selection process.

## 10. Individual service page architecture

For a distinct approved service, the nested detail template includes identity, audience/problems, approved scope/deliverables, process, intended outcomes without guarantees, limitations/exclusions, external costs, applicable engagement modes, approved FAQs, related services, relevant industries, package references, and contextual enquiry CTA.

A family page can itself serve an individual-service prospect; child pages are not mandatory. The child route is Conditional/TBF until both a record and distinct intent exist. Do not create a flat duplicate of the nested page, use arbitrary channel/provider claims, or publish empty pages.

## 11. Packages architecture

Use one package hub, two segment hubs, six tier detail routes, and one shared comparison route. Model segment and tier separately with stable package identity. Enterprise is linked as a custom alternative, never a fourth tier.

Cards, detail pages, comparison, CTAs, and enquiries reference the same approved records. Content must distinguish service fees, ad/media spend, and external software/platform/tool, hosting, asset, and production costs. Those costs are separate unless explicitly included. Prices, cadence, fees, quantities, limits, commitments, turnaround, guarantees, SLAs, and policies remain TBF until approved.

## 12. Startup Business package architecture

Exactly three tiers: **Basic**, **Standard**, **Premium**. Routes are the three `/packages/startup/` detail rows in Section 5. The segment hub explains suitability using approved content and offers comparison, proposal, or guidance.

Tier labels do not establish deliverables, budgets, eligibility thresholds, or value rankings. Each record may link only to explicitly approved services and compatible add-ons; missing inclusions remain unknown rather than borrowed from another tier.

## 13. Growing Business package architecture

Exactly three tiers: **Basic**, **Standard**, **Premium**. Routes are the three `/packages/growing-business/` detail rows in Section 5. The segment hub supports comparison and contextual proposal requests for existing business needs.

The same tier name in Startup and Growing Business does not mean the same scope or price. Comparison identifies segment and tier together; no fourth tier or fabricated commercial progression is introduced.

## 14. Enterprise architecture

`/enterprise` presents **Build Your Growth Stack** as consultation-led custom service selection. Visitors can identify goals, relevant approved services, industry, existing systems, and needs beyond predefined packages. The selected stack is context for consultation/custom proposal, not an automatically priced offer.

Allow a visitor to request guidance without making selections. Preserve selected service IDs into consultation/proposal and operational review. Service budget and advertising budget remain separate; no invented budget bands, minimums, timelines, attachment policies, or service guarantees. Detailed fields, attachments, implementation, and enterprise policies remain TBF.

## 15. Individual services / one-time projects architecture

Visitors can enter through Services, a family/detail page, an industry relationship, or Contact. Send a Project Brief uses `/contact`; Request a Proposal uses `/proposal` with the relevant service and project-mode context. No recurring package is required.

A standalone `/projects` collection is Conditional/TBF, justified only by distinct approved project offerings and useful discovery content. It should reference canonical services rather than duplicate their pages. One-time scoping, timing, and commercial terms stay TBF.

## 16. Add-ons architecture

Represent approved add-ons as records related to compatible services/packages with explicit separate scope, availability, exclusions, and cost status. Start with contextual sections on existing pages; `/add-ons` is conditional if an approved catalog warrants its own intent.

Selecting an add-on updates enquiry context only. Compatibility is verified server-side in future lead handling; do not infer that all add-ons apply to all tiers or imply automatic inclusion, instant fulfillment, or a purchase.

## 17. Industries architecture

Use a shared Industries hub and distinct, approved sector pages. Each includes meaningful sector-specific needs, relevant service relationships, suitable package/custom paths, verified proof if supplied, FAQs, and enquiry CTA. Priority sectors are representative; publication breadth remains a launch decision.

| Proposed route | Class | Search intent / user intent | Target audience | Primary CTA | Parent route | Relationships |
| --- | --- | --- | --- | --- | --- | --- |
| /industries/healthcare | Conditional/TBF | Healthcare solution evaluation | Healthcare businesses | Request a Consultation | /industries | Approved industry-to-service/package references; no assumed inclusions |
| /industries/real-estate | Conditional/TBF | Real Estate solution evaluation | Real Estate businesses | Request a Consultation | /industries | Approved industry-to-service/package references; no assumed inclusions |
| /industries/home-services | Conditional/TBF | Home Services solution evaluation | Home Services businesses | Request a Consultation | /industries | Approved industry-to-service/package references; no assumed inclusions |
| /industries/ecommerce | Conditional/TBF | Ecommerce solution evaluation | Ecommerce businesses | Request a Consultation | /industries | Approved industry-to-service/package references; no assumed inclusions |
| /industries/saas-ai-technology | Conditional/TBF | SaaS / AI / Technology solution evaluation | SaaS / AI / Technology businesses | Request a Consultation | /industries | Approved industry-to-service/package references; no assumed inclusions |
| /industries/restaurants-franchises | Conditional/TBF | Restaurants / Franchises solution evaluation | Restaurants / Franchises businesses | Request a Consultation | /industries | Approved industry-to-service/package references; no assumed inclusions |
| /industries/legal | Conditional/TBF | Legal solution evaluation | Legal businesses | Request a Consultation | /industries | Approved industry-to-service/package references; no assumed inclusions |
| /industries/education | Conditional/TBF | Education solution evaluation | Education businesses | Request a Consultation | /industries | Approved industry-to-service/package references; no assumed inclusions |
| /industries/finance | Conditional/TBF | Finance solution evaluation | Finance businesses | Request a Consultation | /industries | Approved industry-to-service/package references; no assumed inclusions |
| /industries/automotive | Conditional/TBF | Automotive solution evaluation | Automotive businesses | Request a Consultation | /industries | Approved industry-to-service/package references; no assumed inclusions |
| /industries/b2b-professional-services | Conditional/TBF | B2B / Professional Services solution evaluation | B2B / Professional Services businesses | Request a Consultation | /industries | Approved industry-to-service/package references; no assumed inclusions |
| /industries/travel-hospitality | Conditional/TBF | Travel / Hospitality solution evaluation | Travel / Hospitality businesses | Request a Consultation | /industries | Approved industry-to-service/package references; no assumed inclusions |
| /industries/beauty | Conditional/TBF | Beauty solution evaluation | Beauty businesses | Request a Consultation | /industries | Approved industry-to-service/package references; no assumed inclusions |
| /industries/fitness | Conditional/TBF | Fitness solution evaluation | Fitness businesses | Request a Consultation | /industries | Approved industry-to-service/package references; no assumed inclusions |
| /industries/fashion | Conditional/TBF | Fashion solution evaluation | Fashion businesses | Request a Consultation | /industries | Approved industry-to-service/package references; no assumed inclusions |
| /industries/construction | Conditional/TBF | Construction solution evaluation | Construction businesses | Request a Consultation | /industries | Approved industry-to-service/package references; no assumed inclusions |
| /industries/logistics | Conditional/TBF | Logistics solution evaluation | Logistics businesses | Request a Consultation | /industries | Approved industry-to-service/package references; no assumed inclusions |
| /industries/recruitment | Conditional/TBF | Recruitment solution evaluation | Recruitment businesses | Request a Consultation | /industries | Approved industry-to-service/package references; no assumed inclusions |

Serving Ecommerce clients does not introduce purchasing into this website. Regulated-sector references do not establish compliance expertise, certifications, or approved policies.

## 18. Industry-to-service relationship model

Use many-to-many references between stable industry and service IDs with editorial relevance and publication status. Associations explain a verified need; they do not create an offer, guarantee, or package inclusion. Resolve only published, approved related records into links.

Do not prepopulate every industry with every service. Industry pages link to canonical service content and add distinct sector guidance. Reciprocal service links use the same source rather than independently maintained lists.

## 19. Service-to-package relationship model

Use explicit package-service relationships, distinguishing included scope from optional add-ons, exclusions, and merely related discovery content. Carry approved quantity/frequency/status where known; represent TBF/custom/unavailable separately.

A family-level association does not include all its child services. Services may participate in multiple packages and engagement modes, but segment/tier inclusions must be independently approved. Comparison and enquiry validation read the same relationship definitions.

## 20. Package-to-enquiry relationship model

Selecting a tier leads to `/proposal` with stable package identity and visible segment/tier context. Carry approved optional service/add-on/industry selections as relevant; users can revise their interest before submitting.

Future implementation validates IDs, allowed relationships, publication status, and input lengths server-side. URL/query context is untrusted and must contain no sensitive message/contact data. Context transport details are TBF; query variants are not new indexable pages. A submission does not reserve a package or establish a contract.

## 21. Agency partnership architecture

`/partnerships` explains how to express an agency/strategic collaboration interest without implying existing partners, white-label capabilities, commission arrangements, exclusivity, or approved commercial policies. Its CTA enters `/contact` with partnership enquiry type.

Gather organizational context and desired collaboration only as approved; route receipt into the same operational lead workflow with a distinguishable enquiry type. Partnership terms, field requirements, and routing remain TBF.

## 22. Consultation architecture

`/consultation` accepts requests for guidance with optional service/package/industry or enterprise context. Visitors need not choose a package first. A request is not a confirmed appointment; avoid Book a Consultation unless the later approved process supports that wording.

Availability, scheduling provider, meeting format, response commitments, and routing are TBF. Accessible server-validated receipt, notifications, failure recovery, spam/rate controls, and privacy approval are required before this conversion route operates publicly.

## 23. Contact/enquiry architecture

`/contact` supports general enquiries, individual-service/project briefs, and partnership enquiries. `/proposal` handles explicit scoping requests; `/consultation` handles guidance. These routes may share one form model and server workflow with purpose-specific copy and fields, avoiding separate incompatible lead stores.

Receipt -> New -> Contacted -> Proposal Sent -> Won / Lost is the approved conceptual operational model. Assignment/notes are later scoped capabilities, not an admin-portal requirement. Provider, delivery addresses, persistence, required fields, consent, retention, duplicate handling, and thank-you implementation remain TBF. Never claim successful receipt without successful approved handling.

## 24. Free audit architecture if supported by approved requirements

Requirements Section 10 permits Get a Digital Audit as a content variant only when destination and offer are approved. It does **not** approve a free audit, eligible audience, scope, deliverables, price, turnaround, or guarantee.

`/digital-audit` is Conditional/TBF. Until the offer and receiving workflow are approved, omit that route/link and use consultation instead. If approved later, model it as an enquiry with approved offer context; only use the word free if its terms and cost are explicitly confirmed. No automatic scan/report provider is selected.

## 25. Resource/content architecture

Use `/insights` and `/insights/[slug]` for approved educational articles, with stable content IDs, author/date facts only when verified, related solution IDs, and deliberate CTAs. The conditional content capability belongs to the MVP baseline, while its publication inventory remains dependent on supplied content.

Future topic collections require a substantial useful corpus and unique intent. Do not expose thin tag/filter archives, duplicate category URLs, or a second Blog destination with equivalent content. CMS, search, newsletter, and editorial tooling are not selected here.

## 26. About/company architecture

`/about` presents verified positioning, capabilities, and approved company information, with links to relevant Services, Enterprise, and proof. Do not fabricate team, history, offices, telephone, certifications, partnerships, awards, or operational promises.

Missing company evidence must be approved, omitted, or deferred. Separate team/careers/location pages are not proposed launch requirements; any future addition requires verified content and distinct audience intent.

## 27. Trust/proof architecture

Use contextual proof only when supplied, verified, and approved. Proposed canonical work/evidence routes are `/case-studies` and `/case-studies/[slug]`, conditional on real content and publication rights. Project format can be represented within this collection rather than adding a duplicate Portfolio hierarchy.

Case records may link to services/industry/packages only where factual. Testimonials and logos are evidence modules, not invented reviews or standalone search pages. If proof is absent, rely on truthful process/scope clarity and omit empty proof collections.

## 28. Legal/privacy architecture

`/privacy` is proposed MVP because lead collection needs approved disclosure. Its wording, responsible business details, data practices, retention, consent, and contact mechanism require approval before publication. `/terms` and `/cookies` remain conditional according to legal/integration requirements.

Do not draft policies from assumptions, name vendors not selected, or assert compliance certification. Legal pages are informational utility destinations, not marketing lead pages. Conversion forms must link to relevant published disclosures.

## 29. Footer information architecture

Proposed groups: Company (About, Contact, Partnerships); Solutions (Services, Packages, Enterprise, Industries); conditional Resources (Insights, Case Studies); Legal (Privacy and applicable approved policies). Include consultation as a clear next step.

Use the same approved navigation/data sources as other links. Publish only existing destinations; no invented social profiles, addresses, phones, badges, or provider details. Footer implementation is deferred; this is information architecture only.

## 30. Breadcrumb strategy

Home -> Services -> Family -> Individual service; Home -> Packages -> Segment -> Tier; Home -> Industries -> Industry; Home -> Insights/Case Studies -> Detail. Comparison uses Home -> Packages -> Compare. Top-level utility/conversion pages need only Home -> current page if breadcrumbs are useful.

Breadcrumb parentage follows canonical content hierarchy, not a visitor's previous referrer. Current item is descriptive text; linked ancestors must exist. Structured breadcrumbs are deferred until verified content/origin and SEO implementation. Do not link unpublished conditional parents.

## 31. Internal linking strategy

Create deliberate links from hubs to approved details, details to relevant peers/industries/packages, and every evaluation page to a contextual enquiry. Reverse relationships use shared records. Articles and proof lead to the solution they actually concern.

Avoid all-to-all link blocks, fake locations, keyword-stuffed anchors, dead destinations, and automatic service-industry cross-product pages. Maintain understandable anchor text and useful recovery links, including the existing 404.

## 32. SEO landing-page hierarchy

Home covers brand/company discovery; Services and family/detail pages cover distinct capability intent; Packages covers commercial comparison by segment/tier; Industries covers verified sector needs; approved Insights addresses informational intent; proof supports evaluation.

Maintain one canonical URL per content identity, unique helpful page content, and indexing status explicit in shared data. Production origin, canonicals, metadata, sitemap/robots, social assets, and truthful structured data are later implementation decisions. Consultation/proposal/contact are utility intents, not keyword landing-page factories. Noindex preview and confirmation utilities; never treat noindex as protection for private information.

## 33. Scalable future route strategy

Add approved records under existing templates before adding new top-level destinations. Introduce an individual service child or Insights topic collection only after checking intent overlap and publication readiness. New industries reuse the existing template and relationships rather than cloned sites.

No city-by-service, industry-by-service, provider-by-service, or synonym route matrix is authorized. A future landing page needs independently useful verified content and an explicit route-register decision. Slug changes require a reviewed migration/redirect plan in a later authorized task; avoid link churn.

## 34. CTA hierarchy

| Level | Action | Destination / preserved context |
| --- | --- | --- |
| Primary guidance | Request a Consultation | /consultation; optional approved selection context |
| Primary scoping | Request a Proposal | /proposal; package/service/enterprise context |
| Primary project | Send a Project Brief | /contact; project enquiry type and service context |
| Specialized primary | Discuss a Partnership | /contact; partnership type |
| Secondary discovery | Explore Services | /services and relevant published detail |
| Secondary evaluation | Compare Packages | /packages/compare; segment context |
| Conditional offer | Request an Audit | /digital-audit only after approval; offer context |

Use one dominant action appropriate to page intent with a useful alternative for undecided visitors. Do not use Buy now, promise a free audit, or imply a scheduled meeting/received lead without approved behavior.

## 35. User journeys

Startup prospect: Home/Services -> Packages -> Startup -> Basic, Standard, or Premium -> Compare if needed -> contextual proposal -> verified receipt -> operational follow-up. Consultation remains an alternative at every evaluation stage.

Growing Business prospect: Industry/Services -> Growing Business hub -> three tiers/comparison -> contextual proposal or consultation -> follow-up.

Enterprise prospect: Enterprise or relevant service/industry -> Build Your Growth Stack -> optional approved service selection plus requirements -> consultation/custom proposal -> clarification -> scoped proposal. No price engine or fourth tier.

Individual-service prospect: Services -> family -> distinct child if published -> approved scope/project mode -> proposal or Send a Project Brief -> follow-up without package obligation.

Agency partnership prospect: About/footer -> Partnerships -> partnership-context Contact enquiry -> verified receipt -> operational discussion without presumed terms.

## 36. Desktop navigation model

Use a readable horizontal primary navigation with a clear consultation action. Services and Packages may use accessible disclosure panels to expose published family links and segment/comparison links. Prefer a curated set plus View all over an overwhelming flat 22-link list; exact grouping/content is TBF.

Parent links remain navigable; disclosure buttons have names, expanded state, keyboard operation, and visible focus. Do not require hover to navigate. No desktop header, component, animation, or routing implementation is introduced here.

## 37. Mobile navigation model

Expose the same destinations in a compact menu with expandable service/package groups, Home access, and consultation/contact actions. Avoid hiding enterprise or partnership paths merely because of viewport size; show only published links.

Support logical keyboard order, visible focus, usable touch targets, reduced motion, zoom/reflow, and appropriate close/focus-return behavior. If a modal drawer is chosen later, implement focus management and escape behavior; drawer mechanics remain an implementation decision. Menus must remain usable with long approved names.

## 38. Sitemap-to-conversion mapping

| Route group (all inventory rows covered) | Next step | Context |
| --- | --- | --- |
| Home / About | Consultation or solution discovery | Landing-page source where approved |
| Services / family / individual detail | Consultation or proposal/project brief | Service/family IDs; optional engagement mode |
| Packages / segment / tier / compare | Proposal; consultation if undecided | Package ID with separate segment/tier |
| Enterprise | Consultation/custom proposal | Selected service IDs and custom requirements |
| Industries / industry detail | Consultation or relevant service | Industry ID; approved relevant solutions |
| Partnerships | Contact partnership enquiry | Partnership enquiry type |
| Consultation / proposal / contact | Submit -> verified receipt -> operational process | Validated contextual IDs and approved attribution |
| Projects / Add-ons if published | Project brief/proposal | Approved project/add-on IDs and compatibility |
| Case Studies / Insights / future topics | Relevant solution -> consultation | Factual related solution/content IDs |
| Digital audit if approved | Approved audit request | Approved offer identity; terms TBF |
| Privacy / conditional legal | Understand disclosures; relevant question | No forced marketing conversion |
| Thank-you if used / 404 | Recovery or useful next step | No personal data in URL; never fake confirmation |


## 39. Sitemap-to-SEO mapping

| Inventory group | Indexing/search role once production content is approved |
| --- | --- |
| Home / About | Brand and company evaluation |
| Services and approved family/individual pages | Distinct capability intent; one canonical owner |
| Packages, segment hubs, six tier pages, compare | Distinct commercial evaluation; consolidate a thin detail rather than publish duplicates |
| Enterprise | Custom engagement intent separate from service-family expertise |
| Industries and published industry details | Distinct useful sector needs; no doorway variants |
| Projects / Add-ons | Conditional unique discovery content, otherwise embedded sections |
| Case Studies / Insights / future topic collections | Conditional verified proof or substantive informational content |
| Partnerships | Partnership evaluation |
| Consultation / request-proposal / contact | Utility/enquiry destinations; indexing reviewed at implementation |
| Privacy / Terms / Cookies | Approved legal utility; no fabricated SEO copy |
| Digital audit | Conditional approved offer, no unsupported free claim |
| Thank-you / 404 / current preview | Noindex; excluded from public XML sitemap |

Publication class does not itself grant indexability. Draft/unverified pages stay unpublished; public XML sitemap includes only intended indexable canonical pages. Query/filter/context variants do not multiply sitemap entries.

## 40. MVP routes versus future routes

Proposed fixed MVP route count: **20** (Section 5 core table). This is a core architecture count, not a promise that only 20 pages launch. Concrete approved family/industry/service detail inventory adds pages; the final total is **20 + F + I + S + C**, where F is selected family pages, I industry pages, S distinct individual service children, and C other approved conditional pages. No values for these variables are invented.

All 22 family candidates and 11 industry candidates are preserved as Conditional/TBF publication decisions. The MVP requires useful service/industry discovery and approved detail content for the selected launch scope; conditional classification does not waive those capabilities. Case studies, insights, project/add-on catalogs, audit, additional legal pages, and confirmation URL depend on content/operational decisions. The future topic route is deferred. No login/admin/checkout/customer portal is assumed. All tiers are represented in the proposal; if approved content cannot make a detail useful, any route consolidation requires an explicit architecture decision.

## 41. TBF items

Final slug/navigation endorsement and launch family/industry/individual-service inventory; approved descriptions, FAQs, scope and evidence; exact service-package-industry/add-on relationships; package pricing/billing, fees, quantities, limits, commitments, timing, SLAs and policies; enterprise field/attachment and operational rules; project/add-on standalone catalog need; audit offer and whether it is free; approved company facts/assets/font availability; legal wording, cookie/consent and retention requirements.

Production origin/hosting, canonical/indexing decisions, SEO assets/schema facts, email provider/receiving configuration, persistence/CRM, spam/rate limiting, analytics/events/attribution/consent, chatbot/support, monitoring, and CMS if needed remain TBF. No provider/domain/credential is selected. Approval or explicit omission/deferral is required before launch-facing unknowns become content or promises.

## 42. Acceptance criteria for M4.1

Documentation acceptance is separate from product launch and future implementation verification.

- [ ] All 42 requested areas are represented and traceable to approved requirements.
- [ ] Route inventory classifies every candidate/pattern and gives intent, audience, CTA, parent, and relationships.
- [ ] All 22 approved service families and representative industries are preserved without implying immediate availability.
- [ ] Startup Business has exactly Basic, Standard, Premium.
- [ ] Growing Business has exactly Basic, Standard, Premium.
- [ ] Enterprise remains consultation-led and custom, with approved service selection.
- [ ] Individual services, one-time projects, add-ons, and partnership enquiries remain reachable.
- [ ] Selection leads to enquiry/proposal, with no checkout or automatic contract.
- [ ] Ad/media spend and external costs are separate unless explicitly approved as included.
- [ ] No prices, quantities, guarantees, SLAs, policies, evidence, providers, or domains are fabricated.
- [ ] Data relationships support centralized typed sources in later M4 work.
- [ ] Canonical intent ownership, internal links, breadcrumbs, and publication gates prevent duplicate/thin/doorway pages.
- [ ] Free audit remains conditional on explicit offer approval.
- [ ] Proposed count distinguishes fixed routes from variable content inventory.
- [ ] Only this document is created; M3/source/configuration/dependencies remain untouched.
- [ ] UTF-8, local links, whitespace, full new-file review, and Git scope checks pass.

These are review criteria, not claims that production navigation, routes, data models, SEO, lead delivery, accessibility, or performance are implemented. Future page/feature and launch QA follows the repository checklist.
