import { Container } from "./container";
import { PublicNavigation } from "@/components/navigation/public-navigation";
import { MobileMenu } from "@/components/navigation/mobile-menu";
import { getPublicationSafeRouteById } from "@/lib/data/public-consumers";
import type { PublicConsumerSources } from "@/lib/data/public-consumers";
import styles from "./site-shell.module.css";

export function SiteHeader({ sources }: Readonly<{ sources?: PublicConsumerSources }> = {}) {
  const home = getPublicationSafeRouteById("route:home", sources);
  const navigation = PublicNavigation({ placement: "header", sources });
  return <header className={styles.header}><Container className={styles.headerInner}>
    {home ? <a className={styles.brand} href={home.path}>Swift Market LLC</a>
      : <span className={styles.brand}>Swift Market LLC</span>}
    {navigation && <><div className={styles.desktopNavigation}>{navigation}</div>
      <MobileMenu>{navigation}</MobileMenu></>}
  </Container></header>;
}
