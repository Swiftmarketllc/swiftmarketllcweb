import { creativeCopy as copy } from "./creative-copy";
import { DraftIcon } from "./draft-icon";
import { PreviewCta } from "./preview-cta";
import styles from "./creative.module.css";
import story from "./story.module.css";

const num = (position: number) => String(position + 1).padStart(2, "0");

/** Scattered nodes versus the same nodes connected: a diagram, not data. */
function FragmentDiagram({ connected }: Readonly<{ connected: boolean }>) {
  const nodes: readonly (readonly [number, number])[] = connected
    ? [[40, 30], [160, 28], [100, 60], [36, 96], [164, 94]]
    : [[22, 24], [170, 20], [92, 52], [30, 100], [150, 104]];
  return (
    <svg className={story.diagram} viewBox="0 0 200 120" aria-hidden="true" focusable="false">
      <rect x="1" y="1" width="198" height="118" className={story.diagramFrame} />
      {connected && nodes.slice(0, 4).map(([x, y]) => (
        <path key={`${x}-${y}`} d={`M${x} ${y}L100 60`} className={story.diagramLink} />
      ))}
      {connected && <circle cx="100" cy="60" r="16" className={story.diagramRing} />}
      {nodes.map(([x, y], position) => (
        <circle key={position} cx={x} cy={y} r={connected && position === 2 ? 5 : 4} className={connected ? story.nodeOn : story.nodeOff} />
      ))}
    </svg>
  );
}

