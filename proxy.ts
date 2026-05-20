/**
 * PURPOSE:
 * Applies `next-intl` routing rules at the edge boundary.
 *
 * NOTES:
 * - Non-page assets and internal framework paths are excluded so locale
 *   rewriting only happens for user-facing routes.
 * - API routes stay outside this matcher because they handle their own locale
 *   and auth concerns explicitly.
 */
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
