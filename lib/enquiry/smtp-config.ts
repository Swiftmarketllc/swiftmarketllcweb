import "server-only";

export const smtpEnvironmentNames = Object.freeze({
  enabled: "ENQUIRY_SMTP_ENABLED", host: "ENQUIRY_SMTP_HOST", port: "ENQUIRY_SMTP_PORT",
  security: "ENQUIRY_SMTP_SECURITY", username: "ENQUIRY_SMTP_USER", password: "ENQUIRY_SMTP_PASSWORD",
  sender: "ENQUIRY_SMTP_FROM", recipient: "ENQUIRY_RECIPIENT",
} as const);
type ConfigField = keyof typeof smtpEnvironmentNames;
export type SmtpConfig = Readonly<{
  host: string; port: number; security: "tls" | "starttls";
  username: string; password: string; sender: string; recipient: string;
}>;
export type SmtpConfigResult =
  | Readonly<{ status: "disabled" }>
  | Readonly<{ status: "invalid"; fields: readonly ConfigField[] }>
  | Readonly<{ status: "validated"; config: SmtpConfig }>;

/** Single bare mailbox only: no display names, lists or header control characters. */
export function isSingleMailbox(value: string): boolean {
  return value.length <= 254 && value.split("@")[0].length <= 64
    && /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/.test(value);
}

/** Lazy, server-only. No network, logging, default host/port, or activation side effects. */
export function readSmtpConfig(env: Readonly<Record<string, string | undefined>> = process.env): SmtpConfigResult {
  const flag = env[smtpEnvironmentNames.enabled];
  if (flag === undefined || flag === "false") return Object.freeze({ status: "disabled" });
  if (flag !== "true") return Object.freeze({ status: "invalid", fields: Object.freeze(["enabled"] as const) });
  const values = Object.fromEntries(Object.entries(smtpEnvironmentNames).map(([key, name]) => [key, env[name] ?? ""])) as Record<ConfigField, string>;
  const fields: ConfigField[] = [];
  const host = values.host;
  if (host.length > 253 || !/^(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/.test(host)) fields.push("host");
  const port = Number(values.port);
  if (!/^[1-9]\d{0,4}$/.test(values.port) || port > 65535) fields.push("port");
  if (values.security !== "tls" && values.security !== "starttls") fields.push("security");
  if (!values.username || values.username.length > 254 || /\s|[\u0000-\u001F\u007F]/.test(values.username)) fields.push("username");
  // Preserve password bytes exactly; trimming changes credentials. Never echo them.
  if (!values.password || values.password.length > 4096 || /[\u0000-\u001F\u007F]/.test(values.password)) fields.push("password");
  if (!isSingleMailbox(values.sender)) fields.push("sender");
  if (!isSingleMailbox(values.recipient)) fields.push("recipient");
  if (fields.length) return Object.freeze({ status: "invalid", fields: Object.freeze(fields) });
  return Object.freeze({ status: "validated", config: Object.freeze({
    host, port, security: values.security as SmtpConfig["security"],
    username: values.username, password: values.password, sender: values.sender, recipient: values.recipient,
  }) });
}

/** Only this redacted diagnostic may be logged; never log/serialize config itself. */
export function smtpConfigDiagnostics(result: SmtpConfigResult) {
  return Object.freeze({ status: result.status,
    ...(result.status === "invalid" ? { fields: result.fields } : {}) });
}
