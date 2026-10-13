import { parseSlug } from "@/lib/domain/helpers";

/** Syntax only. Callers own document-wide uniqueness and referenced element existence. */
export function elementId(id: string | undefined): string | undefined {
  if (id === undefined) return undefined;
  if (parseSlug(id) === null || id === "main-content") {
    throw new Error("Primitive IDs must be lowercase hyphenated IDs; main-content is reserved for MainContent.");
  }
  return id;
}

export function labelledByIds(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  const ids = value.trim().split(/\s+/);
  ids.forEach(elementId);
  if (new Set(ids).size !== ids.length) throw new Error("Duplicate accessible label references.");
  return ids.join(" ");
}
