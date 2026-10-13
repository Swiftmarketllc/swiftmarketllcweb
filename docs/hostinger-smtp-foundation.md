# Day 2 Phase 3 — Hostinger-compatible SMTP configuration

Hostinger is the owner-confirmed mailbox provider. info@swiftmarketllc.com is
the confirmed recipient ONLY. No SMTP settings, credentials, sender verification
or production hosting settings have been supplied.

Implemented: lazy server-only configuration validation, redacted diagnostics,
configurable recipient forwarding, synthetic tests, environment documentation
and the owner-authorized Phase 3B SMTP transport adapter.
Not performed: real authentication, connection verification or email sending.
All public submission gates remain false and all 53 canonical records remain
draft. Valid SMTP configuration does not attest working delivery or publication.

## Phase 3B approved dependency and adapter

The owner authorized nodemailer@10.1.0, installed at that exact version.
Its bundled TypeScript declarations work with the project's compiler, so no
separate types package was installed. Existing dependency versions and build
script policy remain unchanged.

lib/enquiry/smtp-delivery.ts implements DeliveryProvider. It returns no provider
for disabled/invalid configuration, creates no connection during import or
construction, and creates one nonpooled transport only when the gated workflow
calls send. The public endpoint still uses false operational readiness flags;
even complete SMTP configuration cannot authorize a send.

Implicit TLS or mandatory STARTTLS is selected from validated configuration.
Certificate checks are enforced with rejectUnauthorized=true, TLS 1.2 minimum
and the configured hostname as servername. There is no plaintext fallback,
opportunistic TLS, logging, URL/file access or pooling. Technical timeouts are
10 seconds for connection/DNS/greeting, 15 seconds idle socket and 30 seconds
overall; failures invoke the transport close API and return unknown without raw errors.
The overall deadline bounds the adapter response, not guaranteed transaction
cancellation: Nodemailer's nonpooled close API does not forcibly cancel an
in-flight send. Its connection/socket limits still apply. A timed-out message
may have been accepted, so keep the durable reservation and reconcile before
any resend. Mock tests verify close invocation, not actual socket cancellation.
These are engineering limits, not promised customer response times.

The envelope uses only the configured sender/recipient. The validated customer
email is Reply-To; body is plain text with no attachments or remote content.
The adapter rejects a mismatched recipient or unsafe idempotency key before
opening a transport. It requires exactly the configured accepted recipient,
no rejected recipients, a final 250 response and a nonempty Message-ID.
Only then is provider acceptance returned to the existing submission workflow,
which still requires durable acceptance recording before returning received.

