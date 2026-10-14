import type {
  ContentId,
  Decision,
  Publication,
  RouteId,
  SelectionContext,
  Slug,
  SolutionReference,
  Timestamp,
} from "./core";

export type ConversionIntent =
  | "request-consultation"
  | "request-proposal"
  | "send-project-brief";

type ConversionRoutes = {
  "request-consultation": "route:consultation";
  "request-proposal": "route:proposal";
  "send-project-brief": "route:contact";
};

export type ConversionCTA = {
  [I in ConversionIntent]: Readonly<{
    kind: "enquiry-link";
    intent: I;
    label: string;
    destination: Readonly<{ routeId: ConversionRoutes[I] }>;
    context?: SelectionContext;
  }>;
}[ConversionIntent];

export type CTA =
  | ConversionCTA
  | Readonly<{
      kind: "navigation";
      intent: "explore" | "compare" | "recover" | "read-disclosure";
      label: string;
      destination: Readonly<{ routeId: RouteId; fragment?: Slug }>;
    }>
  | Readonly<{
      kind: "submit-enquiry";
      intent: ConversionIntent;
      label: string;
      destination?: never;
    }>;

export type Indexability =
  | Readonly<{ index: true; follow: true; sitemap: boolean }>
  | Readonly<{ index: false; follow: boolean; sitemap: false }>;

export type SeoMetadata = Readonly<{
  title: Decision<string>;
  description: Decision<string>;
  socialImage?: Decision<Readonly<{ assetPath: string; alt: string }>>;
}>;

export type RouteType =
  | "home"
  | "company"
  | "services-hub"
  | "service-family"
  | "individual-service"
  | "packages-hub"
  | "package-segment"
  | "package-tier"
  | "package-comparison"
  | "enterprise"
  | "industries-hub"
  | "industry"
  | "conversion"
  | "projects-hub"
  | "add-ons-hub"
  | "proof-hub"
  | "proof-detail"
  | "resources-hub"
  | "article"
  | "topic"
  | "legal"
  | "utility";

export type RouteScope = "mvp-fixed" | "conditional" | "future" | "system";
export type GenerationStrategy = "static" | "generated" | "request-time" | "tbf";

/** Concrete resolved path, not a Next.js filesystem pattern or full URL. */
export type CanonicalPath = `/${string}`;

export type RouteEntity = SolutionReference
  | Readonly<{ kind: "content"; id: ContentId }>;

export type RouteDefinition = Readonly<{
  id: RouteId;
  slug: Slug | null; // null for root
  path: CanonicalPath;
  label: string;
  type: RouteType;
  scope: RouteScope;
  publication: Publication;
  parentId: RouteId | null;
  entity?: RouteEntity;
  audience: Decision<readonly string[]>;
  seoIntent: Decision<string>;
  primaryCTA: Decision<CTA>;
  indexability: Decision<Indexability>;
  metadata: SeoMetadata;
  dataSource: Decision<string>;
  contentOwner: Decision<string>;
  template: Decision<string>;
  generation: GenerationStrategy;
  publicationPrerequisites: readonly string[];
  relatedEntities: readonly SolutionReference[];
  aliases: readonly CanonicalPath[];
  milestone: string;
  verification: "not-reviewed" | "reviewed";
  modifiedAt?: Timestamp;
}>;

export type NavigationItem =
  | Readonly<{
      kind: "link";
      id: `nav:${string}`;
      label: string;
      routeId: RouteId;
      fragment?: Slug;
    }>
  | Readonly<{
      kind: "disclosure";
      id: `nav:${string}`;
      label: string;
      routeId: RouteId; // parent remains independently navigable
      children: readonly NavigationItem[];
    }>;

export type NavigationGroup = Readonly<{
  id: `nav-group:${string}`;
  label: string;
  items: readonly NavigationItem[];
}>;
