import type { CTA } from "@/lib/domain";
import { resolvePublicationSafeConsumerCTA } from "@/lib/data/public-consumers";
import type { PublicConsumerSources } from "@/lib/data/public-consumers";
import styles from "./brand-presentation.module.css";

export type CTALinkProps = Readonly<{
  cta: CTA;
  variant?: "primary" | "secondary" | "text";
  className?: string;
  /** Trusted server-side repository sources; primarily for synthetic integrity tests. */
  sources?: PublicConsumerSources;
}>;

/** No href override, event navigation, submit action or unsafe fallback link. */
export function CTALink({ cta, variant = "primary", className, sources }: CTALinkProps) {
  // Selection transport belongs to the later enquiry workflow. Never silently
  // discard a selected solution or invent query parameters to carry it.
  if (cta.kind === "enquiry-link" && cta.context) return null;
  const target = resolvePublicationSafeConsumerCTA(cta, sources);
  if (!target) return null;
  const href = target.path + (target.fragment ? `#${target.fragment}` : "");
  return <a href={href} className={[
    variant === "text" ? styles.textLink : `button-base ${styles.pill}`,
    variant === "primary" ? "button-primary" : undefined, className,
  ].filter(Boolean).join(" ")}>{cta.label}</a>;
}
