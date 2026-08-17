import "server-only";

import { headers } from "next/headers";
import { defaultLocale, isLocale, localeHeader, type Locale } from "./config";

/**
 * The locale for the surfaces that render outside the `[locale]` segment and therefore have no
 * route param to read: the root layout and the not-found boundary. Falls back to the source
 * language when the header is absent, which happens for the unprefixed paths the proxy skips.
 */
export async function activeLocale(): Promise<Locale> {
  const value = (await headers()).get(localeHeader) ?? undefined;
  return isLocale(value) ? value : defaultLocale;
}
