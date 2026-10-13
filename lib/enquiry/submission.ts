import "server-only";
import { createHmac, randomUUID } from "node:crypto";
import { validateEnquiry } from "./validation";
import type { ValidatedEnquiry } from "./validation";
import type { FormResult } from "./form-contract";
import { isSingleMailbox } from "./smtp-config";

/** Owner-confirmed recipient only. Does not configure sender identity or delivery. */
export const enquiryRecipient = "info@swiftmarketllc.com";
export type DeliveryProvider = Readonly<{
  send: (enquiry: ValidatedEnquiry, recipient: string, idempotencyKey: string) => Promise<
    Readonly<{ status: "accepted"; providerReceipt: string }> | Readonly<{ status: "rejected" | "unknown" }>
  >;
}>;
/**
 * Implementations MUST atomically enforce persistent rate limits and reserve
 * payload-bound idempotency across instances. No in-memory production adapter.
 */
export type PersistentAbuseControls = Readonly<{
  reserve: (input: Readonly<{ identity: string; key: string; fingerprint: string }>) => Promise<
    Readonly<{ status: "reserved"; lease: string }> | Readonly<{ status: "limited" | "duplicate" | "conflict" }>
  >;
  recordAccepted: (lease: string, receiptReference: string) => Promise<void>;
}>;
export type EnquiryDependencies = Readonly<{
  /** Trusted server configuration override; never taken from an enquiry payload. */
  recipient?: string;
  readiness: Readonly<{ privacyApproved: boolean; deliveryTested: boolean; abuseTested: boolean; publicationApproved: boolean }>;
  delivery?: DeliveryProvider;
  abuse?: PersistentAbuseControls;
  /** Approved server-only secret, at least 32 characters; never a public env var. */
  fingerprintSecret?: string;
  /** Trusted hosting identity extraction, not arbitrary forwarded/client headers. */
  identify?: (request: Request) => Promise<string | undefined>;
  origin?: string;
}>;
export const unconfiguredEnquiry: EnquiryDependencies = Object.freeze({
  readiness: Object.freeze({ privacyApproved: false, deliveryTested: false, abuseTested: false, publicationApproved: false }),
});
export function isEnquiryEnabled(deps: EnquiryDependencies): boolean {
  return deps.readiness.privacyApproved === true && deps.readiness.deliveryTested === true
    && deps.readiness.abuseTested === true && deps.readiness.publicationApproved === true
    && !!deps.delivery && !!deps.abuse && !!deps.identify && !!deps.origin
    && isSingleMailbox(deps.recipient ?? enquiryRecipient)
    && (deps.fingerprintSecret?.length ?? 0) >= 32;
}

export async function submitEnquiry(input: unknown, key: string, identity: string, deps: EnquiryDependencies): Promise<FormResult> {
  if (!isEnquiryEnabled(deps)) return { status: "unavailable" };
  const checked = validateEnquiry(input);
  if (checked.status !== "valid") return checked;
  if (!/^[a-zA-Z0-9-]{16,80}$/.test(key) || !identity || identity.length > 512) return { status: "blocked" };
  // Fixed field order; no raw personal data or low-entropy unsalted hashes in storage.
  const fingerprint = createHmac("sha256", deps.fingerprintSecret!).update(JSON.stringify([
    checked.value.contact.name, checked.value.contact.email, checked.value.message,
    checked.value.contact.companyName ?? "", checked.value.contact.website ?? "",
  ])).digest("hex");
  const opaqueIdentity = createHmac("sha256", deps.fingerprintSecret!).update(identity).digest("hex");
  try {
    const reservation = await deps.abuse!.reserve({ identity: opaqueIdentity, key, fingerprint });
    if (reservation.status === "duplicate") return { status: "duplicate" };
    if (reservation.status !== "reserved" || !reservation.lease) return { status: "blocked" };
    const delivered = await deps.delivery!.send(checked.value, deps.recipient ?? enquiryRecipient, key);
    if (delivered.status !== "accepted" || !delivered.providerReceipt.trim()) return { status: "unavailable" };
    const receiptReference = randomUUID();
    await deps.abuse!.recordAccepted(reservation.lease, receiptReference);
    return { status: "received", receiptReference };
  } catch {
    // Never echo provider errors or release uncertain reservations for automatic resend.
    // Operational reconciliation/expiry semantics require the approved durable adapter.
    return { status: "unavailable" };
  }
}
