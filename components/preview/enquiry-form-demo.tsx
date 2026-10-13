import { Button } from "@/components/ui/button";
import styles from "./launch-pages-preview.module.css";

/** No form/action, enabled controls, names, persistence or submission handlers. */
export function EnquiryFormDemo() {
  return <div className={styles.formDemo}>
    <p id="draft-enquiry-note">Internal demonstration only. Fields are provisional and disabled. Nothing can be submitted or saved.</p>
    <fieldset disabled aria-describedby="draft-enquiry-note" className={styles.fields}>
      <legend>Provisional enquiry fields — owner approval pending</legend>
      <label htmlFor="draft-enquiry-name">Name (required)</label>
      <input id="draft-enquiry-name" autoComplete="off" required />
      <label htmlFor="draft-enquiry-email">Email (required)</label>
      <input id="draft-enquiry-email" type="email" autoComplete="off" required />
      <label htmlFor="draft-enquiry-company">Company (optional)</label>
      <input id="draft-enquiry-company" autoComplete="off" />
      <label htmlFor="draft-enquiry-website">Website (optional)</label>
      <input id="draft-enquiry-website" type="url" autoComplete="off" />
      <label htmlFor="draft-enquiry-message">Message (required)</label>
      <textarea id="draft-enquiry-message" rows={5} required />
      <Button disabled>Submission unavailable — demonstration</Button>
    </fieldset>
  </div>;
}
