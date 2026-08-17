import { getDictionary } from "~/i18n";
import { activeLocale } from "~/i18n/server";

export default async function Loading() {
  const t = getDictionary(await activeLocale());
  return (
    <main id="main-content" className="loading-page" aria-live="polite">
      <p className="muted">{t.errors.loading}</p>
    </main>
  );
}
