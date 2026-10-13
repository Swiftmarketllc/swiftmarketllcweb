import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { LaunchPageBody } from "@/components/pages/launch-page-body";
import { launchCopyDrafts } from "./launch-copy-drafts";
import { EnquiryFormDemo } from "./enquiry-form-demo";
import styles from "./launch-pages-preview.module.css";
import { EnquiryForm } from "@/components/forms/enquiry-form";

/** Development-only review inside the existing noindex preview, never a public page. */
export function LaunchPagesPreview() {
  if (process.env.NODE_ENV !== "development") return null;
  return <Section labelledBy="launch-drafts-heading" spacing="compact">
    <Container className="stack">
      <h2 id="launch-drafts-heading">Day 2 / Internal page-copy drafts</h2>
      <p>DRAFT / TBF. Owner approval pending. These review panels are not published pages, approved offers or legal policies.</p>
      {launchCopyDrafts.map((draft, index) => <details key={draft.routeId} className={styles.review}>
        <summary>{draft.path} — DRAFT / TBF</summary>
        <p className={styles.pending}>{draft.pending}</p>
        <LaunchPageBody {...draft.body} reviewPrefix={`launch-review-${index}`} />
        {draft.routeId === "route:contact" && <>
          <EnquiryFormDemo />
          <Container width="reading" className="section-compact stack">
            <p>Phase 2 / Secure enquiry UI foundation — disabled internal demonstration</p>
            <EnquiryForm />
          </Container>
        </>}
      </details>)}
    </Container>
  </Section>;
}
