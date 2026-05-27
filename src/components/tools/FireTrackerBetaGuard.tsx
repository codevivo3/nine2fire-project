"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { routes } from "@/config/routes";
import { Button } from "@/components/ui/Button";
import { FIRE_TRACKER_BETA_ACCESS_STORAGE_KEY } from "@/components/tools/FireTrackerBetaAccessForm";

type FireTrackerBetaGuardProps = {
  children: React.ReactNode;
};

function subscribe() {
  return () => {};
}

export function FireTrackerBetaGuard({
  children,
}: FireTrackerBetaGuardProps) {
  const t = useTranslations("FireTracker");
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const hasAccess = mounted
    ? window.localStorage.getItem(FIRE_TRACKER_BETA_ACCESS_STORAGE_KEY) ===
      "true"
    : null;

  if (hasAccess === null) {
    return null;
  }

  if (!hasAccess) {
    return (
      <section className="rounded-[var(--radius-lg)] border border-border-token bg-surface p-6 md:p-8">
        <div className="section-grid gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-eyebrow-token">
            {t("beta.guard.eyebrow")}
          </p>
          <h2 className="text-2xl font-bold tracking-[-0.04em] text-foreground sm:text-3xl">
            {t("beta.guard.title")}
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-foreground/72 md:text-base">
            {t("beta.guard.description")}
          </p>
          <div>
            <Button href={routes.fireTracker} variant="secondary">
              {t("beta.guard.cta")}
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return <>{children}</>;
}
