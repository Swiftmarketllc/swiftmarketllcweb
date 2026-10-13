import "server-only";
import nodemailer from "nodemailer";
import type { SendMailOptions } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import type { DeliveryProvider } from "./submission";
import type { SmtpConfigResult } from "./smtp-config";

export type SmtpTransportFactory = (options: SMTPTransport.Options) => Readonly<{
  sendMail: (message: SendMailOptions) => Promise<unknown>;
  close: () => void;
}>;
const defaultFactory: SmtpTransportFactory = options => nodemailer.createTransport(options);

/** No connections on import/construction. Only the gated submission workflow calls send. */
export function createSmtpDelivery(result: SmtpConfigResult, factory: SmtpTransportFactory = defaultFactory): DeliveryProvider | undefined {
  if (result.status !== "validated") return undefined;
  const config = result.config;
  return Object.freeze({
    async send(enquiry, recipient, idempotencyKey) {
      if (recipient !== config.recipient || !/^[a-zA-Z0-9-]{16,80}$/.test(idempotencyKey)) return { status: "rejected" };
      let transport: ReturnType<SmtpTransportFactory> | undefined;
      let deadline: ReturnType<typeof setTimeout> | undefined;
      try {
        transport = factory({
          host: config.host, port: config.port, secure: config.security === "tls",
          requireTLS: config.security === "starttls", ignoreTLS: false, opportunisticTLS: false,
          tls: { rejectUnauthorized: true, minVersion: "TLSv1.2", servername: config.host },
          auth: { user: config.username, pass: config.password },
          pool: false, logger: false, debug: false, transactionLog: false,
          disableFileAccess: true, disableUrlAccess: true,
          connectionTimeout: 10000, greetingTimeout: 10000, dnsTimeout: 10000, socketTimeout: 15000,
        });
        const info = await Promise.race([
          transport.sendMail({
            from: config.sender, to: config.recipient, replyTo: enquiry.contact.email,
            envelope: { from: config.sender, to: [config.recipient] },
            subject: "Website enquiry",
            text: [
              `Name: ${enquiry.contact.name}`, `Email: ${enquiry.contact.email}`,
              `Company: ${enquiry.contact.companyName ?? ""}`, `Website: ${enquiry.contact.website ?? ""}`,
              "", "Message:", enquiry.message,
            ].join("\n"),
            disableFileAccess: true, disableUrlAccess: true,
          }),
          // A response deadline is not proof that an SMTP transaction was cancelled.
          // Retain the durable reservation on unknown results; never blindly resend.
          new Promise<never>((_, reject) => { deadline = setTimeout(() => reject(new Error("SMTP deadline")), 30000); }),
        ]);
        // Message-ID or RCPT acceptance alone is insufficient: require final DATA acceptance.
        if (!info || typeof info !== "object") return { status: "unknown" };
        const data = info as Record<string, unknown>;
        if (Array.isArray(data.accepted) && Array.isArray(data.rejected)
          && data.accepted.length === 1 && data.accepted[0] === config.recipient && data.rejected.length === 0
          && typeof data.response === "string" && /^250[ -]/.test(data.response)
          && typeof data.messageId === "string" && !!data.messageId.trim()) {
          return { status: "accepted", providerReceipt: data.messageId };
        }
        return { status: "unknown" };
      } catch {
        // Errors may contain credentials, recipient addresses or message contents.
        // Unknown outcomes never produce success or automatic retries.
        return { status: "unknown" };
      } finally {
        if (deadline !== undefined) clearTimeout(deadline);
        try { transport?.close(); } catch { /* No raw transport logging. */ }
      }
    },
  } satisfies DeliveryProvider);
}
