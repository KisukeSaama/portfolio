import "@fontsource-variable/manrope";
import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import { defaultLocale, isLocale, type Locale } from "~/i18n/config";
import { getDictionary } from "~/i18n";
import "./styles/global.css";

const siteUrl = process.env.PUBLIC_SITE_URL ?? "http://localhost:5173";
const themeScript = `(()=>{try{const saved=localStorage.getItem('jonathan-theme');const theme=saved==='light'||saved==='dark'?saved:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme}catch{}})()`;

/**
 * Only the root layout may render <html>, and it sits above the [locale] segment, so the active
 * locale arrives through the header the middleware sets on every request.
 */
async function activeLocale(): Promise<Locale> {
  const value = (await headers()).get("x-portfolio-locale") ?? undefined;
  return isLocale(value) ? value : defaultLocale;
}

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
  return (
    <html lang={t.htmlLang} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
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
