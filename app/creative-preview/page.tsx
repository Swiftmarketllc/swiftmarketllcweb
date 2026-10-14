import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CreativeHomepage } from "@/components/creative/creative-homepage";

export const metadata: Metadata = {
  title: "Creative preview — Aperture",
  description: "Internal development-only design preview. All copy is provisional.",
  robots: { index: false, follow: false },
};

/** Development-only design review. Never reads or publishes canonical content. */
export default function CreativePreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <CreativeHomepage />;
}
