import Link from "next/link";
import { getDictionary, localePath } from "~/i18n";
import { activeLocale } from "~/i18n/server";

/**
 * Unknown paths under a locale, and case studies that are not published.
 *
 * Without this file the root `not-found.tsx` was used instead, and because that one carries its own
 * `<main id="main-content">` the page ended up with two of them, both claiming the same id, under a
 * header that had collapsed to nothing. A visitor landing here got a bare number on an empty page
 * with no way back other than the browser's own button.
 *
 * The locale comes from the header the proxy sets rather than from route params, which a not-found
 * boundary does not receive.
 */
export default async function LocaleNotFound() {
  const locale = await activeLocale();
  const t = getDictionary(locale);
  return (
    <section className="error-page">
      <div className="shell">
        <p className="error-code">404</p>
        <h1>{t.errors.notFoundTitle}</h1>
        <p className="error-body">{t.errors.notFoundBody}</p>
        {/* Three ways out rather than one: the visitor asked for something, so offer the shelves. */}
        <div className="error-actions">
          <Link className="button button-primary" href={localePath(locale, "/")}>
            {t.errors.backHome}
          </Link>
          <Link
            className="button button-secondary"
            href={localePath(locale, "/projects")}
          >
            {t.nav.projects}
          </Link>
          <Link className="text-link" href={localePath(locale, "/contact")}>
            {t.nav.contact}
          </Link>
        </div>
      </div>
    </section>
  );
}
