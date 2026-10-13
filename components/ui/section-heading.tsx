import { elementId } from "./element-id";
import styles from "./primitives.module.css";

export type SectionHeadingProps = Readonly<{
  heading: string;
  level: 2 | 3 | 4;
  id?: string;
  eyebrow?: string;
  description?: string;
  className?: string;
}>;

export function SectionHeading({ heading, level, id, eyebrow, description, className }: SectionHeadingProps) {
  if (!heading.trim()) throw new Error("Section headings must not be empty.");
  if (level !== 2 && level !== 3 && level !== 4) throw new Error("Section heading level must be 2, 3 or 4.");
  const Heading = level === 2 ? "h2" : level === 3 ? "h3" : "h4";
  return (
    <div className={[styles.headingGroup, className].filter(Boolean).join(" ")}>
      {eyebrow?.trim() && <p className="type-eyebrow text-secondary">{eyebrow}</p>}
      <Heading id={elementId(id)} className={`type-h${level}`}>{heading}</Heading>
      {description?.trim() && <p className={`text-secondary ${styles.description}`}>{description}</p>}
    </div>
  );
}
