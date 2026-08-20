import type { Metadata } from "next";
import { getDictionary } from "~/i18n";
import type { Locale } from "~/i18n/config";
import { pageMetadata } from "~/lib/seo";

type LocaleParams = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  return {
    ...pageMetadata(locale, {
      path: "/legal",
      title: t.legal.metaTitle,
      description: t.legal.metaDescription,
    }),
    // Boilerplate that would compete with the pages worth ranking. It stays out of the index and
    // out of the sitemap.
    robots: { index: false, follow: false },
  };
}

export default async function LegalPage({ params }: LocaleParams) {
  const { locale } = await params;
  const t = getDictionary(locale);
  return (
    <>
      <header className="page-hero">
        <div className="shell">
          <h1>{t.legal.heroTitle}</h1>
          <p>{t.legal.heroBody}</p>
        </div>
      </header>
      <section className="section">
        <div className="shell">
          <div className="readable prose">
            <h2>{t.legal.publisher}</h2>
            <p>{t.legal.publisherBody}</p>
            <h2>{t.legal.hosting}</h2>
            <p>{t.legal.hostingBody}</p>
            <h2>{t.legal.data}</h2>
            <p>{t.legal.dataBody}</p>
          </div>
        </div>
      </section>
    </>
  );
}
