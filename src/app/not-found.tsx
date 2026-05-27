import { NotFoundPage } from "@/components/errors/NotFoundPage";
import { routes, withLocale } from "@/config/routes";
import { routing } from "@/i18n/routing";

export default function RootNotFoundPage() {
  const locale = routing.defaultLocale;

  return (
    <NotFoundPage
      eyebrow="404"
      title="This page drifted away."
      description="The page you are looking for no longer exists or was moved."
      note="Oops! We couldn't find what you're looking for."
      homeLabel="Back Home"
      journalLabel="Journal"
      homeHref={withLocale(locale, routes.home)}
      journalHref={withLocale(locale, routes.blog)}
    />
  );
}
