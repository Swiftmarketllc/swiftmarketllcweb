import "server-only";
import type { ContactFields } from "@/lib/domain/enquiries";
import { fieldLimits, maxPayloadBytes } from "./form-contract";
import type { EnquiryField, FieldErrors } from "./form-contract";

export type ValidatedEnquiry = Readonly<{
  contact: ContactFields & Readonly<{ name: string; email: string }>;
  message: string;
}>;
export type ValidationResult =
  | Readonly<{ status: "valid"; value: ValidatedEnquiry }>
  | Readonly<{ status: "invalid"; errors: FieldErrors }>
  | Readonly<{ status: "blocked" }>;

/** Bounds are technical input limits, never commercial scope quantities. */
export function validateEnquiry(input: unknown): ValidationResult {
  const invalid = (): ValidationResult => ({ status: "invalid", errors: {} });
  if (!input || typeof input !== "object" || Array.isArray(input)) return invalid();
  const descriptors = Object.getOwnPropertyDescriptors(input);
  const keys = Object.keys(descriptors);
  const allowed = [...Object.keys(fieldLimits), "companyFax"];
  if (keys.some(key => !allowed.includes(key) || !("value" in descriptors[key])
    || typeof descriptors[key].value !== "string")) return invalid();
  const raw = input as Record<string, string>;
  if (Buffer.byteLength(JSON.stringify(raw), "utf8") > maxPayloadBytes) return invalid();
  if (raw.companyFax?.trim()) return { status: "blocked" };
  const errors: Partial<Record<EnquiryField, string>> = {};
  const values = {} as Record<EnquiryField, string>;
  for (const field of Object.keys(fieldLimits) as EnquiryField[]) {
    const value = (raw[field] ?? "").replace(/\r\n?/g, "\n").trim();
    values[field] = value;
    if (["name", "email", "message"].includes(field) && !value) errors[field] = "This field is required.";
    else if (value.length > fieldLimits[field]) errors[field] = "This entry is too long.";
    else if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(value)
      || (field !== "message" && /[\n\t]/.test(value))) errors[field] = "Use valid text.";
  }
  const email = values.email;
  const parts = email.split("@");
  if (email && (parts.length !== 2 || parts[0].length > 64 || parts[0].startsWith(".")
    || parts[0].endsWith(".") || parts[0].includes("..")
    || !/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(parts[0])
    || !/^(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/.test(parts[1]))) {
    errors.email = "Enter a valid email address.";
  }
  if (values.website) {
    try {
      const url = new URL(values.website);
      if (!["https:", "http:"].includes(url.protocol) || !url.hostname || url.username || url.password) throw new Error();
      values.website = url.toString();
    } catch { errors.website = "Enter a full http or https website URL."; }
  }
  if (Object.keys(errors).length) return { status: "invalid", errors };
  const at = values.email.lastIndexOf("@");
  return { status: "valid", value: {
    contact: { name: values.name.replace(/\s+/g, " "), email: values.email.slice(0, at) + "@" + values.email.slice(at + 1).toLowerCase(),
      ...(values.company ? { companyName: values.company.replace(/\s+/g, " ") } : {}),
      ...(values.website ? { website: values.website } : {}) },
    message: values.message,
  } };
}
