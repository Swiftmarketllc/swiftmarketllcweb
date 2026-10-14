import type { ReactNode } from "react";
import styles from "./draft-icon.module.css";

/** Architectural-drafting icon set: hairline construction strokes, crop marks, dashed guides,
    dimension ticks. Original artwork; decorative, so always hidden from assistive tech. */
export type DraftIconName =
  | "strategy" | "search" | "broadcast" | "pen" | "browser" | "flow"
  | "discover" | "evaluate" | "shape" | "forward"
  | "origin" | "connect" | "fit" | "evolve"
  | "startup" | "growing" | "enterprise"
  | "conversation"
  | "healthcare" | "realestate" | "homeservices" | "ecommerce" | "tech" | "restaurant"
  | "legal" | "education" | "finance" | "automotive" | "professional";

type Drawing = Readonly<{ draw: ReactNode; guide?: ReactNode }>;

const icons: Record<DraftIconName, Drawing> = {
  strategy: {
    draw: <><path d="M24 11 14 38M24 11l10 27M19.5 27h9" /><circle cx="24" cy="9" r="2" /></>,
    guide: <circle cx="24" cy="36" r="9" />,
  },
  search: {
    draw: <><circle cx="21" cy="21" r="9" /><path d="m27.5 27.5 10.5 10.5" /></>,
    guide: <path d="M21 7v28M7 21h28" />,
  },
  broadcast: {
    draw: <><circle cx="16" cy="32" r="3" /><path d="M16 22a10 10 0 0 1 10 10M16 14a18 18 0 0 1 18 18M16 6a26 26 0 0 1 26 26" /></>,
    guide: <path d="M16 32h26M16 32V6" />,
  },
  pen: {
    draw: <><path d="M10 36C14 10 34 10 38 36" /><rect x="8" y="34" width="4" height="4" /><rect x="36" y="34" width="4" height="4" /><circle cx="14" cy="15" r="1.6" /><circle cx="34" cy="15" r="1.6" /></>,
    guide: <path d="M10 36 14 15M38 36 34 15" />,
  },
  browser: {
    draw: <><rect x="8" y="10" width="32" height="28" /><path d="M8 17h32M16 24h10M16 30h18M30 24h4" /></>,
    guide: <path d="M8 43h32M8 41v4M40 41v4" />,
  },
  flow: {
    draw: <><rect x="8" y="10" width="10" height="8" /><rect x="30" y="10" width="10" height="8" /><rect x="19" y="30" width="10" height="8" /><path d="M18 14h12M13 18v6h11v6M35 18v6H24" /></>,
    guide: <circle cx="24" cy="24" r="20" />,
  },
  discover: {
    draw: <><path d="M24 8c7 0 11 5 11 11 0 8-11 19-11 19S13 27 13 19c0-6 4-11 11-11Z" /><circle cx="24" cy="19" r="4" /></>,
    guide: <path d="M10 42h28M24 38v4" />,
  },
  evaluate: {
    draw: <><path d="m10 14 3 3 5-6M22 14h16M10 26l3 3 5-6M22 26h16M22 38h16" /><rect x="10" y="35" width="6" height="6" /></>,
    guide: <path d="M6 32h36" />,
  },
  shape: {
    draw: <><path d="M8 40V10l30 30ZM15 34V22l12 12Z" /><path d="m32 8 8 8-4 4-8-8Z" /></>,
    guide: <path d="M8 34h6v6" />,
  },
  forward: {
    draw: <path d="M8 30h28M28 22l8 8-8 8" />,
    guide: <path d="M8 12h32M8 9v6M40 9v6" />,
  },
  origin: {
    draw: <><circle cx="24" cy="24" r="5" /><path d="M24 8v11M24 29v11M8 24h11M29 24h11" /></>,
    guide: <circle cx="24" cy="24" r="14" />,
  },
  connect: {
    draw: <><circle cx="12" cy="34" r="4" /><circle cx="24" cy="12" r="4" /><circle cx="36" cy="34" r="4" /><path d="m14 30 8-14M26 16l8 14M16 34h16" /></>,
    guide: <path d="M24 6 6 40h36Z" />,
  },
  fit: {
    draw: <><rect x="12" y="12" width="24" height="24" /><path d="M12 20h8v-8" /></>,
    guide: <path d="M7 12v24M5 12h4M5 36h4M12 7h24M12 5v4M36 5v4" />,
  },
  evolve: {
    draw: <><path d="M8 40h8v-8h8v-8h8v-8h8" /><path d="M32 8h8v8" /></>,
    guide: <path d="M8 40 40 8" />,
  },
  startup: {
    draw: <><rect x="16" y="16" width="16" height="16" /><path d="M16 32h6a6 6 0 0 0-6-6" /></>,
    guide: <path d="M6 40h36" />,
  },
  growing: {
    draw: <path d="M8 40V28h12V20h12V12h8v28Z M20 40V20M32 40V12" />,
    guide: <path d="M8 8h12M14 8v12" />,
  },
  enterprise: {
    draw: <><rect x="8" y="8" width="12" height="12" /><rect x="28" y="8" width="12" height="12" /><rect x="8" y="28" width="12" height="12" /><rect x="28" y="28" width="12" height="12" /><path d="M20 14h8M14 20v8M34 20v8M20 34h8" /></>,
    guide: <path d="M24 4v40M4 24h40" />,
  },
  conversation: {
    draw: <><path d="M8 10h22v14H18l-6 5v-5H8Z" /><path d="M22 28h18v10h-4v5l-6-5H22Z" /></>,
  },
  healthcare: {
    draw: <><circle cx="24" cy="24" r="14" /><path d="M24 17v14M17 24h14" /></>,
    guide: <path d="M6 6h36v36H6Z" />,
  },
  realestate: {
    draw: <><path d="m8 24 16-14 16 14M12 22v16h24V22M21 38V29h6v9" /></>,
    guide: <path d="M8 43h32M8 41v4M40 41v4" />,
  },
  homeservices: {
    draw: <path d="M31 8a8 8 0 0 0-5 12L10 36l4 4 16-16a8 8 0 0 0 10-6l-6 4-6-6 4-6Z" />,
    guide: <path d="M8 42h32" />,
  },
  ecommerce: {
    draw: <><path d="M6 10h5l4 20h20l4-14H13" /><circle cx="18" cy="37" r="2.5" /><circle cx="32" cy="37" r="2.5" /></>,
    guide: <path d="M6 42h36" />,
  },
  tech: {
    draw: <><rect x="14" y="14" width="20" height="20" /><rect x="20" y="20" width="8" height="8" /><path d="M19 14V8M24 14V8M29 14V8M19 34v6M24 34v6M29 34v6M14 19H8M14 24H8M14 29H8M34 19h6M34 24h6M34 29h6" /></>,
  },
  restaurant: {
    draw: <><path d="M12 34a12 12 0 0 1 24 0ZM24 22v-5M22 17h4" /></>,
    guide: <path d="M6 39h36" />,
  },
  legal: {
    draw: <><path d="M24 8v30M14 38h20M10 14h28M10 14 5 26h10ZM38 14l-5 12h10Z" /></>,
    guide: <circle cx="24" cy="12" r="3" />,
  },
  education: {
    draw: <><path d="m24 12 18 8-18 8L6 20ZM14 24v8c6 4 14 4 20 0v-8" /></>,
    guide: <path d="M42 20v10" />,
  },
  finance: {
    draw: <path d="m6 18 18-10 18 10ZM10 22v12M18 22v12M30 22v12M38 22v12M6 38h36" />,
  },
  automotive: {
    draw: <><path d="M5 31v-6l6-1 5-7h14l6 7 7 1v6Z" /><circle cx="15" cy="32" r="4" /><circle cx="33" cy="32" r="4" /></>,
    guide: <path d="M4 40h40" />,
  },
  professional: {
    draw: <><rect x="8" y="16" width="32" height="22" /><path d="M18 16v-5h12v5M8 26h32M22 26v4h4v-4" /></>,
  },
};

export function DraftIcon({ name, className }: Readonly<{ name: DraftIconName; className?: string }>) {
  const icon = icons[name];
  return (
    <svg className={`${styles.icon} ${className ?? ""}`} viewBox="0 0 48 48" width="48" height="48" aria-hidden="true" focusable="false">
      <path className={styles.frame} d="M4 9V4h5M39 4h5v5M44 39v5h-5M9 44H4v-5" />
      {icon.guide && <g className={styles.guide}>{icon.guide}</g>}
      <g className={styles.draw}>{icon.draw}</g>
    </svg>
  );
}
