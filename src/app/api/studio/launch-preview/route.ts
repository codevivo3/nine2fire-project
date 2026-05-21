import { NextResponse } from "next/server";
import { routing, type AppLocale } from "@/i18n/routing";
import { sanityPreviewSecret } from "@/lib/sanity/serverEnv";

const fallbackLocale: AppLocale = "en";

function isValidLocale(locale: string): locale is AppLocale {
  return routing.locales.includes(locale as AppLocale);
}

function normalizeSlug(slug: string) {
  return slug
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean)
    .join("/");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedLocale = searchParams.get("locale") || fallbackLocale;
  const requestedSlug = searchParams.get("slug") || "";

  if (!isValidLocale(requestedLocale)) {
    return NextResponse.json({ message: "Invalid preview locale." }, { status: 400 });
  }

  if (!sanityPreviewSecret) {
    return NextResponse.json(
      { message: "Sanity preview secret is not configured on the server." },
      { status: 500 },
    );
  }

  const normalizedSlug = normalizeSlug(requestedSlug);

  if (!normalizedSlug) {
    return NextResponse.json({ message: "Missing preview slug." }, { status: 400 });
  }

  const previewPath = `/${requestedLocale}/blog/${normalizedSlug}`;
  const localizedPreviewUrl = new URL(
    `/${requestedLocale}/api/studio/preview`,
    request.url,
  );

  localizedPreviewUrl.searchParams.set("secret", sanityPreviewSecret);
  localizedPreviewUrl.searchParams.set("slug", previewPath);

  return NextResponse.redirect(localizedPreviewUrl);
}
