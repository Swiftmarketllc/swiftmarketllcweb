import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import styles from "./ui-primitives-preview.module.css";

/** Internal interface demonstrations only; no business records or enquiry actions. */
export function UIPrimitivesPreview() {
  return (
    <Section id="ui-primitives" labelledBy="ui-primitives-heading">
      <Container className="stack">
        <SectionHeading id="ui-primitives-heading" level={2} heading="05 / Reusable UI primitives"
          eyebrow="M5.1.1 / Internal demonstration"
          description="Interface samples only. These controls do not submit enquiries or publish content." />
        <Container width="reading" className="stack">
          <SectionHeading level={3} heading="Reading-width container" description="This nested container shares the existing reading measure without doubling the page gutters." />
          <p>Long text wraps inside the container. Page widths, type and spacing use the existing design tokens.</p>
        </Container>
        <div className="responsive-grid">
          <Card className="stack">
            <SectionHeading level={3} heading="Presentational card" />
            <p>This surface has no automatic click behavior or default shadow.</p>
            <div className={styles.samples}>
              <Badge>Neutral example</Badge>
              <Badge tone="success">Success example</Badge>
              <Badge tone="warning">Warning example</Badge>
              <Badge tone="error">Error example</Badge>
            </div>
          </Card>
          <Card as="article" className="stack" aria-labelledby="ui-article-heading">
            <SectionHeading id="ui-article-heading" level={3} heading="Article semantics example" />
            <p>A card can represent a self-contained article when its content warrants it. This is a UI example, not company proof.</p>
          </Card>
        </div>
        <Section spacing="compact" labelledBy="ui-buttons-heading">
          <SectionHeading id="ui-buttons-heading" level={3} heading="Native button examples"
            description="The primary button opens a harmless note. Escape or the secondary button closes it." />
          <div className={styles.actionGroup}>
            <Button popoverTarget="ui-primitives-note" popoverTargetAction="show">Open preview note</Button>
            <Button variant="secondary" disabled>Disabled secondary example</Button>
            <Button disabled>Disabled primary example</Button>
          </div>
          <div id="ui-primitives-note" popover="auto" className={`${styles.note} stack`}>
            <p>Internal UI demonstration only. No data is sent or saved.</p>
            <Button variant="secondary" popoverTarget="ui-primitives-note" popoverTargetAction="hide">Close preview note</Button>
          </div>
        </Section>
      </Container>
    </Section>
  );
}
