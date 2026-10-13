import type { ComponentPropsWithoutRef } from "react";
import styles from "./primitives.module.css";

export type BadgeProps = Readonly<Omit<ComponentPropsWithoutRef<"span">, "children"> & {
  children: string;
  tone?: "neutral" | "success" | "warning" | "error";
}>;

/** Tone is presentation, not business availability or automatic live-region behavior. */
export function Badge({ children, tone = "neutral", className, ...props }: BadgeProps) {
  if (!children.trim()) throw new Error("Badges need a meaningful text label.");
  return <span {...props} className={[styles.badge, styles[tone], className].filter(Boolean).join(" ")}>{children}</span>;
}
