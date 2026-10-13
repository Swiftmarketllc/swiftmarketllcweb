import type { Metadata } from "next";
import { MainContent } from "@/components/layout/main-content";
import { UIPrimitivesPreview } from "@/components/preview/ui-primitives-preview";
import previewStyles from "@/components/preview/ui-primitives-preview.module.css";

export const metadata: Metadata = {
  title: "Design System Foundation",
  description: "Temporary internal preview of the Swift Market LLC design foundation.",
  robots: { index: false, follow: false },
};

const brandColors = [
  { name: "Warm Red", value: "#FF4E45", style: "bg-primary text-primary-foreground" },
  { name: "Outer Space", value: "#11182F", style: "bg-foreground text-background" },
  { name: "Perfect White", value: "#FFFFFF", style: "bg-surface text-foreground" },
] as const;

const typeSamples = [
  { label: "Display", className: "type-display", sample: "Clear by design." },
  { label: "H1", className: "type-h1", sample: "A confident foundation." },
  { label: "H2", className: "type-h2", sample: "Room for ideas." },
  { label: "H3", className: "type-h3", sample: "Balance and hierarchy." },
  { label: "H4", className: "type-h4", sample: "Details with purpose." },
  { label: "Body large", className: "type-body-large", sample: "Fluid type and generous spacing keep content comfortable to read." },
  { label: "Body", className: "type-body", sample: "The default reading size uses a restrained line length and a relaxed line height." },
  { label: "Body small", className: "type-body-small", sample: "Supporting information remains legible at smaller sizes." },
  { label: "Label", className: "type-label", sample: "A clear label" },
  { label: "Eyebrow", className: "type-eyebrow", sample: "A small introduction" },
] as const;

export default function DesignSystemPreview() {
  return (
    <MainContent>
      <div className="section page-container stack">
        <p className="type-eyebrow text-secondary">M3 / Internal preview</p>
        <h1 className="type-h1">Swift Market LLC — Design System Foundation</h1>
        <p className="type-body-large text-secondary">
          Temporary reference for future pages. Approved brand tokens, reusable
          typography, and layout primitives. This is not the final homepage.
        </p>
        <p className="type-body-small text-muted">
          Neue Haas Grotesk is used only when legally available locally. No font
          files are bundled or downloaded; otherwise the system fallback stack applies.
        </p>
        <a href="#interactions">Jump to interaction samples</a>
      </div>

      <section className="section-compact" aria-labelledby="palette-heading">
        <div className="page-container stack">
          <h2 id="palette-heading">01 / Color and surfaces</h2>
          <div className="responsive-grid">
            {brandColors.map((color) => (
              <figure key={color.name}>
                <div
                  className={`h-20 rounded-sm border border-border ${color.style}`}
                  aria-hidden="true"
                />
                <figcaption className="pt-4">
                  <h3 className="type-h4">{color.name}</h3>
                  <p className="font-mono type-body-small text-secondary">{color.value}</p>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="responsive-grid">
            <div className="surface stack shadow-subtle">
              <h3 className="type-h4">Surface / subtle shadow</h3>
              <p className="text-secondary">Secondary text supports the hierarchy.</p>
              <p className="type-body-small text-muted">Muted text remains readable.</p>
            </div>
            <div className="surface surface-subtle stack shadow-elevated">
              <h3 className="type-h4">Subtle surface / elevated shadow</h3>
              <p className="text-success">Success — example status</p>
              <p className="text-warning">Warning — example status</p>
              <p className="text-error">Error — example status</p>
            </div>
          </div>
          <p className="type-body-small text-secondary">
            Warm Red uses navy text. Text links and error messages use a darker
            red for contrast. Status labels communicate meaning alongside color.
          </p>
        </div>
      </section>

      <section className="section page-container stack" aria-labelledby="type-heading">
        <h2 id="type-heading">02 / Typography</h2>
        <div className="stack">
          {typeSamples.map((sample) => (
            <div key={sample.label} className="border-t border-border pt-6">
              <p className="type-label text-muted mb-3">{sample.label}</p>
              <p className={sample.className}>{sample.sample}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-compact bg-surface-subtle" aria-labelledby="layout-heading">
        <div className="page-container stack">
          <h2 id="layout-heading">03 / Layout and rhythm</h2>
          <p className="type-body text-secondary">
            This full-width section contains an 80rem (1280px) maximum page
            container with fluid gutters. Standard and compact sections share a
            fluid spacing system.
          </p>
          <div className="reading-container stack">
            <h3 className="type-h4">Narrow reading container / 65ch</h3>
            <p>Reading content stays centered and comfortably constrained while the surrounding page can use a wider grid.</p>
          </div>
          <div className="responsive-grid">
            {[
              { label: "Small / 0.5rem", spacing: "p-2" },
              { label: "Medium / 1.5rem", spacing: "p-6" },
              { label: "Large / 3rem", spacing: "p-12" },
            ].map((sample) => (
              <div key={sample.label} className={`border-t border-border ${sample.spacing}`}>
                <p className="type-label">{sample.label}</p>
                <p className="type-body-small text-secondary">Inset spacing sample</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="interactions" className="section page-container stack" aria-labelledby="interaction-heading">
        <h2 id="interaction-heading">04 / Interaction basics</h2>
        <p className="type-body text-secondary">
          Use Tab to inspect focus rings. Hover or press the sample links to
          inspect state changes. Select text to inspect the selection colors.
        </p>
        <a href="#palette-heading">Text link — return to the palette</a>
        <div className={previewStyles.actionGroup}>
          <a href="#type-heading" className="button-base button-primary">Primary style — view type</a>
          <a href="#layout-heading" className="button-base">Neutral style — view layout</a>
          <button type="button" className="button-base button-primary" disabled>Disabled sample</button>
        </div>
        <p className="type-body-small text-muted">
          These are CSS foundation samples. Final Button components, site
          navigation, services, packages, and footer are deferred.
        </p>
      </section>
      <UIPrimitivesPreview />
    </MainContent>
  );
}
