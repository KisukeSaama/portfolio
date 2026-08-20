/**
 * Content Security Policy for the HTML the site serves.
 *
 * The policy is built per request in `proxy.ts` rather than pinned in the reverse proxy, because
 * `script-src` carries a fresh nonce. A static header cannot do that, and the alternative it forces
 * is `'unsafe-inline'`, which lets any injected `<script>` run and leaves the policy with nothing to
 * say about the one attack it exists to stop. Only one CSP may set the rules: a browser enforces
 * every policy it receives, so the proxy in front must not add a second one.
 *
 * `'strict-dynamic'` lets the nonced Next.js bootstrap load its own chunks without listing them,
 * and makes host allowlists moot for scripts.
 *
 * `style-src` keeps `'unsafe-inline'` on purpose: React writes `style` attributes, which a nonce
 * cannot cover, and Next.js inlines critical CSS.
 *
 * `img-src`/`media-src` allow any https origin because a case study may attach media by external
 * URL instead of uploading it.
 */
export const NONCE_HEADER = "x-nonce";

export function contentSecurityPolicy(
  nonce: string,
  development = process.env.NODE_ENV === "development",
): string {
  const developmentScriptSource = development ? " 'unsafe-eval'" : "";

  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${developmentScriptSource}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "media-src 'self' https:",
    "font-src 'self'",
    "connect-src 'self'",
    "manifest-src 'self'",
    "worker-src 'self'",
    "object-src 'none'",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join("; ");
}

/** 128 bits of randomness, base64 encoded, as the CSP nonce grammar requires. */
export function createNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return btoa(String.fromCharCode(...bytes));
}
