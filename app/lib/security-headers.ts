/**
 * Response security headers applied to every request the proxy sees.
 *
 * These used to exist only as Traefik labels in `deploy/compose.yml`, which left the standalone
 * deployment in `docker-compose.prod.yml` serving the site with none of them. Headers that protect
 * the document belong to the document, so the application now sets them itself and the reverse
 * proxy repeats them for the few routes the proxy matcher skips. Both sides `Set` rather than
 * append, so the value a browser sees is unambiguous.
 *
 * The Content-Security-Policy is deliberately absent here: it carries a per-request nonce and is
 * built in `csp.ts`.
 */
export const SECURITY_HEADERS: Readonly<Record<string, string>> = {
  /** Stops a browser from re-guessing the type of the PDF and SVG assets served from /public. */
  "X-Content-Type-Options": "nosniff",
  /** Belt and braces with `frame-ancestors 'none'`, for engines that predate it. */
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  /** The site asks for none of these, so no embedded document may ask on its behalf either. */
  "Permissions-Policy":
    "accelerometer=(), autoplay=(), camera=(), display-capture=(), encrypted-media=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), usb=()",
  /** Severs the opener relationship, so a popup cannot reach back into this window. */
  "Cross-Origin-Opener-Policy": "same-origin",
  /** The resume and the images are for this site to render, not for another site to embed. */
  "Cross-Origin-Resource-Policy": "same-origin",
  /** Prefetching leaks the visitor's next hop to a DNS resolver before they choose it. */
  "X-DNS-Prefetch-Control": "off",
};

/**
 * Two years, subdomains included, preload eligible. Held back outside production because a browser
 * that records it for `localhost` refuses plain HTTP there until the max-age expires.
 */
export const STRICT_TRANSPORT_SECURITY =
  "max-age=63072000; includeSubDomains; preload";

export function applySecurityHeaders(
  headers: Headers,
  production = process.env.NODE_ENV === "production",
): void {
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(name, value);
  }
  if (production) {
    headers.set("Strict-Transport-Security", STRICT_TRANSPORT_SECURITY);
  }
}
