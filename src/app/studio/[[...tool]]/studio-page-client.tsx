"use client";

import dynamic from "next/dynamic";
import config from "../../../../sanity.config";

const ClientOnlyStudio = dynamic(
  () => import("next-sanity/studio").then((module) => module.NextStudio),
  { ssr: false },
);

export function StudioPageClient() {
  return <ClientOnlyStudio config={config} />;
}
