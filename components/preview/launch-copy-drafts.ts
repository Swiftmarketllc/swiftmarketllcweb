import type { RouteId, ContentId } from "@/lib/domain";
import type { LaunchPageBodyProps } from "@/components/pages/launch-page-body";

/** Editorial working copy only. Never merged into canonical data or public output. */
type CopyDraft = Readonly<{
  routeId: RouteId;
  contentId: ContentId;
  path: string;
  status: "draft";
  pending: string;
  body: Omit<LaunchPageBodyProps, "cta" | "reviewPrefix">;
}>;

export const launchCopyDrafts: readonly CopyDraft[] = [
  { routeId: "route:home", contentId: "content:home", path: "/", status: "draft",
    pending: "Final positioning, launch capabilities, SEO and working contact destination: TBF.",
    body: { heading: "Digital growth, marketing and technology", summary: "Swift Market LLC is a U.S.-market consultancy spanning marketing, creative, web, app and AI/automation services.",
      sections: [{ id: "overview", heading: "A connected approach", body: "Explore capabilities and discuss the services or project scope that fit your business. The website follows an enquiry and proposal process rather than online checkout." }] } },
  { routeId: "route:services", contentId: "content:services", path: "/services", status: "draft",
    pending: "Confirmed launch services, descriptions, availability and detail links: TBF.",
    body: { heading: "Marketing and technology capabilities", summary: "The service architecture brings together digital growth, marketing, creative production, web and app development, and automation.",
      sections: [{ id: "overview", heading: "Start with your business needs", body: "The approved structure supports individual services, one-time projects and broader service combinations. Specific services, deliverables and availability remain to be finalized before publication." }] } },
  { routeId: "route:industries", contentId: "content:industries", path: "/industries", status: "draft",
    pending: "Launch-sector selection, distinct sector content and relevance mappings: TBF.",
    body: { heading: "Solutions shaped around business context", summary: "Industry targeting is part of Swift Market's approved architecture.",
      sections: [{ id: "overview", heading: "Relevant needs, clear scope", body: "Sector-specific content and service recommendations require approval. The industry candidate inventory does not establish past client experience, specialist credentials or results." }] } },
  { routeId: "route:packages", contentId: "content:packages", path: "/packages", status: "draft",
    pending: "All prices, inclusions, quantities, terms and package recommendations: TBF.",
    body: { heading: "Explore the right service structure", summary: "Startup Business and Growing Business each have Basic, Standard and Premium tiers. Enterprise follows a custom Build Your Growth Stack consultation and proposal process.",
      sections: [{ id: "overview", heading: "Packages and project options", body: "The commercial structure also supports individual services, one-time projects and approved add-ons. Tier names do not establish scope or price." },
        { id: "scope", heading: "Scope and external costs", body: "Pricing, deliverables and service limits remain to be finalized. Advertising/media spend and third-party tools, hosting, premium assets, production and other external costs are separate unless explicitly included in an approved offer." }] } },
  { routeId: "route:about", contentId: "content:about", path: "/about", status: "draft",
    pending: "Owner-approved company narrative and any supporting business facts: TBF.",
    body: { heading: "About Swift Market LLC", summary: "Swift Market LLC is a U.S.-market digital growth, marketing, creative and technology services company.",
      sections: [{ id: "overview", heading: "From needs to a proposal", body: "The approved website journey helps businesses discover a service, industry or package, describe their needs, and request consultation or a proposal. Team details, company history and proof are omitted until verified." }] } },
  { routeId: "route:contact", contentId: "content:contact", path: "/contact", status: "draft",
    pending: "Field approval, delivery, server validation, spam/rate controls and privacy: TBF.",
    body: { heading: "Discuss your project", summary: "Share your business needs and project context through the future enquiry workflow.",
      sections: [{ id: "enquiry", heading: "Enquiry preparation", body: "This internal demonstration cannot send an enquiry. Contact details, receiving configuration and operational approvals remain to be finalized." }] } },
  { routeId: "route:privacy", contentId: "content:privacy", path: "/privacy", status: "draft",
    pending: "All legal wording and data-handling decisions require owner/legal approval: TBF.",
    body: { heading: "Privacy — draft structure", summary: "This is a content outline for review, not a privacy notice or legal commitment.",
      sections: [{ id: "legal", heading: "Information and processing — TBF", body: "Confirm the controller/contact details, information collected, purposes, applicable legal basis, recipients/providers, retention, security description, rights and request process, and any cookies or analytics disclosures. No retention period, provider disclosure or legal promise has been established." }] } },
];
