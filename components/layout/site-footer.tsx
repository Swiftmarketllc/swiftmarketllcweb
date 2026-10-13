import { Container } from "./container";
import { PublicNavigation } from "@/components/navigation/public-navigation";
import type { PublicConsumerSources } from "@/lib/data/public-consumers";
import styles from "./site-shell.module.css";

export function SiteFooter({ sources }: Readonly<{ sources?: PublicConsumerSources }> = {}) {
  return <footer className={styles.footer}><Container className="stack">
    <p className="type-label">Swift Market LLC</p>
    <PublicNavigation placement="footer" sources={sources} />
  </Container></footer>;
}
