import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const text = readFileSync(new URL("../../.env.example", import.meta.url), "utf8");
// Active assignments and commented-out placeholders such as "# NAME=".
const assignments = text.split("\n").map((line) => /^#?\s*([A-Z][A-Z0-9_]+)=(.*)$/.exec(line)).filter(Boolean)
  .map(([, name, value]) => ({ name, value, active: !text.split("\n").find((l) => l.startsWith(`# ${name}=`) || l.startsWith(`#${name}=`)) }));
const names = new Set(assignments.map((entry) => entry.name));

test(".env.example documents every variable the v3.0 enquiry and operations flow needs", () => {
  for (const name of [
    "SITE_ORIGIN", "ENQUIRY_FINGERPRINT_SECRET", "DATABASE_URL", "RATE_LIMIT_STORE_URL",
    "ENQUIRY_SMTP_ENABLED", "ENQUIRY_SMTP_HOST", "ENQUIRY_SMTP_PORT", "ENQUIRY_SMTP_SECURITY",
    "ENQUIRY_SMTP_USER", "ENQUIRY_SMTP_PASSWORD", "ENQUIRY_SMTP_FROM", "ENQUIRY_RECIPIENT",
  ]) assert.equal(names.has(name), true, `${name} is not documented`);
});

test("the SMTP names read by the code are all documented", () => {
  const source = readFileSync(new URL("./smtp-config.ts", import.meta.url), "utf8");
  const used = [...source.matchAll(/"(ENQUIRY_[A-Z_]+)"/g)].map((match) => match[1]);
  assert.equal(used.length >= 8, true);
  for (const name of used) assert.equal(names.has(name), true, `${name} is read but not documented`);
});

test(".env.example carries no secret values and no NEXT_PUBLIC secrets", () => {
  const secretLike = /(SECRET|PASSWORD|TOKEN|DATABASE_URL|STORE_URL|DSN|STORAGE_URL)/;
  for (const { name, value } of assignments) {
    if (secretLike.test(name)) assert.equal(value.trim(), "", `${name} must be blank in the example file`);
    if (name.startsWith("NEXT_PUBLIC_")) assert.equal(secretLike.test(name), false, `${name} would expose a secret`);
  }
  assert.equal(/postgres(ql)?:\/\/|mysql:\/\/|redis:\/\/|rediss:\/\/|mongodb(\+srv)?:\/\//i.test(text), false);
});

test("enquiry stays off by default in the example file", () => {
  const value = (name) => assignments.find((entry) => entry.name === name && entry.active)?.value.trim();
  assert.equal(value("ENQUIRY_SMTP_ENABLED"), "false");
  assert.equal(value("ENQUIRY_ACKNOWLEDGEMENT_ENABLED"), "false");
  assert.equal(value("ENQUIRY_ATTACHMENTS_ENABLED"), "false");
});
