import "server-only";
import { maxPayloadBytes } from "./form-contract";
import { isEnquiryEnabled, submitEnquiry } from "./submission";
import type { EnquiryDependencies } from "./submission";
import type { FormResult } from "./form-contract";

function response(result: FormResult, status: number) {
  return Response.json(result, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
}
/** Stream-bound JSON parsing: content-length is advisory, never the only limit. */
export async function handleEnquiryRequest(request: Request, deps: EnquiryDependencies): Promise<Response> {
  if (!isEnquiryEnabled(deps)) return response({ status: "unavailable" }, 503);
  if (request.method !== "POST" || request.headers.get("origin") !== deps.origin
    || !/^application\/json(?:\s*;\s*charset=utf-8)?$/i.test(request.headers.get("content-type") ?? "")
    || (request.headers.get("content-encoding") ?? "identity") !== "identity") return response({ status: "blocked" }, 400);
  const declared = request.headers.get("content-length");
  if (declared && (!/^\d+$/.test(declared) || Number(declared) > maxPayloadBytes)) return response({ status: "blocked" }, 413);
  const key = request.headers.get("idempotency-key") ?? "";
  if (!/^[a-zA-Z0-9-]{16,80}$/.test(key)) return response({ status: "blocked" }, 400);
  try {
    const identity = await deps.identify!(request);
    if (!identity) return response({ status: "unavailable" }, 503);
    if (!request.body) return response({ status: "invalid", errors: {} }, 400);
    const reader = request.body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      for (;;) {
        const chunk = await reader.read();
        if (chunk.done) break;
        size += chunk.value.byteLength;
        if (size > maxPayloadBytes) { await reader.cancel(); return response({ status: "blocked" }, 413); }
        chunks.push(chunk.value);
      }
    } finally { reader.releaseLock(); }
    let input: unknown;
    try { input = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks))); }
    catch { return response({ status: "invalid", errors: {} }, 400); }
    const result = await submitEnquiry(input, key, identity, deps);
    return response(result, result.status === "received" ? 200 : result.status === "unavailable" ? 503
      : result.status === "duplicate" ? 409 : result.status === "blocked" ? 429 : 400);
  } catch { return response({ status: "unavailable" }, 503); }
}
