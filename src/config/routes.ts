import type { AppLocale } from "@/i18n/routing";

/**
 * Locale-neutral internal paths.
 *
 * App Router links should pass these through the localized navigation helpers,
 * which add the active locale prefix when rendering hrefs.
 */
export const routes = {
  home: "/",
  blog: "/blog",
  blogPost: (slug: string) => `/blog/${slug}`,
  blogTag: (tag: string) => `/blog/tag/${encodeURIComponent(tag)}`,
  section: (id: string) => `/#${id}`,
  sections: {
    approach: "/#approach",
    roadmap: "/#roadmap",
    insights: "/#insights",
  },
} as const;

export function withLocale(locale: AppLocale, path: string) {
  return locale === "en" || locale === "it" ? `/${locale}${path}` : path;
}
