import { getLocale, getTranslations } from "next-intl/server";
import { NotFoundPage } from "@/components/errors/NotFoundPage";
import { routes, withLocale } from "@/config/routes";
import { routing, type AppLocale } from "@/i18n/routing";

export default async function LocaleNotFoundPage() {
  const locale = ((await getLocale().catch(() => routing.defaultLocale)) ||
    routing.defaultLocale) as AppLocale;
  const t = await getTranslations({ locale, namespace: "NotFound" });

  return (
    <NotFoundPage
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
      note={t("note")}
      homeLabel={t("actions.home")}
      journalLabel={t("actions.journal")}
      homeHref={withLocale(locale, routes.home)}
      journalHref={withLocale(locale, routes.blog)}
    />
  );
}
