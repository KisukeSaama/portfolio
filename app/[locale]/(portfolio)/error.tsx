"use client";

import { useParams } from "next/navigation";
import { getDictionary } from "~/i18n";
import { defaultLocale, isLocale } from "~/i18n/config";

/**
 * Error boundary inside the locale segment, so a failure on a French page is reported in French. The
 * root boundary stays as the last resort for failures above this point, where no locale is known.
 */
export default function PortfolioError({ reset }: { reset: () => void }) {
  const params = useParams<{ locale?: string }>();
  const locale = isLocale(params?.locale) ? params.locale : defaultLocale;
  const t = getDictionary(locale);
  return (
    <div className="error-boundary">
      <div>
        <p className="error-code">500</p>
        <h1>{t.errors.unexpectedTitle}</h1>
        <p>{t.errors.unexpectedBody}</p>
        <button className="button button-primary" type="button" onClick={reset}>
          {t.errors.retry}
        </button>
      </div>
    </div>
  );
}
