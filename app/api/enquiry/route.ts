import { handleEnquiryRequest } from "@/lib/enquiry/request";
import { unconfiguredEnquiry } from "@/lib/enquiry/submission";
import { getPublicationSafeContentByRouteId } from "@/lib/data/public-consumers";
import { readSmtpConfig } from "@/lib/enquiry/smtp-config";
import { createSmtpDelivery } from "@/lib/enquiry/smtp-delivery";

export const runtime = "nodejs";
export async function POST(request: Request) {
  const smtp = readSmtpConfig();
  // UI state cannot enable this boundary. Canonical content and operational gates apply.
  const published = !!getPublicationSafeContentByRouteId("route:contact")
    && !!getPublicationSafeContentByRouteId("route:privacy");
  return handleEnquiryRequest(request, { ...unconfiguredEnquiry,
    delivery: createSmtpDelivery(smtp),
    recipient: smtp.status === "validated" ? smtp.config.recipient : undefined, readiness: {
    ...unconfiguredEnquiry.readiness, publicationApproved: published && unconfiguredEnquiry.readiness.publicationApproved,
  } });
}
