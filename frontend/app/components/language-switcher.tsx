"use client";

import { usePathname, useRouter } from "next/navigation";
import { localeCookie, localeNames, locales, type Locale } from "~/i18n/config";

/** Remembers the choice for the next visit that arrives without a locale prefix. */
function rememberLocale(next: Locale) {
  document.cookie = `${localeCookie}=${next};path=/;max-age=31536000;samesite=lax`;
}

/**
 * Swaps the locale segment of the current path, so switching language keeps the visitor on the page
 * they were reading.
 */
export function LanguageSwitcher({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(next: Locale) {
    if (next === locale) return;
    rememberLocale(next);
    const rest = pathname.split("/").slice(2).join("/");
    router.push(rest ? `/${next}/${rest}` : `/${next}`);
    router.refresh();
  }

  return (
    <div className="language-switcher" role="group" aria-label={label}>
      {locales.map((option) => (
        <button
          key={option}
          type="button"
          className="language-option"
          data-active={option === locale}
          aria-current={option === locale ? "true" : undefined}
          lang={option}
          onClick={() => switchTo(option)}
        >
          <abbr title={localeNames[option]}>{option.toUpperCase()}</abbr>
        </button>
      ))}
    </div>
  );
}
