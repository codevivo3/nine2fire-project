import { NotFoundPage } from "@/components/errors/NotFoundPage";
import { routes, withLocale } from "@/config/routes";
import { routing } from "@/i18n/routing";

export default function RootNotFoundPage() {
  const locale = routing.defaultLocale;

  return (
    <NotFoundPage
      eyebrow="404"
      title="Not every route leads where expected."
      description="We couldn't find the page you were looking for."
      homeLabel="Back Home"
      journalLabel="Journal"
      homeHref={withLocale(locale, routes.home)}
      journalHref={withLocale(locale, routes.blog)}
    />
  );
}
