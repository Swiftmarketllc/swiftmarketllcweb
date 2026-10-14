import { MainContent } from "@/components/layout/main-content";
import { creativeCopy as copy } from "./creative-copy";
import { CreativeHero } from "./creative-hero";
import { ClosingBand, PreviewFooter } from "./preview-footer";
import { DraftIcon } from "./draft-icon";
import { PreviewCta } from "./preview-cta";
import { SolutionFinder } from "./solution-finder";
import { ApproachSection, IndustriesSection, IntroSection, PackagesSection, PhilosophySection } from "./story-sections";
import { PreviewHeader } from "./preview-header";
import styles from "./creative.module.css";

const index = (position: number) => String(position + 1).padStart(2, "0");

/** Development-only agency homepage study using proposed copy. Reads no site data and publishes nothing. */
export function CreativeHomepage() {
  const { capabilities, audience, industries, faq, solutions } = copy;
  return (
    <div className={styles.root}>
      <PreviewHeader items={copy.nav} cta={copy.headerCta} />

      <MainContent>
        <CreativeHero />

        <div className={styles.ticker} aria-hidden="true">
          <div className={styles.tickerTrack}>
            {[...capabilities.groups, ...capabilities.groups].map((group, position) => (
              <span key={position}>{group.name}</span>
            ))}
          </div>
        </div>

        <IntroSection />

        <section id="capabilities" className={styles.capabilities} aria-labelledby="cp-capabilities-title">
          <div className={`${styles.wrap} ${styles.grid}`}>
            <div className={styles.indexIntro}>
              <p className={styles.label}>{capabilities.label}</p>
              <h2 id="cp-capabilities-title" className={styles.headline}>{capabilities.heading}</h2>
              <div><PreviewCta label={capabilities.cta} note={copy.ctaNote} tone="outline" /></div>
            </div>
            <ol className={styles.indexList}>
              {capabilities.groups.map((group, position) => (
                <li key={group.name} className={`${styles.indexRow} ${styles.reveal}`}>
                  <DraftIcon name={group.icon} className={styles.indexIcon} />
                  <div className={styles.indexTitle}>
                    <span className={styles.indexNumber} aria-hidden="true">{index(position)}</span>
                    <h3 className={styles.indexName}>{group.name}</h3>
                  </div>
                  <p className={styles.families}>{group.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <ApproachSection />

        <section id="solutions" className={styles.audience} aria-labelledby="cp-audience-title">
          <div className={styles.wrap}>
            <div className={styles.grid}>
              <p className={`${styles.label} ${styles.rail}`}>{audience.label}</p>
              <h2 id="cp-audience-title" className={`${styles.headline} ${styles.sectionTitle}`}>{audience.heading}</h2>
            </div>
            <SolutionFinder
              stages={audience.items}
              industries={solutions.industries}
              context={industries.paragraphs}
              labels={{
                stage: solutions.stageLegend, industry: solutions.industryLegend, result: solutions.resultLabel,
                industryContext: solutions.industryContextLabel, anyIndustry: solutions.anyIndustry,
                note: solutions.note, cta: audience.cta, ctaNote: copy.ctaNote,
              }}
            />
          </div>
        </section>

        <IndustriesSection />

        <PhilosophySection />

        <PackagesSection />

        <section id="faq" className={styles.faq} aria-labelledby="cp-faq-title">
          <div className={`${styles.wrap} ${styles.grid}`}>
            <h2 id="cp-faq-title" className={`${styles.headline} ${styles.faqTitle}`}>{faq.heading}</h2>
            <div className={styles.faqList}>
              {faq.items.map((item) => (
                <details key={item.q} className={styles.faqItem}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <ClosingBand />
      </MainContent>

      <PreviewFooter />

      <p className={styles.draftTag}><strong>{copy.status}</strong> <span className={styles.draftDetail}>{copy.statusDetail}</span></p>
    </div>
  );
}
