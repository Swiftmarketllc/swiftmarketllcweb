import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { RouteId } from "@/lib/domain";
import { getPublicationSafeContentByRouteId, getPublicationSafeRouteById } from "@/lib/data/public-consumers";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MainContent } from "@/components/layout/main-content";
import { LaunchPageBody } from "./launch-page-body";

/** Phase 1 remains noindex even if an editorial approval is supplied later. */
export function launchPageMetadata(routeId: RouteId): Metadata {
  const route = getPublicationSafeRouteById(routeId);
  return {
    title: route?.metadata.title.state === "approved" ? route.metadata.title.value : "Page unavailable",
    description: route?.metadata.description.state === "approved" ? route.metadata.description.value : "",
    robots: { index: false, follow: false },
  };
}

export function PublicLaunchPage({ routeId }: Readonly<{ routeId: RouteId }>) {
  const record = getPublicationSafeContentByRouteId(routeId);
  if (!record || record.heading.state !== "approved" || record.summary.state !== "approved"
    || record.sections.state !== "approved") notFound();
  return <>
    <SiteHeader />
    <MainContent><LaunchPageBody heading={record.heading.value} summary={record.summary.value}
      sections={record.sections.value} cta={record.cta.state === "approved" ? record.cta.value : undefined} /></MainContent>
    <SiteFooter />
  </>;
}
