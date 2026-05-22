/**
 * PURPOSE:
 * Enables Next.js draft mode for localized blog preview requests from Sanity.
 *
 * NOTES:
 * - The route accepts only internal localized blog paths to avoid turning the
 *   preview secret into an open redirect mechanism.
 * - Draft mode is only useful when the authenticated preview client is also
 *   configured server-side.
 */
import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { routing, type AppLocale } from "@/i18n/routing";
import { getRequestOrigin } from "@/lib/env";
import { hasSanityPreviewAccess, sanityPreviewSecret } from "@/lib/sanity/serverEnv";

type PreviewRouteContext = {
  params: Promise<{ locale: string }>;
};

function isLocalPreviewPath(pathname: string, locale: AppLocale) {
  return pathname.startsWith(`/${locale}/blog/`);
}

export async function GET(request: Request, context: PreviewRouteContext) {
  const { locale } = await context.params;
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug");

  if (!routing.locales.includes(locale as AppLocale)) {
    return NextResponse.json({ message: "Invalid locale." }, { status: 400 });
  }

  if (!sanityPreviewSecret || secret !== sanityPreviewSecret) {
    return NextResponse.json({ message: "Invalid preview secret." }, { status: 401 });
  }

  if (!hasSanityPreviewAccess()) {
    return NextResponse.json(
      { message: "Sanity preview is not configured for authenticated draft reads." },
      { status: 500 },
    );
  }

  if (!slug) {
    return NextResponse.json({ message: "Missing preview slug." }, { status: 400 });
  }

  let previewPathname: string;

  try {
    previewPathname = new URL(slug, request.url).pathname;
  } catch {
    return NextResponse.json({ message: "Invalid preview slug." }, { status: 400 });
  }

  if (!isLocalPreviewPath(previewPathname, locale as AppLocale)) {
    return NextResponse.json(
      { message: "Preview slug must target a localized blog route." },
      { status: 400 },
    );
  }

  const draft = await draftMode();
  draft.enable();

  // Redirect into the real page route so subsequent server reads can detect draft mode.
  return NextResponse.redirect(new URL(previewPathname, getRequestOrigin(request)));
}
