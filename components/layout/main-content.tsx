import type { ComponentPropsWithoutRef, ReactNode } from "react";
import styles from "./primitives.module.css";

export type MainContentProps = Readonly<Omit<ComponentPropsWithoutRef<"main">,
  "children" | "id" | "tabIndex" | "role"> & { children: ReactNode }>;

/** Page-owned landmark: use once, never inside another main or in a shared layout. */
export function MainContent({ children, className, ...props }: MainContentProps) {
  return (
    <main {...props} id="main-content" tabIndex={-1} className={[styles.main, className].filter(Boolean).join(" ")}>
      {children}
    </main>
  );
}
