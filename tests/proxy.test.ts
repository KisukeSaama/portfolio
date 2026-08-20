import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import proxy, { LOCALE_HEADER } from "../proxy";
import { NONCE_HEADER } from "../app/lib/csp";
import { SECURITY_HEADERS } from "../app/lib/security-headers";

function request(path: string, headers: Record<string, string> = {}) {
  return new NextRequest(new URL(path, "https://example.test"), { headers });
}

/**
 * `NextResponse.next({ request })` carries the rewritten request headers back on the response under
 * a middleware-private header. Reading it is the only way to assert on what the renderer will see.
 */
function forwardedHeaders(response: Response): Headers {
  const raw = response.headers.get("x-middleware-override-headers");
  const forwarded = new Headers();
  for (const name of raw?.split(",") ?? []) {
    const key = name.trim();
    if (!key) continue;
    const value = response.headers.get(`x-middleware-request-${key}`);
    if (value !== null) forwarded.set(key, value);
  }
  return forwarded;
}

describe("proxy", () => {
  it("sets the security headers on a locale-prefixed response", () => {
    const response = proxy(request("/en"));
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      expect(response.headers.get(name)).toBe(value);
    }
    expect(response.headers.get("Content-Security-Policy")).toContain(
      "'strict-dynamic'",
    );
  });

  it("sets the security headers on the locale redirect too", () => {
    const response = proxy(request("/projects"));
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://example.test/en/projects",
    );
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      expect(response.headers.get(name)).toBe(value);
    }
  });

  it("overwrites a nonce the client tried to supply", () => {
    const response = proxy(request("/en", { [NONCE_HEADER]: "attacker" }));
    expect(forwardedHeaders(response).get(NONCE_HEADER)).not.toBe("attacker");
  });

  it("drops a locale header the client supplied on a passthrough request", () => {
    // Static assets skip the redirect, so this path used to forward whatever the client sent.
    const response = proxy(
      request("/images/logo.webp", { [LOCALE_HEADER]: "fr" }),
    );
    expect(forwardedHeaders(response).get(LOCALE_HEADER)).toBeNull();
  });

  it("derives the locale header itself on a prefixed request", () => {
    const response = proxy(request("/fr/projects", { [LOCALE_HEADER]: "en" }));
    expect(forwardedHeaders(response).get(LOCALE_HEADER)).toBe("fr");
  });

  it("does not echo the nonce back to the client", () => {
    expect(proxy(request("/en")).headers.get(NONCE_HEADER)).toBeNull();
  });

  // These are served once, outside any locale segment. Redirecting them into one sent the browser
  // to a URL that answers 404, which is what production did to the manifest and the sitemap.
  it.each([
    "/manifest.webmanifest",
    "/robots.txt",
    "/sitemap.xml",
    "/opengraph-image?1c4e5b",
    // Asked for by the browser itself, at the root, with no link tag involved.
    "/favicon.ico",
  ])("serves %s without a locale redirect", (path) => {
    const response = proxy(request(path));
    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
    expect(forwardedHeaders(response).get(LOCALE_HEADER)).toBeNull();
  });

});
