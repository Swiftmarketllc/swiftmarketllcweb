import styles from "./creative.module.css";

export function ArrowIcon() {
  return (
    <svg className={styles.arrow} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
      <path d="M2 8h11M9 3.5 13.5 8 9 12.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
