/**
 * PURPOSE:
 * Defines the document shell shared by every route.
 *
 * NOTES:
 * - Root metadata stays generic so locale segments can extend it safely.
 * - Theme is bootstrapped in `<head>` before hydration to avoid a flash of the
 *   wrong theme and to keep the first client render aligned with the DOM.
 * - Locale resolution falls back to English for routes that render outside the
 *   localized segment tree.
 */
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { getLocale } from "next-intl/server";
import { Manrope } from "next/font/google";
import Script from "next/script";
import { getProductionSiteUrl, isProduction } from "@/lib/env";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

/**
 * Global metadata configuration shared by all routes.
 *
 * Includes base SEO fields, social metadata, and favicon declarations.
 */
const productionSiteUrl = getProductionSiteUrl();

export const metadata: Metadata = {
  // Canonical SEO signals always target the public production domain so
  // preview deployments never become the indexed source of truth.
  metadataBase: new URL(productionSiteUrl),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "Nine2Fire — The Financial Architect",
    template: "%s | Nine2Fire",
  },
  description:
    "Build a system that runs without you. Structured thinking for financial independence.",
  keywords: [
    "financial independence",
    "FIRE",
    "wealth systems",
    "investing",
    "personal finance",
  ],
  openGraph: {
    title: "Nine2Fire — The Financial Architect",
    description: "Build a system that runs without you.",
    url: productionSiteUrl,
    siteName: "Nine2Fire",
    locale: "en",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nine2Fire",
    description: "Structured thinking for financial independence.",
  },
  // Preview and development deployments must stay out of search results even
  // though their canonical URLs still point to production.
  robots: isProduction
    ? {
        index: true,
        follow: true,
      }
    : {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          follow: false,
          noimageindex: true,
          "max-image-preview": "none",
          "max-snippet": 0,
        },
      },
  /**
   * Favicon & app icons configuration
   *
   * Notes:
   * - Provide multiple sizes so browsers can choose correctly
   * - Keep design consistent across all assets
   * - `.ico` acts as fallback
   */
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ]
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale().catch(() => "en");
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  // Keep this inline script string colocated with the document shell because it
  // exists purely to establish the initial HTML theme before React hydrates.
  const themeScript = `
    (function () {
      var storageKey = ${JSON.stringify(THEME_STORAGE_KEY)};
      var storedTheme = null;

      try {
        var value = window.localStorage.getItem(storageKey);
        if (value === "light" || value === "dark" || value === "system") {
          storedTheme = value;
        }
      } catch {}

      var systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

      var theme;
      if (!storedTheme || storedTheme === "system") {
        theme = systemTheme;
      } else {
        theme = storedTheme;
      }

      var root = document.documentElement;

      root.classList.remove("light", "dark");
      root.classList.add(theme);
      root.setAttribute("data-theme", theme);
      // React to system theme changes only if user preference is "system" or not set
      try {
        var media = window.matchMedia("(prefers-color-scheme: dark)");
        media.addEventListener("change", function () {
          var stored = null;
          try {
            var value = window.localStorage.getItem(storageKey);
            if (value === "light" || value === "dark" || value === "system") {
              stored = value;
            }
          } catch {}

          if (!stored || stored === "system") {
            var newTheme = media.matches ? "dark" : "light";
            root.classList.remove("light", "dark");
            root.classList.add(newTheme);
            root.setAttribute("data-theme", newTheme);
          }
        });
      } catch {}
    })();
  `;

  return (
    <html
      lang={locale}
      className={`${manrope.variable} h-full scroll-smooth antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Apply the persisted/system theme before any client component mounts. */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
        >
          {themeScript}
        </Script>
        {plausibleDomain ? (
          // Plausible is optional and loaded after hydration because it does not
          // influence layout or any server-rendered HTML.
          <Script
            id="plausible-analytics"
            strategy="afterInteractive"
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
          />
        ) : null}
      </head>
      <body className="min-h-full text-foreground font-sans before:content-[''] before:fixed before:inset-[-32px] before:-z-10 before:bg-[var(--background-pattern)] before:bg-cover before:bg-center before:bg-no-repeat">
        {children}
        {/* Vercel Analytics stays at the document edge so route changes are tracked globally. */}
        <Analytics />
      </body>
    </html>
  );
}
