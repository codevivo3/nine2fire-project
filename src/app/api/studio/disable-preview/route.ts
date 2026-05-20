/**
 * PURPOSE:
 * Clears Next.js draft mode and returns the user to a safe published route.
 *
 * NOTES:
 * - The redirect target is sanitized to an internal pathname so the exit flow
 *   cannot be abused as an open redirect.
 */
import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

const fallbackRedirectPath = "/en/blog";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const redirectTo = searchParams.get("slug") || fallbackRedirectPath;
  const redirectPathname = redirectTo.startsWith("/") ? redirectTo : fallbackRedirectPath;

  const draft = await draftMode();
  draft.disable();

  return NextResponse.redirect(new URL(redirectPathname, request.url));
}
