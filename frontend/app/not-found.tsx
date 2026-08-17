import Link from "next/link";
import { getDictionary } from "~/i18n";
import { activeLocale } from "~/i18n/server";

/**
 * Reached for any unmatched path, including `/fr/...`, so it reads the locale the proxy resolved
 * rather than defaulting a French visitor into English.
 */
export default async function NotFound() {
  const locale = await activeLocale();
  const t = getDictionary(locale);
  return (
    <main id="main-content" className="error-page">
      <div>
        <p className="error-code">404</p>
        <h1>{t.errors.notFoundTitle}</h1>
        <p>{t.errors.notFoundBody}</p>
        <Link className="button button-primary" href={`/${locale}`}>
          {t.errors.backHome}
        </Link>
      </div>
    </main>
  );
}
