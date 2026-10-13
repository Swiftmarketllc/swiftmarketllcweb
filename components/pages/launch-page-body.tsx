import type { CTA } from "@/lib/domain";
import { ColorBlock } from "@/components/sections/color-block";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { CTALink } from "@/components/ui/cta-link";

/** Presentation only: public callers supply content from the safe consumer. */
export type LaunchPageBodyProps = Readonly<{
  heading: string;
  summary: string;
  sections: readonly Readonly<{ id: string; heading: string; body: string; cta?: CTA }>[];
  cta?: CTA;
  reviewPrefix?: string;
}>;

export function LaunchPageBody({ heading, summary, sections, cta, reviewPrefix }: LaunchPageBodyProps) {
  const Heading = reviewPrefix ? "h3" : "h1";
  return <>
    <Container width="reading" className="section-compact stack">
      <Heading className={reviewPrefix ? "type-h3" : "type-h1"}>{heading}</Heading>
      <p className="type-body-large text-secondary">{summary}</p>
      {cta && <CTALink cta={cta} />}
    </Container>
    {sections.map((section, index) => {
      const id = reviewPrefix ? `${reviewPrefix}-${section.id}` : section.id;
      return <ColorBlock key={id} id={id} labelledBy={`${id}-heading`} surface={index % 2 ? "cool" : "warm"}>
        <SectionHeading id={`${id}-heading`} level={reviewPrefix ? 4 : 2} heading={section.heading} />
        <p>{section.body}</p>
        {section.cta && <CTALink cta={section.cta} />}
      </ColorBlock>;
    })}
  </>;
}
