# Swift Design System v2.0 — approved Day 1 presentation

This is bounded presentation and shell work on checkpoint `54ebcc5`, not production publication, a replacement homepage or a separate M5.1.2 milestone. DESIGN-figma.md supplies visual inspiration only; its fonts, business flows, tooling instructions and original palette are not Swift requirements.

## Approved roles and contrast

Existing M3 declarations remain unchanged: Warm Red #FF4E45, Navy #11182F, White #FFFFFF, approved font stack, type scale, spacing, 80rem page width and 65ch reading measure.

Two additive roles in app/globals.css are opt-in: `--surface-story-warm: #FFEAE9` and `--surface-story-cool: #E7E8EA`. Navy text has approximately 15.22:1 and 14.33:1 contrast respectively. Existing secondary text #414B60 has approximately 7.58:1 and 7.14:1. Muted text #626B7D on the cool surface is approximately 4.37:1, so ColorBlock maps the text-muted utility to secondary text locally. Other supporting content must use navy or secondary text, not opacity-based muted copy.

Navy on Swift Red is approximately 5.38:1; white on Swift Red is approximately 3.27:1 and is not approved for normal-size CTA text. Calculations are not accessibility certification. No proprietary font, new font asset, dependency, gradient or animation is added. Solid local Helvetica Neue face selection is preserved.

## Opt-in composition

- `components/ui/brand-presentation.module.css`: pill and softly rounded card classes, using existing radius tokens. Apply through existing className props; default Button/Card styles and all seven primitive APIs remain unchanged.
- `components/sections/color-block.tsx` and its CSS: validated Section IDs/heading references, page Container and nested reading Container; warm/cool backgrounds, navy text, responsive padding from existing spacing tokens and existing 12px large radius. No new geometric token is needed.
- `components/ui/cta-link.tsx`: server-rendered anchor using resolvePublicationSafeConsumerCTA. Missing, draft, ineligible, unverified-fragment and submit destinations render nothing. It accepts no href override or navigation callback. Primary/secondary pills and text links retain focus and minimum-height behavior.
- `components/navigation/public-navigation.tsx`: necessary server-only shared header/footer rendering of canonical publication-safe navigation groups. Header uses primary/utility groups; footer uses company/solutions/legal groups. Each anchor is also resolved through CTALink. Nested disclosures retain independent parent links. No arbitrary destination or final marketing label is fabricated.
- `site-header.tsx`, `site-footer.tsx` and site-shell.module.css: server shell; an ineligible Home destination leaves a plain brand name. Empty groups produce no navigation or mobile control. No contact address, copyright assertion, proof or legal content is invented.
- `mobile-menu.tsx` and navigation.module.css: smallest client boundary, a native in-flow details/summary disclosure. Native expanded semantics, normal Tab order, Escape closes and returns focus to summary; selecting a link closes it. It is not modal and does not trap focus. Desktop navigation replaces the disclosure at 48rem; this is a layout breakpoint, not device detection.

Trusted optional PublicConsumerSources props are server-side editorial/test inputs. They are not external-input parsing, a publication bypass or private enquiry payloads. Only already rendered safe navigation is passed to the mobile component.

The shell is demonstrated inside the existing internal preview. Its header/footer are local examples there, not global page landmarks. Future production composition must place the site header/footer outside the single MainContent landmark. This task changes neither app/page.tsx nor app/layout.tsx; preview noindex/nofollow and the skip target remain intact.

## Accessibility and verification

Native anchors and buttons remain distinct. Links/summary controls retain the 44px minimum height, visible keyboard focus and readable wrapping. Panels/cards remain height-flexible; no horizontal overflow hiding or fixed-height text clipping is added. Mobile action groups retain their existing 40rem rule; badges remain content-sized with 8px gaps. Existing reduced-motion handling applies; forced colors retain visible panel/card boundaries. New panels use no decorative text stroke or shadow.

Run all existing data suites and component tests, TypeScript, lint, production build and Git whitespace/scope checks. Synthetic publication fixtures belong in tests only. SSR tests protect semantics and data gating but do not verify actual browser layout, focus or native interactions. Manual checks remain required at 320px, intermediate/tablet/desktop widths, 200% enlarged text, 400% zoom, keyboard navigation, forced colors, reduced motion and unavailable-font fallback. Specifically exercise a populated synthetic/test menu before approving its keyboard behavior; the canonical inventory currently supplies no menu links.

## Boundaries and pending inputs

M4 types, 22 families, 11 industries, six tiers, custom Enterprise, 53 route/content records and publication gates remain unchanged. All canonical destinations are draft; the shell and CTA sample emit no public links. Existing enquiry/proposal-first conversion and separate external costs are preserved.

Production copy, prices, scope/deliverables, evidence, legal wording, origin, hosting, enquiry delivery and integrations remain TBF. No forms, backend, analytics, deployment configuration, checkout or production route is implemented. Selection-bearing enquiry CTAs are omitted by CTALink until the later approved enquiry workflow defines selection transport; the component must not drop selected IDs or invent query parameters. This UI limitation does not change M4 resolver contracts. Appearance approval is not content, operational or publication approval. Commit/push/deploy require separate authorization.
