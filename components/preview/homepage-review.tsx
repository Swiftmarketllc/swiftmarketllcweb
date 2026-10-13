import { HomepageComposition } from "@/components/pages/homepage";

/** Unmounted local review of the actual homepage composition; never public content. */
export function HomepageReview() {
  if (process.env.NODE_ENV !== "development") return null;
  return <HomepageComposition
    reviewNotice="DRAFT / TBF — Visual composition for owner review. All marketing copy and capability labels are provisional. No pages or services are published."
    heading={"Make room\nfor what's next."}
    summary="Digital growth, marketing, creative and technology for the U.S. market. A connected service structure, shaped around your business needs."
    capabilities={[
      { id: "draft-growth", heading: "Growth & marketing", body: "Provisional capability grouping: strategy, discovery and marketing. Launch services and scope require owner approval." },
      { id: "draft-creative", heading: "Brand & creative", body: "Provisional capability grouping: branding, design and creative production. Specific deliverables remain TBF." },
      { id: "draft-technology", heading: "Web, apps & automation", body: "Provisional capability grouping: websites, applications and AI/automation. Availability and relationships remain TBF." },
    ]}
    stories={[
      { id: "draft-connected", heading: "A connected view of your next step.", body: "DRAFT: The approved business structure supports individual services, one-time projects and broader service combinations. Final messaging and commercial scope are awaiting approval." },
      { id: "draft-conversation", heading: "Start with a conversation.", body: "DRAFT: Explore your needs through an enquiry and proposal process. Contact destinations, privacy and operational delivery require approval before activation." },
    ]}
  />;
}
