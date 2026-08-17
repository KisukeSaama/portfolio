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
    title: t.about.metaTitle,
    description: t.about.metaDescription,
    alternates: { canonical: localePath(locale, "/about") },
  };
}

export default async function AboutPage({ params }: LocaleParams) {
  const { locale } = await params;
  const t = getDictionary(locale);
  return (
    <>
      <header className="page-hero">
        <div className="shell">
          <h1>{t.about.heroTitle}</h1>
          <p>{t.about.heroBody}</p>
        </div>
      </header>
      <section className="section">
        <div className="shell intro-grid">
          <h2 className="section-heading">{t.about.sectionTitle}</h2>
          <div className="intro-copy">
            {t.introduction.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
        </div>
      </section>
      <section className="section-compact">
        <div className="shell">
          <div className="principles">
            {t.about.pillars.map((pillar) => (
              <article className="principle" key={pillar.title}>
                <h3>{pillar.title}</h3>
                <p>{pillar.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <ContactPanel locale={locale} t={t} />
    </>
  );
}
