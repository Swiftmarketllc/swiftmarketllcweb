import { creativeCopy as copy } from "./creative-copy";
import { PreviewCta } from "./preview-cta";
import { TiltStage } from "./tilt-stage";
import styles from "./creative.module.css";
import hero from "./hero.module.css";

type GlyphName = "chat" | "play" | "globe" | "share" | "chart" | "cursor";

function Glyph({ name }: Readonly<{ name: GlyphName }>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {name === "chat" && <path d="M4 5h16v11H10l-5 4v-4H4z" />}
      {name === "play" && <path d="M8 5.5v13l11-6.5z" fill="currentColor" />}
      {name === "globe" && <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3.5 3.2 3.5 14.8 0 18M12 3c-3.5 3.2-3.5 14.8 0 18" /></>}
      {name === "share" && <><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6" /></>}
      {name === "chart" && <path d="M5 19v-6M12 19V6M19 19v-9" strokeWidth="3" />}
      {name === "cursor" && <path d="m6 4 12 6-5.2 1.8L11 17z" fill="currentColor" />}
    </svg>
  );
}

const chips: readonly Readonly<{ glyph: GlyphName; light?: boolean; style: Record<string, string> }>[] = [
  { glyph: "chat", style: { left: "2%", top: "12%", "--d": "-3", "--r": "-10deg", "--delay": "0s" } },
  { glyph: "play", light: true, style: { left: "74%", top: "2%", "--d": "4", "--r": "8deg", "--delay": "-2s" } },
  { glyph: "globe", style: { left: "88%", top: "40%", "--d": "6", "--r": "12deg", "--delay": "-4s" } },
  { glyph: "share", light: true, style: { left: "76%", top: "80%", "--d": "-5", "--r": "-6deg", "--delay": "-1s" } },
  { glyph: "chart", style: { left: "6%", top: "72%", "--d": "5", "--r": "6deg", "--delay": "-3s" } },
  { glyph: "cursor", light: true, style: { left: "-1%", top: "44%", "--d": "-6", "--r": "-14deg", "--delay": "-5s" } },
];

/** Original layered-stack composition built from CSS 3D only: no canvas, no third-party marks. */
function LayerStack() {
  return (
    <TiltStage className={hero.scene}>
      <div className={hero.glow} aria-hidden="true" />
      <div className={hero.iso} aria-hidden="true">
        <div className={hero.stack}>
          <span className={hero.ground} />
          <span className={hero.beam} />

          <div className={`${hero.slab} ${hero.tech}`} style={{ "--i": 0 } as React.CSSProperties}>
            {[[10, 52], [18, 38], [18, 62], [26, 30], [10, 46]].map(([left, width], row) => (
              <span key={row} className={`${hero.codeLine} ${row % 2 ? hero.codeAccent : ""}`}
                style={{ left: `${left}%`, width: `${width}%`, top: `${16 + row * 13}%` }} />
            ))}
            <span className={hero.slabLabel}>{copy.hero.layers[0]}</span>
          </div>

          <div className={`${hero.slab} ${hero.creative}`} style={{ "--i": 1 } as React.CSSProperties}>
            <span className={hero.circle} />
            <span className={hero.square} />
            <span className={hero.pill} />
            <span className={hero.dotRow}><i /><i /><i /></span>
            <span className={hero.slabLabel}>{copy.hero.layers[1]}</span>
          </div>

          <div className={`${hero.slab} ${hero.marketing}`} style={{ "--i": 2 } as React.CSSProperties}>
            <span className={`${hero.ring} ${hero.ringOuter}`} />
            <span className={`${hero.ring} ${hero.ringMid}`} />
            <span className={`${hero.ring} ${hero.ringInner}`} />
            <span className={hero.core} />
            <span className={hero.slabLabel}>{copy.hero.layers[2]}</span>
          </div>

          <div className={`${hero.slab} ${hero.strategy}`} style={{ "--i": 3 } as React.CSSProperties}>
            <span className={`${hero.stair} ${hero.stairOne}`} />
            <span className={`${hero.stair} ${hero.stairTwo}`} />
            <span className={`${hero.stair} ${hero.stairThree}`} />
            <span className={hero.node} />
            <span className={hero.slabLabel}>{copy.hero.layers[3]}</span>
          </div>
        </div>
      </div>

      <div className={hero.chips} aria-hidden="true">
        {chips.map((chip) => (
          <span key={chip.glyph} className={`${hero.chip} ${chip.light ? hero.chipLight : ""}`}
            style={chip.style as React.CSSProperties}>
            <Glyph name={chip.glyph} />
          </span>
        ))}
      </div>
    </TiltStage>
  );
}

export function CreativeHero() {
  const { eyebrow, lines, accent, summary, primary, secondary, support } = copy.hero;
  return (
    <section className={`${hero.hero} ${styles.dark}`} aria-labelledby="cp-hero-title">
      <div className={hero.backdrop} aria-hidden="true" />
      <div className={`${styles.wrap} ${hero.main}`}>
        <div className={hero.copy}>
          <p className={`${styles.label} ${hero.eyebrow}`}>{eyebrow}</p>
          <h1 id="cp-hero-title" className={`${styles.display} ${hero.title}`}>
            {lines.map((line) => <span key={line} className={styles.line}><span>{line}</span>{" "}</span>)}
            <span className={styles.line}><span><em>{accent}</em></span></span>
          </h1>
          <p className={hero.summary}>{summary}</p>
          <div className={styles.actions}>
            <PreviewCta label={primary} note={copy.ctaNote} />
            <PreviewCta label={secondary} note={copy.ctaNote} tone="ghost" />
          </div>
        </div>
        <LayerStack />
      </div>
      <p className={`${styles.wrap} ${hero.support}`}>{support}</p>
    </section>
  );
}
