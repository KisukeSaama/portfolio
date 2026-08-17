import type { Metadata } from "next";
import { ContactPanel } from "~/components/contact-panel";
import { getDictionary, localePath } from "~/i18n";
import type { Locale } from "~/i18n/config";

type LocaleParams = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  return {
    title: t.journeyPage.metaTitle,
    description: t.journeyPage.metaDescription,
    alternates: { canonical: localePath(locale, "/journey") },
  };
}

export default async function JourneyPage({ params }: LocaleParams) {
  const { locale } = await params;
  const t = getDictionary(locale);
  return (
    <>
      <header className="page-hero">
        <div className="shell">
          <h1>{t.journeyPage.heroTitle}</h1>
          <p>{t.journeyPage.heroBody}</p>
        </div>
      </header>
      <section className="section">
        <div className="shell">
          <ol className="journey-list">
            {t.journey.map((item, index) => (
              <li className="journey-item" key={item.title}>
                <span className="journey-period">{item.period}</span>
                <div>
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                  {index === 0 && (
                    <span className="placeholder-note">
                      {t.journeyPage.placeholder}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <ContactPanel locale={locale} t={t} />
    </>
  );
}