Sources reviewed:
- [Nodemailer v10.1.0 release](https://github.com/nodemailer/nodemailer/releases/tag/v10.1.0)
- [SMTP transport documentation](https://nodemailer.com/smtp)
- [Hostinger account setup](https://www.hostinger.com/support/4305847-set-up-hostinger-email-on-your-applications-and-devices/)

Mocked tests cover acceptance, absent/partial acceptance, TLS modes, disabled
configuration, sender/recipient routing, authentication/connection/timeout
errors, the overall deadline, safe errors and durable-store failure. The Node
test loader substitutes Nodemailer so no test can use a real SMTP connection.
A Message-ID alone or successful connection/authentication is not delivery acceptance.
SMTP acceptance also does not prove inbox placement.

SMTP does not establish exactly-once delivery. Uncertain network outcomes must
retain the persistent reservation and require approved reconciliation; do not
blindly retry messages or assume the idempotency header is honored by SMTP.

## Server-only environment contract

| Variable | Required when enabled | Meaning |
| --- | --- | --- |
| ENQUIRY_SMTP_ENABLED | yes | Exact true or false; absent means disabled |
| ENQUIRY_SMTP_HOST | yes | Verified DNS hostname, not a URL or guessed preset |
| ENQUIRY_SMTP_PORT | yes | Explicit decimal port in 1–65535; no default |
| ENQUIRY_SMTP_SECURITY | yes | tls for implicit TLS, or starttls for mandatory upgrade |
| ENQUIRY_SMTP_USER | yes | Verified account login |
| ENQUIRY_SMTP_PASSWORD | yes | Server-only secret, preserved without trimming |
| ENQUIRY_SMTP_FROM | yes | Single owner-verified sender mailbox |
| ENQUIRY_RECIPIENT | yes | Single receiving mailbox, independent of sender/login |

Mailbox syntax cannot prove ownership, provider authorization or DNS setup.
The validator rejects header controls, recipient lists, display-name syntax,
unsupported security modes and missing fields. Disabled configuration does not
read/validate unrelated credentials. Invalid diagnostics contain field names
only. smtpConfigDiagnostics is the sole redacted diagnostic; the validated
config contains secrets and must never be logged, serialized to HTTP or sent
to Client Components. No automatic environment logging exists.

.env.example contains only a disabled flag and the confirmed non-secret
recipient; host, port, mode, login, password and sender remain unspecified.
Do not use NEXT_PUBLIC_ for any SMTP variable. Actual values belong in ignored
.env.local or approved hosting secret storage. Existing Next.js 16 environment
and server-only guidance was consulted.

## Obtain account-specific settings safely

1. Sign into the owner's Hostinger dashboard and select the actual domain/email
   account. Confirm which email product the mailbox uses.
2. Open its application/device or mail-client configuration instructions and
   copy the outgoing SMTP hostname, port and encryption mode from that account.
   Follow the product-specific help linked by the dashboard if it differs.
3. Confirm the correct mailbox login and authorized sender. Use the account's
   credential management flow; do not paste passwords into chat or documentation.
4. Confirm required domain authentication records and sender authorization with
   Hostinger. Do not infer these from the existence of the receiving address.

No published generic Hostinger settings are prefilled in project configuration.

## Local setup and approved testing

After separate credential/configuration authorization, set verified values in ignored .env.local,
initially with ENQUIRY_SMTP_ENABLED=false. Keep real passwords out of shell
commands, history and logs; use a local editor or approved secret manager.
Next.js expands dollar references in environment files: follow the installed
environment guide's escaping rules to preserve any literal dollar in a password.
Restart the server after configuration changes.

The dependency/adapter approval does not authorize real-email testing.
After separate authorization for controlled real-email testing:
1. Validate configuration and inspect redacted diagnostics only.
2. Verify TLS/authentication using the approved transport. Connection verification
   does not mark deliveryTested true or publish any page.
3. Send one clearly labelled synthetic test to the approved recipient through an
   isolated server-side test workflow, with approved durable abuse/idempotency
   storage. Do not bypass public gates by toggling the production endpoint.
4. Confirm provider acceptance and inbox receipt operationally; test refused
   recipients, invalid credentials, timeout/uncertain outcomes and store failures.
5. Keep public submission disabled until privacy, hosting, persistent abuse,
   tested delivery and explicit publication approvals are all complete.

No such connection or real-email test was performed in this milestone.

## Rotation and recipient changes

For credential rotation, disable delivery, rotate through Hostinger's mailbox
credential controls, update approved server secrets, restart/redeploy only when
separately authorized and repeat the controlled verification before re-enabling
delivery. Coordinate other applications using that mailbox and reconcile
uncertain pending sends; do not replay them automatically.

Change ENQUIRY_RECIPIENT in server configuration, validate the new mailbox and
test routing after approval. No source change is required. The Phase 2 confirmed
recipient remains the compatibility default only for trusted internal callers
that omit the recipient override. SMTP-enabled configuration itself requires
an explicit recipient and supplies it to the submission dependencies.

## Remaining decisions

Verified SMTP settings, login/password and sender;
hosting support for Node.js and outbound SMTP/TLS; production origin; durable
abuse/idempotency store and policy; secret storage; privacy/data handling;
operational monitoring/reconciliation; publication approval and browser QA.
There is no claim of production or inbox-delivery readiness.
