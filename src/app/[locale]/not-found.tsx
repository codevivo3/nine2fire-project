"use client";

import { useLocale, useTranslations } from "next-intl";
import { NotFoundPage } from "@/components/errors/NotFoundPage";
import { routes, withLocale } from "@/config/routes";
import type { AppLocale } from "@/i18n/routing";

export default function LocaleNotFoundPage() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("NotFound");

  return (
    <NotFoundPage
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      homeLabel={t("backHome")}
      journalLabel={t("journal")}
      homeHref={withLocale(locale, routes.home)}
      journalHref={withLocale(locale, routes.blog)}
    />
  );
}
