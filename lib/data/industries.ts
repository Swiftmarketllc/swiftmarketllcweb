import type {
  Decision,
  Industry,
  IndustryPriorityBand,
  IndustryPackageRelationship,
  IndustryServiceRelationship,
} from "@/lib/domain";
import { parseSlug } from "@/lib/domain/helpers";

const tbf = Object.freeze({ state: "tbf" } as const);
const draftIndustryFields = {
  publication: Object.freeze({ status: "draft" } as const),
  description: tbf,
  problems: tbf,
  faqs: tbf,
  cta: tbf,
} as const;

/** Syntax validation does not grant publication or approve any relationship. */
function draftIndustry(rawSlug: string, name: string, priorityBand: IndustryPriorityBand): Industry {
  const slug = parseSlug(rawSlug);
  if (slug === null) throw new Error(`Invalid industry inventory slug: ${rawSlug}`);
  return Object.freeze({
    ...draftIndustryFields,
    id: `industry:${slug}`,
    slug,
    name,
    priorityBand,
  });
}

/**
 * Canonical candidates in v3.0 doc 04 §3 order: launch priority, then secondary.
 * Long-tail niches are deliberately absent: they must not be mass-published as thin pages.
 * These are not public pages.
 */
export const industries: readonly Industry[] = Object.freeze([
  draftIndustry("healthcare", "Healthcare", "launch"),
  draftIndustry("real-estate", "Real Estate", "launch"),
  draftIndustry("home-services", "Home Services", "launch"),
  draftIndustry("ecommerce", "Ecommerce", "launch"),
  draftIndustry("saas-ai-technology", "SaaS / AI / Technology", "launch"),
  draftIndustry("restaurants-franchises", "Restaurants / Franchises", "launch"),
  draftIndustry("legal", "Legal", "launch"),
  draftIndustry("education", "Education", "launch"),
  draftIndustry("finance", "Finance", "launch"),
  draftIndustry("automotive", "Automotive", "launch"),
  draftIndustry("b2b-professional-services", "B2B / Professional Services", "secondary"),
  draftIndustry("travel-hospitality", "Travel / Hospitality", "secondary"),
  draftIndustry("beauty", "Beauty", "secondary"),
  draftIndustry("fitness", "Fitness", "secondary"),
  draftIndustry("fashion", "Fashion", "secondary"),
  draftIndustry("construction", "Construction", "secondary"),
  draftIndustry("logistics", "Logistics", "secondary"),
  draftIndustry("recruitment", "Recruitment", "secondary"),
]);

/** Unknown mappings are not approved empty lists or implicit all-to-all relevance. */
export const industryServiceRelationships:
  Decision<readonly IndustryServiceRelationship[]> = tbf;

/** Suitability is separate from package inclusion; no recommendation is approved. */
export const industryPackageRelationships:
  Decision<readonly IndustryPackageRelationship[]> = tbf;

/** Exact identity lookup, including drafts; callers must enforce publication gates. */
export function getIndustryById(id: string): Industry | undefined {
  return industries.find((industry) => industry.id === id);
}

/** No aliases, case folding, URL coercion or fallback industry. */
export function getIndustryBySlug(slug: string): Industry | undefined {
  return industries.find((industry) => industry.slug === slug);
}
