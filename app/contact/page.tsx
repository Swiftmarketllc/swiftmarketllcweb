import { launchPageMetadata, PublicLaunchPage } from "@/components/pages/public-launch-page";

export function generateMetadata() {
  return launchPageMetadata("route:contact");
}

export default function Page() {
  return <PublicLaunchPage routeId="route:contact" />;
}
