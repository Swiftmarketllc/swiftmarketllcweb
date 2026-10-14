"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowIcon } from "./arrow-icon";
import styles from "./creative.module.css";

type PreviewCtaProps = Readonly<{ label: string; note: string; tone?: "solid" | "ghost" | "outline" }>;

const toneClass = { solid: styles.btnSolid, ghost: styles.btnGhost, outline: styles.btnOutline } as const;

/** Disabled placeholder: aria-disabled, never activates anything. A click or key press only
    explains why, so the control stays focusable and its state is announced. */
export function PreviewCta({ label, note, tone = "solid" }: PreviewCtaProps) {
  const [noted, setNoted] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function explain() {
    setNoted(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setNoted(false), 4500);
  }

  return (
    <span className={styles.ctaWrap}>
      <button type="button" aria-disabled="true" className={`${styles.btn} ${toneClass[tone]} ${styles.btnDisabled}`} onClick={explain}>
        <span>{label}</span>
        <ArrowIcon />
      </button>
      <span role="status" className={`${styles.ctaNote} ${tone === "outline" ? styles.ctaNoteLight : ""}`} data-visible={noted}>{noted ? note : ""}</span>
    </span>
  );
}
