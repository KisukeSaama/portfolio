import "@fontsource-variable/manrope";
import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import { getDictionary } from "~/i18n";
import { activeLocale } from "~/i18n/server";
import { NONCE_HEADER } from "~/lib/csp";
import "./styles/global.css";

const siteUrl = process.env.PUBLIC_SITE_URL ?? "http://localhost:5173";
const themeScript = `(()=>{try{const saved=localStorage.getItem('jonathan-theme');const theme=saved==='light'||saved==='dark'?saved:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme}catch{}})()`;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await activeLocale();
  const t = getDictionary(locale);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t.site.titleDefault, template: t.site.titleTemplate },
    description: t.profile.tagline,
    applicationName: t.site.applicationName,
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
    icons: { icon: "/favicon.svg" },
    manifest: "/manifest.webmanifest",
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5efe5" },
    { media: "(prefers-color-scheme: dark)", color: "#20211f" },
  ],
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
          dangerouslySetInnerHTML={{ __html: themeScript }}
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
