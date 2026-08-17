export const locales = ["en", "fr"] as const;

export type Locale = (typeof locales)[number];

/** English is the source language: content is authored here and translated into `fr`. */
export const defaultLocale: Locale = "en";

/** Remembers the visitor's explicit choice so the next visit skips Accept-Language guessing. */
export const localeCookie = "portfolio-locale";

/**
 * How the proxy passes the active locale to server components that sit above the `[locale]` segment
 * and so cannot read it from route params: the root layout, and the not-found boundary.
 */
export const localeHeader = "x-portfolio-locale";

export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
};

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}
