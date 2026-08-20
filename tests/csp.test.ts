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
});
