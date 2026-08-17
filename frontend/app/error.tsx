"use client";

import { defaultLocale } from "~/i18n/config";
import { getDictionary } from "~/i18n";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = getDictionary(defaultLocale);
  return (
    <main id="main-content" className="error-boundary">
      <div>
        <p className="error-code">500</p>
        <h1>{t.errors.unexpectedTitle}</h1>
        <p>{t.errors.unexpectedBody}</p>
        <button className="button button-primary" type="button" onClick={reset}>
          {t.errors.retry}
        </button>
      </div>
    </main>
  );
}
