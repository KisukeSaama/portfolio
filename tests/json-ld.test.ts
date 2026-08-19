import { describe, expect, it } from "vitest";
import { jsonLd } from "~/lib/json-ld";

describe("jsonLd", () => {
  it("cannot close the script block it is embedded in", () => {
    const payload = jsonLd({
      description: "</script><script>alert(1)</script>",
    });
    expect(payload).not.toContain("</script>");
    expect(payload).not.toContain("<");
    expect(payload).not.toContain(">");
  });

  it("escapes the comment opener too", () => {
    expect(jsonLd({ description: "<!--" })).not.toContain("<!--");
  });

  it("keeps the escaped payload parseable and unchanged", () => {
    const value = { name: "A & B", description: "</script>" };
    expect(JSON.parse(jsonLd(value))).toEqual(value);
  });

  it("escapes line separators, which are not legal in a JavaScript string", () => {
    expect(jsonLd({ a: "x\u2028y\u2029z" })).toBe(
      '{"a":"x\\u2028y\\u2029z"}',
    );
  });
});
