import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { elementId, labelledByIds } from "@/components/ui/element-id";
import styles from "./primitives.module.css";

type SectionLabel = Readonly<{ labelledBy: string; label?: never }>
  | Readonly<{ label: string; labelledBy?: never }>
  | Readonly<{ label?: undefined; labelledBy?: undefined }>;
export type SectionProps = Readonly<Omit<ComponentPropsWithoutRef<"section">,
  "children" | "id" | "aria-label" | "aria-labelledby" | "role"> & {
  children: ReactNode;
  id?: string;
  spacing?: "standard" | "compact";
}> & SectionLabel;

/** A section needs a meaningful heading; labels refer to caller-owned document elements. */
export function Section({ children, id, spacing = "standard", labelledBy, label, className, ...props }: SectionProps) {
  if (label !== undefined && !label.trim()) throw new Error("Section labels must not be empty.");
  if (label !== undefined && labelledBy !== undefined) throw new Error("Use one section labelling method.");
  return (
    <section {...props} id={elementId(id)} aria-labelledby={labelledByIds(labelledBy)} aria-label={label}
      className={[spacing === "compact" ? "section-compact" : "section", styles.section, className].filter(Boolean).join(" ")}>
      {children}
    </section>
  );
}
