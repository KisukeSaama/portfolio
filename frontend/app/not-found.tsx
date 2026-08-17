import Link from "next/link";
import { defaultLocale } from "~/i18n/config";
import { getDictionary } from "~/i18n";

export default function NotFound() {
  // Rendered outside the [locale] segment, so it falls back to the source language.
  const t = getDictionary(defaultLocale);
  return (
    <main id="main-content" className="error-page">
      <div>
        <p className="error-code">404</p>
        <h1>{t.errors.notFoundTitle}</h1>
        <p>{t.errors.notFoundBody}</p>
        <Link className="button button-primary" href={`/${defaultLocale}`}>
          {t.errors.backHome}
        </Link>
      </div>
    </main>
  );
}
