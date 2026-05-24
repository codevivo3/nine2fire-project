/**
 * PURPOSE:
 * Composes the locale-aware shell for all translated routes.
 *
 * NOTES:
 * - This is the boundary where URL locale params become trusted application
 *   locale state.
 * - `setRequestLocale` keeps App Router server rendering deterministic for
 *   `next-intl` consumers further down the tree.
 * - Shared chrome and the cookie/consent UI live here so they are mounted once
 *   per localized subtree rather than duplicated per page.
 */
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { hasLocale } from "use-intl";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { CookieBanner } from "@/components/ui/CookieBanner";
import { loadMessages } from "@/i18n/loadMessages";
import { routing, type AppLocale } from "@/i18n/routing";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const resolvedLocale = locale as AppLocale;
  setRequestLocale(resolvedLocale);

  return (
    <NextIntlClientProvider
      key={resolvedLocale}
      locale={resolvedLocale}
      // Provide one locale bundle at the segment root so client components can
      // read translations without each route reloading message files.
      messages={await loadMessages(resolvedLocale)}
    >
      <div className="relative min-h-screen text-foreground">
        <Navbar />
        {children}
        <Footer />
        <CookieBanner />
      </div>
    </NextIntlClientProvider>
  );
}
