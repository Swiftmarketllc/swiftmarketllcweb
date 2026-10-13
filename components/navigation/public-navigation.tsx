import type { NavigationItem } from "@/lib/domain";
import { getPublicationSafeNavigation } from "@/lib/data/public-consumers";
import type { PublicConsumerSources } from "@/lib/data/public-consumers";
import { CTALink } from "@/components/ui/cta-link";
import styles from "./navigation.module.css";

function Items({ items, sources }: Readonly<{ items: readonly NavigationItem[]; sources?: PublicConsumerSources }>) {
  return <ul className={styles.links}>{items.map(item => <li key={item.id}>
    <CTALink variant="text" sources={sources} cta={{ kind: "navigation", intent: "explore", label: item.label,
      destination: { routeId: item.routeId, ...(item.kind === "link" && item.fragment ? { fragment: item.fragment } : {}) } }} />
    {item.kind === "disclosure" && item.children.length > 0 && <details>
      <summary>{item.label} options</summary><Items items={item.children} sources={sources} />
    </details>}
  </li>)}</ul>;
}

/** Server-only composition; the mobile client receives rendered safe links only. */
export function PublicNavigation({ placement, sources }: Readonly<{
  placement: "header" | "footer";
  sources?: PublicConsumerSources;
}>) {
  const ids = placement === "header" ? ["nav-group:primary", "nav-group:utility"]
    : ["nav-group:company", "nav-group:solutions", "nav-group:legal"];
  const groups = getPublicationSafeNavigation(undefined, sources).filter(group => ids.includes(group.id));
  if (!groups.length) return null;
  return <nav aria-label={placement === "header" ? "Primary navigation" : "Footer navigation"} className={styles.navigation}>
    {groups.map(group => <div key={group.id}>
      {placement === "footer" && <p className="type-label">{group.label}</p>}
      <Items items={group.items} sources={sources} />
    </div>)}
  </nav>;
}
