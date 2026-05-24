/**
 * FILE: src/app/[locale]/page.tsx
 *
 * PURPOSE:
 * - Assembles the localized landing page from reusable marketing sections
 *
 * NOTES:
 * - Section ordering here defines the narrative flow for every supported locale
 */
import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { Hero } from "@/components/sections/Hero";
import { Insights, InsightsSkeleton } from "@/components/sections/Insights";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { Roadmap } from "@/components/sections/Roadmap";
import { ValueProps } from "@/components/sections/Structure";
import type { AppLocale } from "@/i18n/routing";
import { buildPageMetadata, HOME_SEO_DESCRIPTION } from "@/lib/metadata";

type LandingPageProps = {
  params: Promise<{ locale: AppLocale }>;
};

export function generateMetadata() {
  return buildPageMetadata("Home", HOME_SEO_DESCRIPTION);
}

export default async function LandingPage({ params }: LandingPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="pt-24 md:pt-28">
      <Hero locale={locale} />
      <ValueProps locale={locale} />
      <Roadmap locale={locale} />
      <Suspense fallback={<InsightsSkeleton />}>
        <Insights locale={locale} />
      </Suspense>
      <NewsletterSection />
    </main>
  );
}
