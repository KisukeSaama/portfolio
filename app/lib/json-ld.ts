/**
 * Serializes structured data for a `<script type="application/ld+json">` block.
 *
 * `JSON.stringify` leaves `<` alone, so a case study whose description contains `</script>` closes
 * the block early and everything after it is parsed as HTML by the browser. Project content is
 * stored as plain text, so it must remain inert when embedded in a script element.
 *
 * Escaping the characters that can open a tag or an HTML comment keeps the payload inert. JSON
 * parsers read `<` back as `<`, so the structured data search engines see is unchanged.
 * U+2028 and U+2029 are valid in JSON but not inside a JavaScript string literal, and would make
 * the block fail to parse.
 */
export function jsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
