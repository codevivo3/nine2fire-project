"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { routes } from "@/config/routes";
import { Button } from "@/components/ui/Button";
import { subscriptionSources } from "@/lib/subscriptions";

export const FIRE_TRACKER_BETA_ACCESS_STORAGE_KEY =
  "nine2fire_fire_tracker_beta_access";

export function FireTrackerBetaAccessForm() {
  const t = useTranslations("FireTracker");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="section-grid gap-4"
      onSubmit={async (event) => {
        event.preventDefault();

        if (isSubmitting) {
          return;
        }

        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email");
        const consent = formData.get("consent");

        if (typeof email !== "string" || consent !== "on") {
          setError(t("form.errors.validation"));
          setIsSubmitting(false);
          return;
        }

        try {
          const response = await fetch("/api/subscribe", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              source: subscriptionSources.fireTrackerBeta,
            }),
          });

          if (!response.ok) {
            throw new Error("Subscription failed");
          }

          window.localStorage.setItem(
            FIRE_TRACKER_BETA_ACCESS_STORAGE_KEY,
            "true",
          );
          router.push(routes.fireTrackerBeta);
        } catch {
          setError(t("form.errors.submit"));
        } finally {
          setIsSubmitting(false);
        }
      }}
    >
      <div className="section-grid gap-2">
        <label
          htmlFor="fire-tracker-email"
          className="text-sm font-semibold text-foreground"
        >
          {t("form.emailLabel")}
        </label>
        <input
          id="fire-tracker-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={t("form.emailPlaceholder")}
          className="h-12 rounded-full border border-border-token bg-input px-5 text-sm text-foreground outline-none placeholder:text-foreground/50 focus:border-accent-token"
        />
      </div>

      <label className="flex items-start gap-3 rounded-[var(--radius-md)] border border-border-token bg-surface/70 p-4 text-sm leading-6 text-foreground/80">
        <input
          name="consent"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-accent)]"
        />
        <span>{t("form.consent")}</span>
      </label>

      <Button type="submit" variant="gold" disabled={isSubmitting}>
        {isSubmitting ? t("form.submitting") : t("form.submit")}
      </Button>

      <p className="text-sm text-foreground/64">{t("form.reassurance")}</p>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </form>
  );
}