export function IntroSection() {
  const { intro } = copy;
  const { introDisciplines, introCenter, introOutcomes } = copy.story;
  return (
    <section id="about" className={story.intro} aria-labelledby="cp-intro-title">
      <div className={styles.wrap}>
        <div className={styles.grid}>
          <p className={`${styles.label} ${styles.rail}`}>{intro.label}</p>
          <h2 id="cp-intro-title" className={`${styles.headline} ${styles.sectionTitle}`}>{intro.heading}</h2>
        </div>

        <div className={story.introLayout}>
          <div className={story.introText}>
            {intro.lead.map((line) => <p key={line} className={styles.lede}>{line}</p>)}
            <p className={story.introStatement}>{intro.statement}</p>
          </div>

          <figure className={story.map}>
            <div className={story.mapGrid}>
              {introDisciplines.map((item) => (
                <div key={item.name} className={story.tile}>
                  <DraftIcon name={item.icon} className={story.tileIcon} />
                  <span>{item.name}</span>
                </div>
              ))}
              <div className={story.center}>
                <DraftIcon name="conversation" className={story.centerIcon} />
                <span>{introCenter}</span>
              </div>
            </div>
            <figcaption>
              <ol className={story.outcomes}>
                {introOutcomes.map((item, position) => (
                  <li key={item.name}>
                    <span className={story.outcomeNumber}>{num(position)}</span>
                    <DraftIcon name={item.icon} className={story.outcomeIcon} />
                    <span>{item.name}</span>
                  </li>
                ))}
              </ol>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

export function PhilosophySection() {
  const { philosophy } = copy;
  return (
    <section id="philosophy" className={story.philosophy} aria-labelledby="cp-philosophy-title">
      <div className={styles.wrap}>
        <div className={styles.grid}>
          <p className={`${styles.label} ${styles.rail}`}>{philosophy.label}</p>
          <h2 id="cp-philosophy-title" className={`${styles.headline} ${styles.sectionTitle}`}>{philosophy.heading}</h2>
        </div>

        <div className={story.contrast} aria-hidden="true">
          <figure><FragmentDiagram connected={false} /><figcaption>{copy.story.fragmented}</figcaption></figure>
          <span className={story.contrastArrow}>→</span>
          <figure><FragmentDiagram connected /><figcaption>{copy.story.connected}</figcaption></figure>
        </div>

        <ul className={story.pillars}>
          {philosophy.items.map((item, position) => (
            <li key={item.name} className={`${story.pillar} ${styles.reveal}`}>
              <div className={story.pillarHead}>
                <span className={styles.label}>{num(position)}</span>
                <DraftIcon name={item.icon} className={story.pillarIcon} />
              </div>
              <h3>{item.name}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ApproachSection() {
  const { approach } = copy;
  return (
    <section id="approach" className={story.approach} aria-labelledby="cp-approach-title">
      <div className={styles.wrap}>
        <div className={styles.grid}>
          <p className={`${styles.label} ${styles.rail}`}>{approach.label}</p>
          <h2 id="cp-approach-title" className={`${styles.headline} ${styles.sectionTitle}`}>{approach.heading}</h2>
        </div>

        <ol className={story.timeline}>
          {approach.steps.map((step, position) => (
            <li key={step.title} className={`${story.station} ${styles.reveal}`}>
              <span className={story.stationNode} aria-hidden="true" />
              <div className={story.stationHead}>
                <span className={story.stationNumber} aria-hidden="true">{num(position)}</span>
                <DraftIcon name={step.icon} className={story.stationIcon} />
              </div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>

        <blockquote className={story.pull}>{approach.statement}</blockquote>
      </div>
    </section>
  );
}

export function IndustriesSection() {
  const { industries } = copy;
  const { journey, journeyLabel, recommends } = copy.story;
  return (
    <section id="industries" className={`${story.industries} ${styles.dark}`} aria-labelledby="cp-industries-title">
      <div className={`${styles.wrap} ${story.industriesGrid}`}>
        <div className={story.industriesText}>
          <p className={`${styles.label} ${story.onDarkLabel}`}>{industries.label}</p>
          <h2 id="cp-industries-title" className={`${styles.headline} ${story.industriesTitle}`}>{industries.heading}</h2>
          {industries.paragraphs.map((line) => <p key={line} className={styles.onDarkLede}>{line}</p>)}
          <div><PreviewCta label={industries.cta} note={copy.ctaNote} tone="ghost" /></div>
        </div>

        <div className={story.journey}>
          <p className={story.journeyLabel}>{journeyLabel}</p>
          <ol className={story.journeySteps}>
            {journey.map((step, position) => (
              <li key={step.name}>
                <span className={story.journeyNumber} aria-hidden="true">{num(position)}</span>
                <DraftIcon name={step.icon} className={story.journeyIcon} />
                <span className={story.journeyName}>{step.name}</span>
              </li>
            ))}
          </ol>
          <div className={story.recommends}>
            <p className={story.journeyLabel}>{recommends.label}</p>
            <ul>{recommends.items.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PackagesSection() {
  const { packages } = copy;
  const { matrix } = copy.story;
  const structure = [matrix.structure.startup, matrix.structure.growing, matrix.structure.enterprise];
  const pricing = [matrix.pricing.packaged, matrix.pricing.packaged, matrix.pricing.enterprise];
  return (
    <section id="packages" className={story.packages} aria-labelledby="cp-packages-title">
      <div className={styles.wrap}>
        <div className={styles.grid}>
          <p className={`${styles.label} ${styles.rail}`}>{packages.label}</p>
          <h2 id="cp-packages-title" className={`${styles.headline} ${styles.sectionTitle}`}>{packages.heading}</h2>
        </div>

        <div className={story.sheet}>
          {packages.items.map((item, position) => (
            <article key={item.name} className={`${story.option} ${position === 2 ? story.optionDark : ""} ${styles.reveal}`}>
              <header className={story.optionHead}>
                <DraftIcon name={item.icon} className={story.optionIcon} />
                <div>
                  <span className={styles.label}>{num(position)}</span>
                  <h3>{item.name}</h3>
                </div>
              </header>
              <dl className={story.specs}>
                <div><dt>{matrix.rows[0]}</dt><dd>{item.body}</dd></div>
                <div><dt>{matrix.rows[1]}</dt><dd>{structure[position]}</dd></div>
                <div><dt>{matrix.rows[2]}</dt><dd>{pricing[position]}</dd></div>
              </dl>
            </article>
          ))}
        </div>

        <div className={story.terms}>
          <div>
            <p className={story.termsLabel}>{matrix.separateLabel}</p>
            <ul className={story.tags}>{matrix.separate.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div>
            <p className={story.termsLabel}>{matrix.alsoLabel}</p>
            <ul className={story.tags}>{matrix.also.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>

        <p className={styles.important}><strong>Important:</strong> {packages.important}</p>
        <div className={styles.sectionAction}><PreviewCta label={packages.cta} note={copy.ctaNote} tone="outline" /></div>
      </div>
    </section>
  );
}
