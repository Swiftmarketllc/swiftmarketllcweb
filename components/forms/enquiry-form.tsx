"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { fieldLimits } from "@/lib/enquiry/form-contract";
import type { EnquiryField, FormResult } from "@/lib/enquiry/form-contract";
import styles from "./enquiry-form.module.css";

const labels: Readonly<Record<EnquiryField, string>> = {
  name: "Name", email: "Email", message: "Message", company: "Company", website: "Website",
};
const order: readonly EnquiryField[] = ["name", "email", "company", "website", "message"];
const required = new Set<EnquiryField>(["name", "email", "message"]);

/** UI enablement is never server authorization. Default is always disabled. */
export function EnquiryForm({ enabled = false }: Readonly<{ enabled?: boolean }> = {}) {
  const id = useId();
  const [result, setResult] = useState<FormResult>({ status: "idle" });
  const [submitting, setSubmitting] = useState(false);
  const key = useRef<string | null>(null);
  const inFlight = useRef(false);
  const status = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (result.status !== "idle") status.current?.focus();
  }, [result]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enabled || inFlight.current || result.status === "received") return;
    const data = new FormData(event.currentTarget);
    const payload = Object.fromEntries([...order, "companyFax"].map(field => [field, data.get(field) ?? ""]));
    inFlight.current = true;
    setSubmitting(true);
    try {
      key.current ??= crypto.randomUUID();
      const response = await fetch("/api/enquiry", { method: "POST", headers: {
        "Content-Type": "application/json", "Idempotency-Key": key.current,
      }, body: JSON.stringify(payload) });
      const value: unknown = await response.json();
      if (!value || typeof value !== "object" || !("status" in value)) throw new Error();
      if (response.ok && value.status === "received" && "receiptReference" in value
        && typeof value.receiptReference === "string" && /^[a-f0-9-]{36}$/i.test(value.receiptReference)) {
        setResult({ status: "received", receiptReference: value.receiptReference });
      } else if (value.status === "invalid" && "errors" in value && value.errors && typeof value.errors === "object") {
        const errors: Partial<Record<EnquiryField, string>> = {};
        for (const field of order) if (Object.hasOwn(value.errors, field)) errors[field] = "Check this field and try again.";
        setResult({ status: "invalid", errors });
        // Invalid data never reserves a submission; correction can use a new key.
        key.current = null;
      } else if (value.status === "duplicate") setResult({ status: "duplicate" });
      else if (value.status === "blocked") setResult({ status: "blocked" });
      else setResult({ status: "unavailable" });
    } catch { setResult({ status: "unavailable" }); }
    finally { inFlight.current = false; setSubmitting(false); }
  }

  const message = submitting ? "Submitting your enquiry…"
    : result.status === "received" ? "Your enquiry was accepted for delivery."
    : result.status === "invalid" ? "Review your entries. Your enquiry has not been sent."
    : result.status === "duplicate" ? "This submission is already being handled. No new enquiry was sent."
    : result.status === "blocked" ? "This submission could not be accepted. No enquiry was sent."
    : result.status === "unavailable" ? "Delivery is unavailable. Receipt has not been confirmed; your entries are retained."
    : enabled ? "Complete the required fields to send an enquiry."
    : "Internal foundation only. Submission is disabled pending privacy, delivery, abuse controls and publication approval.";

  return <form className={styles.form} onSubmit={submit} aria-describedby={`${id}-status`} aria-busy={submitting}>
    <p id={`${id}-status`} ref={status} role="status" aria-live="polite" tabIndex={-1}>{message}</p>
    <fieldset disabled={!enabled || submitting || result.status === "received"} className={styles.fields}>
      <legend>Enquiry details — provisional fields</legend>
      {order.map(field => {
        const error = result.status === "invalid" ? result.errors[field] : undefined;
        const props = { id: `${id}-${field}`, name: field, required: required.has(field), maxLength: fieldLimits[field],
          "aria-invalid": error ? true as const : undefined, "aria-describedby": error ? `${id}-${field}-error` : undefined };
        return <div key={field} className={styles.field}>
          <label htmlFor={props.id}>{labels[field]} ({required.has(field) ? "required" : "optional"})</label>
          {field === "message" ? <textarea {...props} rows={6} />
            : <input {...props} type={field === "email" ? "email" : field === "website" ? "url" : "text"}
              autoComplete={field === "name" ? "name" : field === "email" ? "email" : field === "company" ? "organization" : "url"} />}
          {error && <p id={`${id}-${field}-error`} className={styles.error}>{error}</p>}
        </div>;
      })}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor={`${id}-fax`}>Leave this technical bot-filter field empty</label>
        <input id={`${id}-fax`} name="companyFax" tabIndex={-1} autoComplete="off" />
      </div>
      <Button type="submit" disabled={!enabled || submitting || result.status === "received"}>
        {submitting ? "Submitting…" : enabled ? "Send enquiry" : "Submission unavailable"}
      </Button>
    </fieldset>
  </form>;
}
