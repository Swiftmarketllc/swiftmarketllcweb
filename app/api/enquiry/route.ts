import { handleEnquiryRequest } from "@/lib/enquiry/request";
import { unconfiguredEnquiry } from "@/lib/enquiry/submission";
import { getPublicationSafeContentByRouteId } from "@/lib/data/public-consumers";

export const runtime = "nodejs";
export async function POST(request: Request) {
  // UI state cannot enable this boundary. Canonical content and operational gates apply.
  const published = !!getPublicationSafeContentByRouteId("route:contact")
    && !!getPublicationSafeContentByRouteId("route:privacy");
  return handleEnquiryRequest(request, { ...unconfiguredEnquiry, readiness: {
    ...unconfiguredEnquiry.readiness, publicationApproved: published && unconfiguredEnquiry.readiness.publicationApproved,
  } });
}
