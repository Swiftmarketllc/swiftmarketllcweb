import type { CTA } from "@/lib/domain";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { CTALink } from "@/components/ui/cta-link";
import { RibbonArtwork } from "./ribbon-artwork";
import styles from "./home-hero.module.css";

export function HomeHero({ heading, summary, cta }: Readonly<{ heading: string; summary: string; cta?: CTA }>) {
  return <Section labelledBy="home-heading" className={styles.hero}>
    <Container className={styles.grid}>
      <div className={styles.copy}>
        <p className="type-eyebrow text-secondary">Swift Market LLC</p>
        <h1 id="home-heading" className={styles.heading}>{heading.split("\n").map((line, index) => <span key={index} className={styles.line}>{index > 0 && " "}{line}</span>)}</h1>
        <p className={styles.summary}>{summary}</p>
        {cta && <div className={styles.actions}><CTALink cta={cta} /></div>}
      </div>
      <RibbonArtwork />
      <div className={styles.baseline} aria-hidden="true"><span /><span>Digital / Creative / Technology</span><span /></div>
    </Container>
  </Section>;
}
