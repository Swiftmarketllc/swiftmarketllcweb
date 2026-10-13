"use client";

import type { ReactNode } from "react";
import styles from "./navigation.module.css";

/** In-flow disclosure, not a modal: native expanded semantics and ordinary Tab order. */
export function MobileMenu({ children }: Readonly<{ children: ReactNode }>) {
  if (!children) return null;
  return <details className={styles.mobileMenu}
    onKeyDown={event => {
      if (event.key === "Escape" && event.currentTarget.open) {
        event.preventDefault();
        event.currentTarget.open = false;
        event.currentTarget.querySelector("summary")?.focus();
      }
    }}
    onClick={event => {
      if (event.target instanceof Element && event.target.closest("a[href]")) event.currentTarget.open = false;
    }}>
    <summary className="button-base">Menu</summary>
    <div className={styles.menuPanel}>{children}</div>
  </details>;
}
