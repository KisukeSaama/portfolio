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
            {t.journey.map((item) => (
              <li className="journey-item" key={item.title}>
                <span className="journey-period">{item.period}</span>
                <div>
                  <h2>{item.title}</h2>
                  <p className="journey-org">{item.org}</p>
                  <p>{item.description}</p>
                  {item.points.length > 0 && (
                    <ul className="journey-points">
                      {item.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-compact" aria-labelledby="earlier-title">
        <div className="shell">
          <h2 id="earlier-title" className="section-heading">
            {t.earlierPath.title}
          </h2>
          <ol className="journey-list journey-list-quiet">
            {t.earlierPath.items.map((item) => (
              <li className="journey-item" key={item.title}>
                <span className="journey-period">{item.period}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-compact" aria-labelledby="languages-title">
        <div className="shell side-by-side">
          <div>
            <h2 id="languages-title" className="section-heading">
              {t.languages.title}
            </h2>
            <dl className="fact-rows">
              {t.languages.items.map((item) => (
                <div className="fact-row" key={item.name}>
                  <dt>{item.name}</dt>
                  <dd>{item.level}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h2 className="section-heading">{t.interests.title}</h2>
            <dl className="fact-rows">
              {t.interests.items.map((item) => (
                <div className="fact-row fact-row-stacked" key={item.title}>
                  <dt>{item.title}</dt>
                  <dd>{item.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <ContactPanel locale={locale} t={t} />
    </>
  );
}
