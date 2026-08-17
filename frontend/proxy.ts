import { NextResponse, type NextRequest } from "next/server";
import {
  defaultLocale,
  isLocale,
  localeCookie,
  locales,
  type Locale,
} from "./app/i18n/config";

/** Paths that are not part of the bilingual public site and must keep their exact URL. */
const UNPREFIXED = ["/admin", "/api"];

export const LOCALE_HEADER = "x-portfolio-locale";

/**
 * Picks the best locale from Accept-Language. Quality values are ignored on purpose: the header is
 * already ordered by preference, and the first supported language is the answer either way.
 */
function fromAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null;
  for (const part of header.split(",")) {
    const tag = part.split(";")[0]?.trim().toLowerCase();
    const base = tag?.split("-")[0];
    if (isLocale(base)) return base;
  }
  return null;
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (UNPREFIXED.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const segment = pathname.split("/")[1];
  if (isLocale(segment)) {
    const response = NextResponse.next();
    response.headers.set(LOCALE_HEADER, segment);
    return response;
  }

  const cookieLocale = request.cookies.get(localeCookie)?.value;
  const locale = isLocale(cookieLocale)
    ? cookieLocale
    : (fromAcceptLanguage(request.headers.get("accept-language")) ??
      defaultLocale);

  const target = request.nextUrl.clone();
  target.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(target);
}

export const config = {
  // Everything except Next internals and the files served straight from /public.
  matcher: [
    "/((?!_next/|favicon\\.svg|images/|documents/|robots\\.txt|sitemap\\.xml|manifest\\.webmanifest|opengraph-image).*)",
  ],
};

export { locales };
