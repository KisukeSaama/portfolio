import { NextResponse, type NextRequest } from "next/server";
import {
  defaultLocale,
  isLocale,
  localeCookie,
  localeHeader,
  locales,
  type Locale,
} from "./app/i18n/config";
import {
  NONCE_HEADER,
  contentSecurityPolicy,
  createNonce,
} from "./app/lib/csp";

/** Files served straight from /public. They still get the response headers, never the redirect. */
const STATIC = ["/images/", "/documents/", "/favicon.svg"];

/** Kept as a named export because the tests assert on it. Defined once, in the i18n config. */
export const LOCALE_HEADER = localeHeader;

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

  const passthrough = STATIC.some((prefix) => pathname.startsWith(prefix));
  const segment = pathname.split("/")[1];
  const prefixed = isLocale(segment);

  if (!passthrough && !prefixed) {
    const cookieLocale = request.cookies.get(localeCookie)?.value;
    const locale = isLocale(cookieLocale)
      ? cookieLocale
      : (fromAcceptLanguage(request.headers.get("accept-language")) ??
        defaultLocale);
    const target = request.nextUrl.clone();
    target.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(target);
  }

  // The nonce travels two ways on purpose. The response header is what the browser enforces; the
  // request header is what the renderer reads, both through `headers()` in a component and through
  // Next.js itself, which stamps the nonce onto every script tag it emits.
  const nonce = createNonce();
  const policy = contentSecurityPolicy(nonce);
  const forwarded = new Headers(request.headers);
  forwarded.set(NONCE_HEADER, nonce);
  forwarded.set("Content-Security-Policy", policy);
  if (prefixed) forwarded.set(LOCALE_HEADER, segment);

  const response = NextResponse.next({ request: { headers: forwarded } });
  response.headers.set("Content-Security-Policy", policy);
  response.headers.set(NONCE_HEADER, nonce);
  if (prefixed) response.headers.set(LOCALE_HEADER, segment);
  return response;
}

export const config = {
  // Everything except Next internals and the generated metadata routes, which are not HTML and
  // carry no scripts to protect.
  matcher: [
    "/((?!_next/|robots\\.txt|sitemap\\.xml|manifest\\.webmanifest|opengraph-image).*)",
  ],
};

export { locales };
