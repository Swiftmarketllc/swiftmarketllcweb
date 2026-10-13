import { getPublicationSafeContentByRouteId } from "@/lib/data/public-consumers";
import type { CTA } from "@/lib/domain";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MainContent } from "@/components/layout/main-content";
import { HomeHero } from "@/components/sections/home-hero";
import { HomeCapabilities } from "@/components/sections/home-capabilities";
import { HomeStory } from "@/components/sections/home-story";
import type { CapabilityView } from "@/components/sections/home-capabilities";
import { Badge } from "@/components/ui/badge";
import storyStyles from "@/components/sections/home-story.module.css";

/** Presentation input, not a business registry. Public input comes only from the safe adapter. */
export type HomepageCompositionProps = Readonly<{
  heading: string; summary: string; cta?: CTA;
  capabilities: readonly CapabilityView[];
  stories: readonly CapabilityView[];
  reviewNotice?: string;
}>;
export function HomepageComposition({ heading, summary, cta, capabilities, stories, reviewNotice }: HomepageCompositionProps) {
  return <>
    <SiteHeader />
    <MainContent>
      {reviewNotice && <div className="page-container stack"><Badge>DRAFT / TBF</Badge><p className="type-body-small text-secondary">{reviewNotice}</p></div>}
      <HomeHero heading={heading} summary={summary} cta={cta} />
      {!!stories.length && <div className={storyStyles.sequence}>
        {stories.map((story, index) => <HomeStory key={story.id} {...story} surface={index % 2 ? "cool" : "warm"} />)}
      </div>}
      <HomeCapabilities items={capabilities} />
    </MainContent>
    <SiteFooter />
  </>;
}
/** Intentionally unmounted. Canonical drafts produce no public homepage. */
export function Homepage() {
  const record = getPublicationSafeContentByRouteId("route:home");
  if (!record || record.heading.state !== "approved" || record.summary.state !== "approved" || record.sections.state !== "approved") return null;
  // Overview sections form the capability grid; other approved sections form stories.
  const items = record.sections.value;
  return <HomepageComposition heading={record.heading.value} summary={record.summary.value}
    cta={record.cta.state === "approved" ? record.cta.value : undefined}
    capabilities={items.filter(section => section.role === "overview")}
    stories={items.filter(section => section.role !== "overview")} />;
}
