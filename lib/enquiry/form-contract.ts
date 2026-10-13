/** Public technical form contract only; no private lead/provider configuration. */
export const fieldLimits = Object.freeze({ name: 120, email: 254, message: 5000, company: 160, website: 2048 });
export type EnquiryField = keyof typeof fieldLimits;
export type FieldErrors = Readonly<Partial<Record<EnquiryField, string>>>;
export type FormResult =
  | Readonly<{ status: "idle" }>
  | Readonly<{ status: "invalid"; errors: FieldErrors }>
  | Readonly<{ status: "unavailable" | "blocked" | "duplicate" }>
  | Readonly<{ status: "received"; receiptReference: string }>;
export const maxPayloadBytes = 16 * 1024;
