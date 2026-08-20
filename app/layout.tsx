import "@fontsource-variable/manrope";
import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import { getDictionary } from "~/i18n";
import { activeLocale } from "~/i18n/server";
import { NONCE_HEADER } from "~/lib/csp";
import { PRE_PAINT_THEME_SCRIPT } from "~/lib/theme";
import "./styles/global.css";

const siteUrl = process.env.PUBLIC_SITE_URL ?? "http://localhost:5173";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await activeLocale();
  const t = getDictionary(locale);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t.site.titleDefault, template: t.site.titleTemplate },
    description: t.home.metaDescription,
    applicationName: t.site.applicationName,
    authors: [{ name: "Jonathan Blanchard", url: siteUrl }],
    creator: "Jonathan Blanchard",
    alternates: { canonical: `/${locale}` },
    openGraph: {
      type: "website",
      locale: t.ogLocale,
      siteName: "Jonathan Blanchard",
      title: t.site.titleDefault,
      description: t.site.ogDescription,
      url: `/${locale}`,
    },
    twitter: {
      card: "summary_large_image",
      title: t.site.titleDefault,
      description: t.site.ogDescription,
    },
    icons: {
      icon: {
        url: "/images/jonathan-blanchard-favicon.webp",
        type: "image/webp",
        sizes: "64x64",
      },
      shortcut: "/images/jonathan-blanchard-favicon.webp",
      apple: {
        url: "/images/jonathan-blanchard-apple-touch-icon.webp",
        type: "image/webp",
        sizes: "180x180",
      },
    },
    manifest: "/manifest.webmanifest",
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // No `themeColor` here. It would only ever key off the OS query, which a saved choice overrides,
  // and a second tag would win over the one the theme script writes. See `applyTheme`.
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = await activeLocale();
  const t = getDictionary(locale);
  // Set by the proxy on every HTML request. It has to reach this inline script, which runs before
  // first paint so the theme does not flash, and so cannot be moved into a bundled file.
  const nonce = (await headers()).get(NONCE_HEADER) ?? undefined;
  return (
    <html lang={t.htmlLang} suppressHydrationWarning>
      <head>
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: PRE_PAINT_THEME_SCRIPT }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          {t.site.skipToContent}
        </a>
        {children}
      </body>
    </html>
  );
}
