import { describe, expect, it } from "vitest";
import {
  applySecurityHeaders,
  SECURITY_HEADERS,
  STRICT_TRANSPORT_SECURITY,
} from "../app/lib/security-headers";

describe("security headers", () => {
  it("sets every header the reverse proxy would otherwise have to supply", () => {
    const headers = new Headers();
    applySecurityHeaders(headers, false);
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      expect(headers.get(name)).toBe(value);
    }
  });

  it("sends HSTS in production", () => {
    const headers = new Headers();
    applySecurityHeaders(headers, true);
    expect(headers.get("Strict-Transport-Security")).toBe(
      STRICT_TRANSPORT_SECURITY,
    );
  });

  it("withholds HSTS outside production, so plain HTTP on localhost keeps working", () => {
    const headers = new Headers();
    applySecurityHeaders(headers, false);
    expect(headers.get("Strict-Transport-Security")).toBeNull();
  });

  it("replaces a value a client tried to set rather than appending to it", () => {
    const headers = new Headers({ "X-Frame-Options": "ALLOWALL" });
    applySecurityHeaders(headers, false);
    expect(headers.get("X-Frame-Options")).toBe("DENY");
  });
});
