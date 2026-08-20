import type { Metadata } from "next";
import { getDictionary, localePath } from "~/i18n";
import { defaultLocale, locales, type Locale } from "~/i18n/config";

const SITE_NAME = "Jonathan Blanchard";

type PageSeo = {
  /** In-site path without the locale prefix, as `localePath` expects it: `/`, `/projects`, ... */
  path: string;
  title: string;
  description: string;
  /**
   * Set on the home page, whose title already carries the name. Without it the title template
   * appends the site name a second time.
   */
  absoluteTitle?: boolean;
};

/**
 * Canonical URL plus the hreflang set for one path. Every page exists in both locales, so each one
 * declares the other; `x-default` sends an unmatched language to the source locale.
 */
function alternates(locale: Locale, path: string) {
  return {
    canonical: localePath(locale, path),
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, localePath(l, path)])),
      "x-default": localePath(defaultLocale, path),
    },
  };
}

/**
 * The metadata every public page needs: title, description, hreflang, and social cards.
 *
 * Next inherits `openGraph` from the root layout rather than deriving it from a page's own title,
 * so a page that only sets `title` would still be shared under the home page's card. Building both
 * here keeps the two in step.
 */
export function pageMetadata(locale: Locale, page: PageSeo): Metadata {
  const t = getDictionary(locale);
  const url = localePath(locale, page.path);
  const socialTitle = page.absoluteTitle
    ? page.title
    : `${page.title} | ${SITE_NAME}`;
  return {
    title: page.absoluteTitle ? { absolute: page.title } : page.title,
    description: page.description,
    alternates: alternates(locale, page.path),
    openGraph: {
      type: "website",
      locale: t.ogLocale,
      siteName: SITE_NAME,
      title: socialTitle,
      description: page.description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: page.description,
    },
  };
}
