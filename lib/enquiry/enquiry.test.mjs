import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";

const root = fileURLToPath(new URL("../../", import.meta.url));
const require = createRequire(import.meta.url), cache = new Map();
function load(file) {
  if (cache.has(file)) return cache.get(file);
  const exports = {}; cache.set(file, exports);
  const source = readFileSync(resolve(root, file), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const localRequire = name => {
    if (name === "server-only") return {};
    if (name.startsWith("node:")) return require(name);
    const target = name.startsWith("@/") ? resolve(root, name.slice(2)) : resolve(root, dirname(file), name);
    return load(target.slice(root.length).replaceAll("\\", "/").replace(/^\//, "") + ".ts");
  };
  runInNewContext(compiled, { exports, require: localRequire, Buffer, Request, Response, URL, TextDecoder });
  return exports;
}
const { validateEnquiry } = load("lib/enquiry/validation.ts");
const { submitEnquiry, unconfiguredEnquiry, enquiryRecipient, isEnquiryEnabled } = load("lib/enquiry/submission.ts");
const { handleEnquiryRequest } = load("lib/enquiry/request.ts");
const { maxPayloadBytes } = load("lib/enquiry/form-contract.ts");
const payload = () => ({ name: " SYNTHETIC   PERSON ", email: "test@EXAMPLE.INVALID", message: " SYNTHETIC TEST ONLY\r\nSecond line ", company: "", website: "", companyFax: "" });
const key = "synthetic-test-key-0001";
// SYNTHETIC adapters only: not production persistence, delivery or customer data.
function fixture() {
  const reservations = new Map(), calls = { delivery: 0, accepted: 0, reservations: [] };
  const deps = { readiness: { privacyApproved: true, deliveryTested: true, abuseTested: true, publicationApproved: true },
    origin: "https://example.invalid", fingerprintSecret: "SYNTHETIC_TEST_ONLY_NOT_A_REAL_SECRET_0000",
    identify: async () => "SYNTHETIC_HOST_IDENTITY",
    delivery: { send: async (_value, recipient) => { calls.delivery++; assert.equal(recipient, enquiryRecipient); return { status: "accepted", providerReceipt: "SYNTHETIC_PROVIDER_RECEIPT" }; } },
    abuse: { reserve: async input => {
      calls.reservations.push(input);
      if (reservations.has(input.key)) return { status: reservations.get(input.key) === input.fingerprint ? "duplicate" : "conflict" };
      reservations.set(input.key, input.fingerprint);
      return { status: "reserved", lease: "SYNTHETIC_LEASE" };
    }, recordAccepted: async () => { calls.accepted++; } },
  };
  return { deps, calls };
}
const request = (body = JSON.stringify(payload()), headers = {}) => new Request("https://example.invalid/api/enquiry", {
  method: "POST", headers: { origin: "https://example.invalid", "content-type": "application/json", "idempotency-key": key, ...headers }, body,
});
test("validation safely normalizes only the five provisional fields", () => {
  const result = validateEnquiry(payload());
  assert.equal(result.status, "valid");
  assert.equal(result.value.contact.name, "SYNTHETIC PERSON");
  assert.equal(result.value.contact.email, "test@example.invalid");
  assert.equal(result.value.message, "SYNTHETIC TEST ONLY\nSecond line");
  assert.equal(result.value.contact.companyName, undefined);
  assert.equal(result.value.contact.website, undefined);
  assert.equal(validateEnquiry({ ...payload(), website: "https://example.invalid/path", company: "SYNTHETIC COMPANY" }).status, "valid");
});
test("missing, extra, malformed, overlong and unsafe text fields fail without echoing values", () => {
  for (const value of [null, [], "text", {}, { ...payload(), unknown: "SECRET" }, { ...payload(), name: 12 },
    { ...payload(), name: "x".repeat(121) }, { ...payload(), email: "not-an-email" },
    { ...payload(), email: "a..b@example.invalid" }, { ...payload(), website: "javascript:alert(1)" },
    { ...payload(), website: "https://user:password@example.invalid" }, { ...payload(), message: "\u0000SECRET" },
    { ...payload(), name: "NAME\nINJECTION" }]) {
    const result = validateEnquiry(value);
    assert.equal(result.status, "invalid");
    assert.ok(!JSON.stringify(result).includes("SECRET"));
  }
  for (const field of ["name", "email", "message"]) assert.ok(validateEnquiry({ ...payload(), [field]: "" }).errors[field]);
});
test("honeypot and byte limits block before any provider is called", async () => {
  const { deps, calls } = fixture();
  assert.equal((await submitEnquiry({ ...payload(), companyFax: "BOT" }, key, "HOST", deps)).status, "blocked");
  assert.equal(validateEnquiry({ ...payload(), message: "😀".repeat(5000) }).status, "invalid");
  assert.equal(calls.delivery, 0);
});
test("all readiness prerequisites and provider boundaries fail closed", async () => {
  assert.equal(enquiryRecipient, "info@swiftmarketllc.com");
  assert.equal(isEnquiryEnabled(unconfiguredEnquiry), false);
  assert.equal((await submitEnquiry(payload(), key, "HOST", unconfiguredEnquiry)).status, "unavailable");
  const { deps, calls } = fixture();
  for (const prerequisite of Object.keys(deps.readiness)) {
    assert.equal((await submitEnquiry(payload(), key, "HOST", { ...deps, readiness: { ...deps.readiness, [prerequisite]: false } })).status, "unavailable");
  }
  for (const missing of ["delivery", "abuse", "identify", "origin", "fingerprintSecret"]) {
    assert.equal(isEnquiryEnabled({ ...deps, [missing]: undefined }), false);
  }
  assert.equal(calls.delivery, 0);
});
test("confirmed acceptance is required and recipient/provider details stay server-side", async () => {
  const { deps, calls } = fixture();
  const result = await submitEnquiry(payload(), key, "HOST", deps);
  assert.equal(result.status, "received"); assert.match(result.receiptReference, /^[a-f0-9-]{36}$/);
  assert.equal(calls.delivery, 1); assert.equal(calls.accepted, 1);
  assert.ok(!JSON.stringify(result).includes("SYNTHETIC"));
  for (const item of calls.reservations) {
    assert.match(item.identity, /^[a-f0-9]{64}$/); assert.match(item.fingerprint, /^[a-f0-9]{64}$/);
    assert.ok(!JSON.stringify(item).includes("PERSON"));
  }
});
test("duplicate/concurrent and conflicting submissions cannot trigger repeated delivery", async () => {
  const { deps, calls } = fixture();
  const results = await Promise.all([submitEnquiry(payload(), key, "HOST", deps), submitEnquiry(payload(), key, "HOST", deps)]);
  assert.equal(results.filter(result => result.status === "received").length, 1);
  assert.equal(results.filter(result => result.status === "duplicate").length, 1);
  assert.equal((await submitEnquiry({ ...payload(), message: "CHANGED SYNTHETIC" }, key, "HOST", deps)).status, "blocked");
  assert.equal(calls.delivery, 1);
});
test("persistent rate-limit denial and persistence outages prevent delivery", async () => {
  for (const reserve of [async () => ({ status: "limited" }), async () => { throw new Error("SECRET PROVIDER DATA"); }]) {
    const { deps, calls } = fixture(); deps.abuse.reserve = reserve;
    const result = await submitEnquiry(payload(), key, "HOST", deps);
    assert.ok(["blocked", "unavailable"].includes(result.status)); assert.equal(calls.delivery, 0);
    assert.ok(!JSON.stringify(result).includes("SECRET"));
  }
});
test("rejected, uncertain, malformed acceptance and thrown delivery never fabricate success", async () => {
  for (const send of [async () => ({ status: "rejected" }), async () => ({ status: "unknown" }),
    async () => ({ status: "accepted", providerReceipt: "" }), async () => { throw new Error("test@example.invalid PRIVATE MESSAGE"); }]) {
    const { deps, calls } = fixture(); deps.delivery.send = send;
    const result = await submitEnquiry(payload(), key, "HOST", deps);
    assert.equal(result.status, "unavailable"); assert.equal(calls.accepted, 0);
    assert.ok(!JSON.stringify(result).includes("PRIVATE"));
  }
  const { deps } = fixture(); deps.abuse.recordAccepted = async () => { throw new Error("PRIVATE STORAGE"); };
  assert.equal((await submitEnquiry(payload(), key, "HOST", deps)).status, "unavailable");
});
test("unconfigured public request boundary rejects before consuming personal data", async () => {
  const input = request();
  const response = await handleEnquiryRequest(input, unconfiguredEnquiry);
  assert.equal(response.status, 503); assert.equal(input.bodyUsed, false);
  assert.equal((await response.json()).status, "unavailable");
  assert.equal(response.headers.get("cache-control"), "no-store");
  const actual = await load("app/api/enquiry/route.ts").POST(request());
  assert.equal(actual.status, 503);
});
test("request boundary rejects malformed origins, headers, JSON and unknown fields", async () => {
  for (const headers of [{ origin: "https://untrusted.invalid" }, { "content-type": "text/plain" },
    { "content-encoding": "gzip" }, { "idempotency-key": "short" }]) {
    const { deps, calls } = fixture();
    assert.equal((await handleEnquiryRequest(request(undefined, headers), deps)).status, 400);
    assert.equal(calls.delivery, 0);
  }
  for (const body of ["{broken", "[]", JSON.stringify({ ...payload(), phone: "UNAPPROVED" })]) {
    const { deps, calls } = fixture();
    assert.equal((await handleEnquiryRequest(request(body), deps)).status, 400);
    assert.equal(calls.delivery, 0);
  }
});
test("payload limit is enforced with and without content-length; successful HTTP receipt requires acceptance", async () => {
  const { deps, calls } = fixture();
  assert.equal((await handleEnquiryRequest(request("{}", { "content-length": String(maxPayloadBytes + 1) }), deps)).status, 413);
  assert.equal((await handleEnquiryRequest(request(" ".repeat(maxPayloadBytes + 1)), deps)).status, 413);
  assert.equal(calls.delivery, 0);
  const response = await handleEnquiryRequest(request(), deps);
  assert.equal(response.status, 200); assert.equal((await response.json()).status, "received");
});
test("server modules are poisoned against client imports and never log enquiry payloads", () => {
  for (const file of ["validation.ts", "submission.ts", "request.ts"]) {
    const source = readFileSync(new URL(file, import.meta.url), "utf8");
    assert.match(source, /import "server-only"/);
    assert.doesNotMatch(source, /console\.|NEXT_PUBLIC_|fetch\(/);
  }
});
