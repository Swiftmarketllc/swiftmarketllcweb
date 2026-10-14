import { ArrowIcon } from "./arrow-icon";
import { creativeCopy as copy } from "./creative-copy";
import type { PreviewNavItem } from "./creative-copy";
import { LogoMark } from "./logo-mark";
import { PreviewCta } from "./preview-cta";
import styles from "./creative.module.css";
import foot from "./footer.module.css";

/** Preview-safe link: an item without a destination is disabled, never a link to a draft route. */
function FooterLink({ item }: Readonly<{ item: PreviewNavItem }>) {
  if (item.href) return <a href={item.href}>{item.label}</a>;
  return (
    <span role="link" aria-disabled="true" className={foot.disabled}>
      {item.label}<span className={foot.tag}>Draft</span>
    </span>
  );
}

export function ClosingBand() {
  const { label, lines, accent, body, primary, secondary } = copy.closing;
  return (
    <section id="begin" className={`${foot.band} ${styles.dark}`} aria-labelledby="cp-closing-title">
      <div className={`${styles.wrap} ${foot.bandGrid}`}>
        <p className={`${styles.label} ${foot.bandLabel}`}>{label}</p>
        <h2 id="cp-closing-title" className={`${styles.display} ${foot.bandTitle}`}>
          {lines.map((line) => <span key={line} className={styles.line}><span>{line}</span>{" "}</span>)}
          <span className={styles.line}><span><em>{accent}</em></span></span>
        </h2>
        <div className={foot.bandBody}>
          <p>{body}</p>
          <div className={styles.actions}>
            <PreviewCta label={primary} note={copy.ctaNote} />
            <PreviewCta label={secondary} note={copy.ctaNote} tone="ghost" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function PreviewFooter() {
  const f = copy.footer;
  return (
    <footer className={`${foot.footer} ${styles.dark}`}>
      <div className={`${styles.wrap} ${foot.cols}`}>
        <div className={foot.brand}>
          <a className={foot.wordmark} href="#main-content"><LogoMark /><span>Swift Market</span></a>
          <p>{f.description}</p>
        </div>

        <nav className={foot.col} aria-labelledby="cp-foot-services">
          <h2 id="cp-foot-services" className={styles.label}>{f.servicesLabel}</h2>
          <ul>{f.services.map((name) => <li key={name}><a href="#capabilities">{name}</a></li>)}</ul>
        </nav>

        <nav className={foot.col} aria-labelledby="cp-foot-company">
          <h2 id="cp-foot-company" className={styles.label}>{f.companyLabel}</h2>
          <ul>{f.company.map((item) => <li key={item.label}><FooterLink item={item} /></li>)}</ul>
        </nav>

        <div className={foot.col}>
          <h2 id="cp-foot-contact" className={styles.label}>{f.contactLabel}</h2>
          <ul aria-labelledby="cp-foot-contact">
            <li><a className={foot.mail} href={`mailto:${copy.email}`}>{copy.email}<ArrowIcon /></a></li>
            <li><a href="#begin">{f.contactCta}</a></li>
          </ul>
        </div>

        <nav className={foot.col} aria-labelledby="cp-foot-legal">
          <h2 id="cp-foot-legal" className={styles.label}>{f.legalLabel}</h2>
          <ul>{f.legal.map((item) => <li key={item.label}><FooterLink item={item} /></li>)}</ul>
        </nav>
      </div>

      <p className={foot.mega} aria-hidden="true">Swift Market</p>

      <div className={`${styles.wrap} ${foot.legalBar}`}>
        <span>© {new Date().getFullYear()} Swift Market LLC</span>
        <span>{f.notice}</span>
        <a href="#main-content">Back to top</a>
      </div>
    </footer>
  );
}
