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
    <main className="flex flex-1 flex-col pt-14">
      <Container className="flex flex-1 flex-col py-4">
        <FireTrackerBetaGuard>
          <div className="flex flex-1 flex-col justify-center gap-6 md:gap-8">
            <div className="grid gap-5 lg:grid-cols-2 lg:items-center">
              <div className="section-grid gap-4">
                <p className="pl-[4px] text-xs font-semibold uppercase tracking-[0.18em] text-accent-eyebrow-token opacity-90">
                  {t("beta.eyebrow")}
                </p>
                <h1 className="text-4xl font-extrabold leading-tight tracking-[-0.045em] text-foreground sm:text-5xl md:text-6xl">
                  {t("beta.title")}
                </h1>
                <p className="text-base leading-8 text-foreground/72 md:text-lg">
                  {t("beta.description")}
                </p>
              </div>

              <FireTrackerCalculator />
            </div>

            <p className="max-w-2xl text-[11px] leading-4 text-foreground/60 md:text-xs md:leading-5">
              {t("beta.note")}
            </p>
          </div>
        </FireTrackerBetaGuard>
      </Container>
    </main>
  );
}
