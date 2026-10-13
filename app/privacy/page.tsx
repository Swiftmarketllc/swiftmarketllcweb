import { launchPageMetadata, PublicLaunchPage } from "@/components/pages/public-launch-page";

export function generateMetadata() {
  return launchPageMetadata("route:privacy");
}

export default function Page() {
  return <PublicLaunchPage routeId="route:privacy" />;
}
