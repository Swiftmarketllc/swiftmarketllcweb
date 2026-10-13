import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { ColorBlock } from "@/components/sections/color-block";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CTALink } from "@/components/ui/cta-link";
import presentation from "@/components/ui/brand-presentation.module.css";
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
        <Section spacing="compact" labelledBy="day-one-heading">
          <SectionHeading id="day-one-heading" level={3} heading="Day 1 / Internal presentation"
            description="Shell and surface examples only. Navigation and CTA links remain omitted while destinations are unpublished." />
          <div className={styles.shellExample}>
            <SiteHeader />
            <p className={styles.shellCaption}>Internal shell demonstration — no production navigation is published.</p>
            <SiteFooter />
          </div>
          <CTALink cta={{ kind: "navigation", intent: "explore", label: "Home", destination: { routeId: "route:home" } }} />
        </Section>
        <ColorBlock surface="warm" labelledBy="warm-story-heading">
          <SectionHeading id="warm-story-heading" level={3} heading="Warm storytelling surface"
            description="The approved warm pastel uses solid navy headings and readable supporting text." />
          <Button className={presentation.pill} popoverTarget="ui-primitives-note" popoverTargetAction="show">Open preview note</Button>
        </ColorBlock>
        <ColorBlock surface="cool" labelledBy="cool-story-heading">
          <SectionHeading id="cool-story-heading" level={3} heading="Cool storytelling surface"
            description="Existing typography and spacing support a quiet editorial panel." />
          <Card className={`${presentation.roundedCard} stack`}>
            <SectionHeading level={4} heading="Opt-in rounded card" />
            <p className="text-secondary">Presentation only. The Card contract and its default appearance remain unchanged.</p>
            <Badge>Internal example</Badge>
          </Card>
        </ColorBlock>
      </Container>
    </Section>
  );
}
