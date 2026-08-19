import type { Metadata } from "next";
import { getDictionary } from "~/i18n";
import type { Locale } from "~/i18n/config";

type LocaleParams = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: getDictionary(locale).legal.metaTitle,
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
        <div className="shell readable">
          <h2>{t.legal.publisher}</h2>
          <p>{t.legal.publisherBody}</p>
          <h2>{t.legal.hosting}</h2>
          <p>{t.legal.hostingBody}</p>
          <h2>{t.legal.data}</h2>
          <p>{t.legal.dataBody}</p>
        </div>
      </section>
    </>
  );
}
