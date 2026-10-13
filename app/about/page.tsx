import { launchPageMetadata, PublicLaunchPage } from "@/components/pages/public-launch-page";

export function generateMetadata() {
  return launchPageMetadata("route:about");
}

export default function Page() {
  return <PublicLaunchPage routeId="route:about" />;
}
