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
      <section className="journey-story" aria-label={t.home.introTitle}>
        <div className="shell journey-story-layout">
          <header className="journey-story-heading">
            <h1>{t.journeyPage.storyTitle}</h1>
          </header>
          <div className="journey-story-copy">
            {t.introduction.slice(1).map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section journey-current" aria-labelledby="current-journey-title">
        <div className="shell">
          <h2 id="current-journey-title" className="section-heading">
            {t.home.journeyTitle}
          </h2>
          <ol className="journey-steps">
            {t.journey.map((item) => (
              <li className="journey-step" key={item.title}>
                <span className="journey-period">{item.period}</span>
                <h3>{item.title}</h3>
                <p className="journey-org">{item.org}</p>
                <p>{item.description}</p>
                {item.points.length > 0 && (
                  <ul className="journey-points">
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="journey-details" aria-label={`${t.earlierPath.title}, ${t.languages.title}, ${t.interests.title}`}>
        <div className="shell journey-details-grid">
          <div className="journey-detail-group">
            <h2 id="earlier-title">{t.earlierPath.title}</h2>
            <ol className="journey-earlier">
              {t.earlierPath.items.map((item) => (
                <li key={item.title}>
                  <span className="journey-period">{item.period}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="journey-detail-group">
            <h2>{t.languages.title}</h2>
            <dl className="journey-facts">
              {t.languages.items.map((item) => (
                <div key={item.name}>
                  <dt>{item.name}</dt>
                  <dd>{item.level}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="journey-detail-group journey-interests">
            <h2>{t.interests.title}</h2>
            <dl className="journey-facts">
              {t.interests.items.map((item) => (
                <div key={item.title}>
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
