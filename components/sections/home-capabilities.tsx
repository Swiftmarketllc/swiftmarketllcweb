import type { CTA } from "@/lib/domain";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { CTALink } from "@/components/ui/cta-link";
import styles from "./home-capabilities.module.css";

export type CapabilityView = Readonly<{ id: string; heading: string; body: string; cta?: CTA }>;
export function HomeCapabilities({ items }: Readonly<{ items: readonly CapabilityView[] }>) {
  if (!items.length) return null;
  return <Section label="Capabilities overview" spacing="compact">
    <Container><div className={styles.grid}>
      {items.map((item, index) => <Card key={item.id} as="article" className={styles.card} data-visual={["orbit", "paper", "system"][index % 3]}>
        <div className={styles.mark} aria-hidden="true"><span /><span /><span /><span /></div>
        <SectionHeading level={2} heading={item.heading} id={`capability-${item.id}-heading`} description={item.body} />
        {item.cta && <div className={styles.link}><CTALink cta={item.cta} variant="text" /></div>}
      </Card>)}
    </div></Container>
  </Section>;
}
