import { useId } from "react";
import styles from "./home-hero.module.css";

/** Original intersecting sculptural bands. Lighting is SVG, not a downloaded asset. */
export function RibbonArtwork() {
  const id = useId().replaceAll(":", "");
  return <div className={styles.artwork} aria-hidden="true">
    <svg viewBox="0 0 960 800" fill="none" focusable="false" className={styles.ribbon}>
      <defs>
        <linearGradient id={`${id}-red`} x1="210" y1="150" x2="770" y2="640" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--surface-story-warm)" /><stop offset=".2" stopColor="var(--primary)" />
          <stop offset=".65" stopColor="var(--primary-active)" /><stop offset="1" stopColor="var(--foreground)" />
        </linearGradient>
        <linearGradient id={`${id}-navy`} x1="670" y1="190" x2="310" y2="660" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--text-secondary)" /><stop offset=".48" stopColor="var(--foreground)" /><stop offset="1" stopColor="var(--border-strong)" />
        </linearGradient>
        <linearGradient id={`${id}-silver`} x1="190" y1="500" x2="720" y2="370" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--surface-story-cool)" /><stop offset=".35" stopColor="var(--surface)" />
          <stop offset=".65" stopColor="var(--border)" /><stop offset="1" stopColor="var(--border-strong)" />
        </linearGradient>
      </defs>
      <ellipse cx="475" cy="698" rx="272" ry="27" fill="var(--foreground)" opacity=".07" />
      <ellipse cx="475" cy="698" rx="160" ry="12" fill="var(--foreground)" opacity=".08" />
      <g transform="rotate(-24 480 400)">
        <path d="M260 430C120 320 170 140 335 128C515 114 746 271 777 425C810 597 621 674 450 568" stroke={`url(#${id}-red)`} strokeWidth="102" strokeLinecap="round" />
        <path d="M260 430C120 320 170 140 335 128C515 114 746 271 777 425" stroke="var(--surface-story-warm)" strokeOpacity=".6" strokeWidth="3" strokeLinecap="round" transform="translate(-15 -25)" />
        <path d="M530 175C684 180 790 381 642 526C507 657 229 643 195 485C173 383 259 297 391 340" stroke={`url(#${id}-navy)`} strokeWidth="86" strokeLinecap="round" />
        <path d="M201 488C255 610 540 581 654 461" stroke={`url(#${id}-silver)`} strokeWidth="58" strokeLinecap="round" />
        <path d="M240 369C337 463 488 502 615 440C679 410 712 362 695 300" stroke={`url(#${id}-red)`} strokeWidth="100" strokeLinecap="round" />
        <path d="M245 332C348 422 490 463 603 405" stroke="var(--surface-story-warm)" strokeOpacity=".65" strokeWidth="3" strokeLinecap="round" />
      </g>
      <circle cx="782" cy="214" r="19" fill={`url(#${id}-silver)`} />
      <circle cx="196" cy="591" r="11" fill="var(--primary)" />
    </svg>
    <span className={styles.orbit} />
    <span className={styles.smallPlane} />
  </div>;
}
