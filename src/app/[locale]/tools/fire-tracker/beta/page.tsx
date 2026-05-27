import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FireTrackerCalculator } from "@/components/tools/FireTrackerCalculator";
import { Container } from "@/components/ui/Container";
import { FireTrackerBetaGuard } from "@/components/tools/FireTrackerBetaGuard";
import type { AppLocale } from "@/i18n/routing";

type FireTrackerBetaPageProps = {
  params: Promise<{ locale: AppLocale }>;
};

export const metadata: Metadata = {
  title: {
    absolute: "FIRE Tracker Beta Access | Nine2Fire",
  },
  description:
    "Early beta version of the Nine2Fire FIRE Tracker calculator with initial planning inputs for financial independence scenarios.",
};

export default async function FireTrackerBetaPage({
  params,
}: FireTrackerBetaPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "FireTracker" });

  return (
    <main className="pt-24 md:pt-28">
      <Container className="py-16 md:py-24">
        <FireTrackerBetaGuard>
          <div className="section-grid gap-8">
            <section className="rounded-[var(--radius-lg)] border border-border-token bg-surface p-6 md:p-10">
              <div className="section-grid gap-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-eyebrow-token">
                  {t("beta.eyebrow")}
                </p>
                <h1 className="text-4xl font-bold tracking-[-0.04em] text-foreground sm:text-5xl">
                  {t("beta.title")}
                </h1>
                <p className="max-w-3xl text-sm leading-7 text-foreground/72 md:text-base">
                  {t("beta.description")}
                </p>
                <div className="rounded-[var(--radius-md)] border border-border-token bg-surface-strong px-4 py-3 text-sm leading-6 text-foreground/80">
                  {t("beta.note")}
                </div>
              </div>
            </section>

            <section className="rounded-[var(--radius-lg)] border border-border-token bg-surface p-6 md:p-8">
              <div className="section-grid gap-6">
                <div className="section-grid gap-2">
                  <h2 className="text-2xl font-bold tracking-[-0.03em] text-foreground">
                    {t("beta.calculatorTitle")}
                  </h2>
                  <p className="text-sm leading-7 text-foreground/72 md:text-base">
                    {t("beta.calculatorDescription")}
                  </p>
                </div>
                <FireTrackerCalculator />
              </div>
            </section>
          </div>
        </FireTrackerBetaGuard>
      </Container>
    </main>
  );
}
