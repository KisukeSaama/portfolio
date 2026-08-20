import { describe, expect, it } from "vitest";
import { safeUrl } from "../app/lib/safe-url";

describe("safeUrl", () => {
  it("keeps http and https addresses", () => {
    expect(safeUrl("https://github.com/KisukeSaama/janus")).toBe(
      "https://github.com/KisukeSaama/janus",
    );
    expect(safeUrl("http://example.test/demo")).toBe("http://example.test/demo");
  });

  it("keeps site-relative paths as written", () => {
    expect(safeUrl("/images/cover.webp")).toBe("/images/cover.webp");
  });

  it("rejects script and data URLs", () => {
    expect(safeUrl("javascript:alert(1)")).toBeNull();
    expect(safeUrl("  JavaScript:alert(1)")).toBeNull();
    expect(safeUrl("data:text/html,<script>alert(1)</script>")).toBeNull();
    expect(safeUrl("vbscript:msgbox(1)")).toBeNull();
  });

  it("rejects protocol-relative addresses, which read as a path but leave the origin", () => {
    expect(safeUrl("//evil.test/cover.webp")).toBeNull();
  });

  it("rejects empty and absent values", () => {
    expect(safeUrl(null)).toBeNull();
    expect(safeUrl(undefined)).toBeNull();
    expect(safeUrl("   ")).toBeNull();
    expect(safeUrl("not a url")).toBeNull();
  });
});
