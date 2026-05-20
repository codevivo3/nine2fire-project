import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { routing, type AppLocale } from "@/i18n/routing";
import {
  sanityPreviewSecret,
  sanityReadToken,
} from "@/lib/sanity/env";

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

  if (!sanityReadToken) {
    return NextResponse.json(
      { message: "SANITY_API_READ_TOKEN is required for preview." },
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

  return NextResponse.redirect(new URL(previewPathname, request.url));
}
