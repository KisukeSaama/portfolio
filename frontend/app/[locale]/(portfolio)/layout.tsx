import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { PublicFooter } from "~/components/public-footer";
import { PublicHeader } from "~/components/public-header";
import { getDictionary } from "~/i18n";
import { isLocale, locales } from "~/i18n/config";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function PortfolioLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  return (
    <>
      <PublicHeader locale={locale} t={t} />
      <main id="main-content">{children}</main>
      <PublicFooter locale={locale} t={t} />
    </>
  );
}
