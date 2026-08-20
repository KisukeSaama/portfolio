import { describe, expect, it } from "vitest";
import { contentSecurityPolicy } from "../app/lib/csp";

describe("content security policy", () => {
  it("allows React development tooling to evaluate scripts", () => {
    expect(contentSecurityPolicy("test-nonce", true)).toContain("'unsafe-eval'");
  });

  it("does not allow eval in production", () => {
    expect(contentSecurityPolicy("test-nonce", false)).not.toContain(
      "'unsafe-eval'",
    );
  });

  it("carries the request nonce and never falls back to inline scripts", () => {
    const policy = contentSecurityPolicy("test-nonce", false);
    expect(policy).toContain("'nonce-test-nonce'");
    expect(policy).toContain("'strict-dynamic'");
    expect(policy).not.toContain("script-src 'self' 'unsafe-inline'");
  });

  it("keeps every fetch directive on this origin", () => {
    const policy = contentSecurityPolicy("test-nonce", false);
    for (const directive of [
      "default-src 'self'",
      "img-src 'self' data:",
      "media-src 'self'",
      "connect-src 'self'",
      "font-src 'self'",
      "object-src 'none'",
      "frame-src 'none'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ]) {
      expect(policy).toContain(directive);
    }
  });

  it("does not open the policy to arbitrary https hosts", () => {
    // A blanket `https:` on img-src or media-src turns any HTML injection into a working channel
    // for sending page contents off site, and neither directive needs one.
    expect(contentSecurityPolicy("test-nonce", false)).not.toMatch(
      /(img|media)-src[^;]*https:/,
    );
  });
});
