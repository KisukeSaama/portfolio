/**
 * Guards the URLs that come from case-study content rather than from code.
 *
 * `githubUrl`, `demoUrl` and every `media.url` are authored in `app/content/projects.*.json`, and
 * they land in an `href` or a `src`. React renders `javascript:` and `data:text/html` URLs there
 * with nothing more than a development-mode warning, so a bad edit to a content file, or a future
 * switch to an authored source outside the repository, would be a scripting bug rather than a typo.
 *
 * An allowlist of schemes is the check that survives both: anything that is not an http(s) URL or a
 * site-relative path is dropped, and the link or the media simply does not render.
 */

/** Schemes a content-authored link may use. `mailto:` and `tel:` come from code, not content. */
const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

/**
 * Returns the URL when it is safe to place in an `href` or a `src`, and `null` otherwise.
 *
 * Site-relative values (`/images/cover.webp`) are kept as written. Protocol-relative values
 * (`//example.com`) are rejected: they read as a path but resolve to another origin.
 */
export function safeUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("//")) return null;
  if (trimmed.startsWith("/")) return trimmed;
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return null;
  }
  return ALLOWED_PROTOCOLS.has(parsed.protocol) ? parsed.href : null;
}
