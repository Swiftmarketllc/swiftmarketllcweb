/** Compile-only regression contracts: no runtime fixtures or production content. */
import type {
  Availability,
  PackageId,
  PackageSegment,
  PackageSelection,
  PackageTier,
  ServiceId,
  IndustryId,
} from "./core";
import type { Pricing } from "./commercial";
import type { PackageCatalog, EnterpriseOffering, CapabilityMatrix } from "./offers";
import type { ConversionCTA, Indexability } from "./routes";
import type { Proof } from "./content";

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2) ? true : false;
type Expect<T extends true> = T;
type Reject<T> = Equal<T, never>;

export type DomainTypeContracts = readonly [
  Expect<Equal<PackageSegment, "startup" | "growing-business">>,
  Expect<Equal<PackageTier, "basic" | "standard" | "premium">>,
  Expect<Equal<keyof PackageCatalog, PackageSegment>>,
  Expect<Equal<keyof PackageCatalog["startup"], PackageTier>>,
  Expect<Equal<keyof PackageCatalog["growing-business"], PackageTier>>,
  Expect<Equal<PackageCatalog["startup"]["basic"]["id"], "package:startup:basic">>,
  Expect<Equal<PackageCatalog["growing-business"]["premium"]["segment"], "growing-business">>,
  Expect<Reject<Extract<PackageId, `package:enterprise:${string}`>>>,
  Expect<Reject<Extract<PackageSelection, { segment: "enterprise" }>>>,
  Expect<Equal<Extract<PackageSelection, { packageId: "package:startup:basic" }>["tier"], "basic">>,
  Expect<Equal<EnterpriseOffering["scoping"], "consultation-led">>,
  Expect<Equal<EnterpriseOffering["pricing"]["state"], "custom-quote">>,
  Expect<Reject<Extract<EnterpriseOffering["tier"], string>>>,
  Expect<Equal<ServiceId extends IndustryId ? true : false, false>>,
  Expect<Equal<"amount" extends keyof Extract<Pricing, { state: "tbf" }> ? true : false, false>>,
  Expect<Equal<"amount" extends keyof Extract<Pricing, { state: "custom-quote" }> ? true : false, false>>,
  Expect<Equal<Extract<Indexability, { index: false }>["sitemap"], false>>,
  Expect<Equal<Extract<ConversionCTA, { intent: "send-project-brief" }>["destination"]["routeId"], "route:contact">>,
  Expect<Reject<Extract<ConversionCTA, { intent: "discuss-partnership" | "request-audit" }>>>,
  Expect<Equal<PackageCatalog["startup"]["basic"]["version"]["number"], number>>,
  Expect<Equal<PackageCatalog["growing-business"]["premium"]["capabilities"], CapabilityMatrix>>,
  Expect<Equal<Availability extends "coming-soon" ? true : false, false>>,
  Expect<Equal<Extract<Availability, "coming-soon">, "coming-soon">>,
  Expect<Equal<Extract<ConversionCTA, { intent: "request-proposal" }>["destination"]["routeId"], "route:proposal">>,
  Expect<Equal<Extract<Proof, { publication: { status: "published" } }>["verification"]["status"], "verified">>
];
