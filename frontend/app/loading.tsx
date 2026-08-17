import { defaultLocale } from "~/i18n/config";
import { getDictionary } from "~/i18n";

export default function Loading() {
  return (
    <main id="main-content" className="error-page" aria-live="polite">
      <div>
        <p className="muted">{getDictionary(defaultLocale).errors.loading}</p>
      </div>
    </main>
  );
}
