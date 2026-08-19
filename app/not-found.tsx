import Link from "next/link";
import { PublicFooter } from "~/components/public-footer";
import { PublicHeader } from "~/components/public-header";
import { getDictionary, localePath } from "~/i18n";
import { activeLocale } from "~/i18n/server";

/**
 * Paths that never reached a locale segment, so no layout has run and this page has to bring the
 * site with it. Anything under `/fr` or `/en` is handled by the not-found inside that segment, which
 * already sits in the portfolio layout.
 *
 * The locale still comes from the proxy, so a French visitor is not defaulted into English.
 */
export default async function NotFound() {
  const locale = await activeLocale();
  const t = getDictionary(locale);
  return (
    <>
      <PublicHeader locale={locale} t={t} />
      <main id="main-content" className="error-page">
        <div className="shell">
          <p className="error-code">404</p>
          <h1>{t.errors.notFoundTitle}</h1>
          <p className="error-body">{t.errors.notFoundBody}</p>
          <div className="error-actions">
            <Link
              className="button button-primary"
              href={localePath(locale, "/")}
            >
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
      </main>
      <PublicFooter locale={locale} t={t} />
    </>
  );
}
