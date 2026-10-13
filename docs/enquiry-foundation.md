# Day 2 Phase 2 — secure enquiry foundation

This phase does not enable public submissions or publish content. All 53
canonical route/content records remain draft. Contact and Privacy continue to
return not-found through the existing public consumers. M3/M4 and commercial
data are unchanged.

## Files and responsibilities

- lib/enquiry/form-contract.ts: serializable UI outcomes and technical field
  limits; no private lead data or configuration.
- lib/enquiry/validation.ts: server-only validation, narrowing and normalization
  into the existing private ContactFields contract.
- lib/enquiry/submission.ts: server-only provider/persistent abuse contracts,
  fail-closed readiness and submission orchestration.
- lib/enquiry/request.ts: bounded streamed JSON parsing and safe HTTP responses.
- app/api/enquiry/route.ts: POST-only Node runtime boundary. Requires eligible
  Contact/Privacy content AND all operational approvals. No environment switch
  or client prop can enable the currently unconfigured handler.
- components/forms/enquiry-form.tsx and CSS: reusable client form with native
  labels/types, required indicators, status announcements, field errors,
  pending/disabled controls, retained input and status focus.
- Development-only launch preview demonstrates the disabled form. The Phase 1
  demo is preserved. No form is mounted on a public Contact page.

## Input contract

Provisional fields: required name, email and message; optional company and
website. The only additional request field is companyFax, a technical honeypot,
not a request for extra personal information. Unknown fields, nested/non-string
values and malformed JSON are rejected; omitted optional fields are valid.

Technical character caps: name 120, email 254, message 5000, company 160 and
website 2048. Raw JSON and streamed request bytes are limited to 16 KiB, even
without Content-Length. UTF-8 decoding rejects malformed bytes. These bounds
do not define commercial quantities, timelines or scope.

Trim edges, normalize line endings, collapse name/company whitespace, lowercase
only the email domain. Reject control characters and email-header line breaks.
Email validation checks common address syntax, not mailbox existence or full
RFC support. Website must be an absolute http/https URL without credentials;
URLs are never fetched. Message remains plain text and must be sent by a future
provider as safely encoded text, not interpolated HTML or mail headers.

## Delivery and public lock

The owner confirmed info@swiftmarketllc.com as recipient ONLY. There is no
SMTP host, sender identity, provider, credential, transport or persistence
configured. No console delivery fallback or personal-data logging exists.

Privacy approval, tested delivery, tested persistent abuse controls and explicit
publication approval are all false. Identity extraction, approved production
origin, fingerprint secret and both adapters are absent. The live POST boundary
returns 503/unavailable before reading the body. Disabled UI has a disabled
fieldset/button and an on-submit guard, including keyboard submission.

Future enablement requires separately authorized server configuration and
eligible Contact/Privacy records. Render the approved privacy notice with the
form before activation. Client enablement is usability only, never authorization.

## Abuse and duplicate boundary

Enabled requests require exact approved Origin, JSON media type, no compression
and a bounded idempotency header. Do not accept an arbitrary forwarded address
as trusted client identity; hosting-specific extraction remains unconfigured.
The server HMACs that identity and the normalized payload using an approved
server-only secret. Raw email/message contents are not given to the abuse store.
HMACs remain sensitive pseudonymous data, not anonymous data.

PersistentAbuseControls.reserve must atomically enforce durable rate limits and
payload-bound idempotency across instances. Concurrent duplicate keys must not
both deliver; changed payloads with the same key must conflict. Choose rate
windows, fingerprint duplicate policy, retention and lease/reconciliation rules
with the hosting/storage/privacy decisions. No production in-memory adapter is
provided. Test Maps are clearly synthetic fixtures only.

The client suppresses concurrent attempts and retains a key on uncertain
failures. Rate-limit refusal, missing identity, storage outage or duplicate
reservation prevents delivery. Reservations are not automatically released
after uncertain provider outcomes: blind retries could deliver duplicate mail.
Provider adapters need bounded timeouts, safe plaintext encoding, provider
idempotency where supported, verified acceptance semantics and operational
reconciliation. These remain integration prerequisites.

Only a provider's confirmed nonempty acceptance receipt followed by successful
durable acceptance recording yields received. It means provider acceptance,
not proof of inbox arrival, owner follow-up or delivery-time guarantees.
The public receipt is a generated opaque UUID, never a provider identifier.
Failure and exception responses do not echo payloads or raw provider errors.
No durable lead/CRM workflow is claimed.

## Validation and pending work

Node tests use synthetic payloads and adapters; no email or network delivery.
Coverage includes validation/normalization, missing/extra fields, honeypot,
payload sizes, gates, concurrency/idempotency conflicts, persistent limits and
outages, rejected/unknown/confirmed delivery, safe errors and public disabling.
Existing registry/publication suites remain regression checks.

Owner decisions: provisional fields and privacy/data handling; email provider,
verified sender and account credentials; hosting and origin; trusted abuse
identity, persistent store/limits/idempotency retention and server secret;
operational monitoring and reconciliation; explicit content/publication approval.
Provider-specific environment variable names are intentionally not invented.
Credentials must remain server-only in approved secret storage or ignored env
files, never NEXT_PUBLIC_.

Browser QA is pending: focus/status behavior, validation recovery, keyboard,
reflow, native autofill, reduced motion and forced colors. There is no production
readiness or privacy/accessibility conformance claim.
