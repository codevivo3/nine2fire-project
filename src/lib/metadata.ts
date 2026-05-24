import type { Metadata } from "next";

const SITE_NAME = "Nine2Fire";

export const HOME_SEO_DESCRIPTION =
  "Nine2Fire explores work, money, habits, and long-term thinking through calm systems for building a more independent life.";

export const BLOG_SEO_DESCRIPTION =
  "Essays and observations on work, money, habits, freedom, and the slow process of building financial independence.";

export function buildPageTitle(label: "Home" | "Blog") {
  return `${label} | ${SITE_NAME}`;
}

export function buildPageMetadata(
  label: "Home" | "Blog",
  description: string,
): Metadata {
  const title = buildPageTitle(label);

  return {
    title: {
      absolute: title,
    },
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      title,
      description,
    },
  };
}
