"use client";

import { useId, useState } from "react";
import { DraftIcon } from "./draft-icon";
import type { DraftIconName } from "./draft-icon";
import { PreviewCta } from "./preview-cta";
import styles from "./solution-finder.module.css";

type SolutionFinderProps = Readonly<{
  stages: readonly Readonly<{ name: string; body: string; icon: DraftIconName }>[];
  industries: readonly Readonly<{ label: string; icon: DraftIconName }>[];
  context: readonly string[];
  labels: Readonly<{
    stage: string; industry: string; result: string; industryContext: string;
    anyIndustry: string; note: string; cta: string; ctaNote: string;
  }>;
}>;

/** Selection is presentational only: nothing is sent, stored or recommended beyond approved copy. */
export function SolutionFinder({ stages, industries, context, labels }: SolutionFinderProps) {
  const [stage, setStage] = useState(0);
  const [industry, setIndustry] = useState<number | null>(null);
  const group = useId();
  const current = stages[stage];
  const sector = industry === null ? null : industries[industry];

  return (
    <div className={styles.finder}>
      <div className={styles.controls}>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}><span>01</span> {labels.stage}</legend>
          <div className={styles.stages}>
            {stages.map((item, position) => (
              <label key={item.name} className={styles.stage}>
                <input type="radio" name={group} checked={stage === position} onChange={() => setStage(position)} />
                <span className={styles.stageBody}>
                  <DraftIcon name={item.icon} className={styles.stageIcon} />
                  <span className={styles.stageName}>{item.name}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}><span>02</span> {labels.industry}</legend>
          <div className={styles.chips}>
            {industries.map((item, position) => (
              <button
                key={item.label}
                type="button"
                className={styles.chip}
                aria-pressed={industry === position}
                onClick={() => setIndustry(industry === position ? null : position)}
              >
                <DraftIcon name={item.icon} className={styles.chipIcon} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          <p className={styles.note}>{labels.note}</p>
        </fieldset>
      </div>

      <div className={styles.result} aria-live="polite">
        <div key={`${stage}-${industry}`} className={styles.resultInner}>
          <p className={styles.eyebrow}>{labels.result}</p>
          <div className={styles.resultHead}>
            <DraftIcon name={current.icon} className={styles.resultIcon} />
            <h3>{current.name}</h3>
          </div>
          <p className={styles.resultBody}>{current.body}</p>

          <div className={styles.divider} />

          <p className={styles.eyebrow}>{labels.industryContext}</p>
          <p className={styles.sector}>
            {sector && <DraftIcon name={sector.icon} className={styles.sectorIcon} />}
            <span>{sector ? sector.label : labels.anyIndustry}</span>
          </p>
          {context.map((line) => <p key={line} className={styles.context}>{line}</p>)}
        </div>
        <div className={styles.resultAction}>
          <PreviewCta label={labels.cta} note={labels.ctaNote} tone="ghost" />
        </div>
      </div>
    </div>
  );
}
