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
import { applySecurityHeaders } from "./app/lib/security-headers";

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
    const redirect = NextResponse.redirect(target);
    // A redirect is a response like any other, and it is the first one most visitors receive.
    applySecurityHeaders(redirect.headers);
    return redirect;
  }

  // The nonce travels two ways on purpose. The response header is what the browser enforces; the
  // request header is what the renderer reads, both through `headers()` in a component and through
  // Next.js itself, which stamps the nonce onto every script tag it emits.
  const nonce = createNonce();
  const policy = contentSecurityPolicy(nonce);
  const forwarded = new Headers(request.headers);
  forwarded.set(NONCE_HEADER, nonce);
  forwarded.set("Content-Security-Policy", policy);
  // Both headers are read back by server components as if this proxy had written them, so a client
  // that sends its own copy must not be believed. The nonce is overwritten on every path; the
  // locale is not, so clear it first and set it only where this proxy derived one.
  forwarded.delete(LOCALE_HEADER);
  if (prefixed) forwarded.set(LOCALE_HEADER, segment);

  const response = NextResponse.next({ request: { headers: forwarded } });
  applySecurityHeaders(response.headers);
  response.headers.set("Content-Security-Policy", policy);
  return response;
}

export const config = {
  // Everything except the Next.js build output, which is immutable, same origin, and served with
  // the content type it was compiled to.
  //
  // The generated metadata routes (robots.txt, sitemap.xml, the manifest, the social card) used to
  // be named here as well, which read as a decision. It is not one: Next.js serves those ahead of
  // the proxy and never calls it for them, so listing them changed nothing. It also means their
  // security headers can only come from the reverse proxy in front, which is why deploy/compose.yml
  // repeats the set and why the standalone stack requires a terminator that does the same.
  matcher: ["/((?!_next/).*)"],
};

export { locales };
