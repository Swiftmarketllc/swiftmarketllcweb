"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowIcon } from "./arrow-icon";
import { LogoMark } from "./logo-mark";
import type { PreviewNavItem } from "./creative-copy";
import styles from "./header.module.css";

type PreviewHeaderProps = Readonly<{
  items: readonly PreviewNavItem[];
  cta: Readonly<{ label: string; short: string; href: string }>;
}>;

/** Preview-safe navigation: items without a destination render as disabled, never as links to draft routes. */
export function PreviewHeader({ items, cta }: PreviewHeaderProps) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      button.current?.focus();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <a className={styles.wordmark} href="#main-content">
          <LogoMark className={styles.mark} />
          <span>Swift Market</span>
        </a>

        <nav id={panelId} className={styles.nav} data-open={open} aria-label="Preview navigation">
          <ul>
            {items.map((item) => (
              <li key={item.label}>
                {item.href ? (
                  <a href={item.href} onClick={() => setOpen(false)}>{item.label}</a>
                ) : (
                  <span role="link" aria-disabled="true" className={styles.disabled}>
                    {item.label}
                    <span className={styles.tag}>Draft</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
          <a className={`${styles.cta} ${styles.panelCta}`} href={cta.href} onClick={() => setOpen(false)}>
            {cta.label}<ArrowIcon />
          </a>
        </nav>

        <a className={`${styles.cta} ${styles.barCta}`} href={cta.href}>
          <span className={styles.ctaLong}>{cta.label}</span>
          <span className={styles.ctaShort}>{cta.short}</span>
          <ArrowIcon />
        </a>

        <button
          ref={button}
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          <span className={styles.srOnly}>{open ? "Close menu" : "Open menu"}</span>
          <span className={styles.bars} aria-hidden="true"><span /><span /></span>
        </button>
      </div>
    </header>
  );
}
