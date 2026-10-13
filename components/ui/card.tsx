import type { ComponentPropsWithoutRef, ReactNode } from "react";
import styles from "./primitives.module.css";

export type CardProps = Readonly<Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  children: ReactNode;
  as?: "div" | "article";
}>;

/** No inferred interaction or heading; article is for independently meaningful content. */
export function Card({ children, as: Element = "div", className, ...props }: CardProps) {
  return <Element {...props} className={[styles.card, className].filter(Boolean).join(" ")}>{children}</Element>;
}
