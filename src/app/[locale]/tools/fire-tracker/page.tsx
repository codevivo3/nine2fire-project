import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { FireTrackerBetaAccessForm } from "@/components/tools/FireTrackerBetaAccessForm";
import type { AppLocale } from "@/i18n/routing";

type FireTrackerAccessPageProps = {
  params: Promise<{ locale: AppLocale }>;
};

export const metadata: Metadata = {
  title: {
    absolute: "FIRE Tracker Beta | Nine2Fire",
  },
  description:
    "Free beta access to the Nine2Fire FIRE Tracker. Leave your email to explore Coast FIRE, semi-retirement, and flexible financial independence.",
};

export default async function FireTrackerAccessPage({
  params,
}: FireTrackerAccessPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "FireTracker" });

  const helpItems = [
    t("landing.help.items.coast"),
    t("landing.help.items.semiRetirement"),
    t("landing.help.items.progress"),
    t("landing.help.items.tradeoffs"),
  ];

  return (
    <main className="pt-24 md:pt-28">
      <Container className="py-16 md:py-24">
        <div className="grid gap-8 rounded-[var(--radius-lg)] border border-border-token bg-surface p-6 md:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] md:p-10">
          <div className="section-grid gap-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-eyebrow-token">
              {t("landing.eyebrow")}
            </p>
            <div className="section-grid gap-4">
              <h1 className="max-w-3xl text-4xl font-bold tracking-[-0.04em] text-foreground sm:text-5xl">
                {t("landing.title")}
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-foreground/72 md:text-base">
                {t("landing.intro")}
              </p>
            </div>

            <ul className="section-grid gap-3 text-sm leading-7 text-foreground/78 md:text-base">
              {helpItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-token"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[var(--radius-lg)] border border-border-token bg-surface-strong p-5 md:p-6">
            <FireTrackerBetaAccessForm />
          </div>
        </div>
      </Container>
    </main>
  );
}
