import type { CTA } from "@/lib/domain";
import { ColorBlock } from "./color-block";
import { SectionHeading } from "@/components/ui/section-heading";
import { CTALink } from "@/components/ui/cta-link";
import styles from "./home-story.module.css";

export function HomeStory({ id, heading, body, surface, cta }: Readonly<{
  id: string; heading: string; body: string; surface: "warm" | "cool"; cta?: CTA;
}>) {
  return <div className={styles.scene} data-surface={surface}>
    <ColorBlock id={id} labelledBy={`${id}-heading`} surface={surface} spacing="standard">
      <div className={styles.story}>
        <div className={styles.copy}>
          <SectionHeading level={2} id={`${id}-heading`} heading={heading} />
          <p className={styles.body}>{body}</p>
          {cta && <CTALink cta={cta} />}
        </div>
        <div className={styles.stage} aria-hidden="true"><span className={styles.fold} /><span className={styles.fold} /><span className={styles.fold} /><span className={styles.axis} /></div>
      </div>
    </ColorBlock>
  </div>;
}
