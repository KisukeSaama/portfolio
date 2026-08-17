import { FileText, Mail } from "lucide-react";
import type { Metadata } from "next";
import { profile } from "~/content/profile";
import { getDictionary, localePath } from "~/i18n";
import type { Locale } from "~/i18n/config";

type LocaleParams = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  return {
    title: t.contact.metaTitle,
    description: t.contact.metaDescription,
    alternates: { canonical: localePath(locale, "/contact") },
  };
}

export default async function ContactPage({ params }: LocaleParams) {
  const { locale } = await params;
  const t = getDictionary(locale);

  return (
    <>
      <header className="page-hero">
        <div className="shell">
          <h1>{t.contact.heroTitle}</h1>
          <p>{t.contact.heroBody}</p>
        </div>
      </header>

      <section className="section-compact" aria-labelledby="availability-title">
        <div className="shell">
          <div className="availability-card">
            <div className="availability-intro">
              <h2 id="availability-title">{t.availability.title}</h2>
              <p>{t.availability.lede}</p>
            </div>
            <dl className="availability-facts">
              {t.availability.facts.map((fact) => (
                <div className="availability-fact" key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="reach-title">
        <div className="shell readable">
          <h2 id="reach-title" className="section-heading">
            {t.contact.sectionTitle}
          </h2>

          <p className="contact-actions">
            <a
              className="button button-primary"
              href={`mailto:${profile.email}`}
            >
              <Mail size={18} aria-hidden /> {t.contact.sendEmail}
            </a>
            {profile.cvAvailable && (
              <a
                className="button button-secondary"
                href={profile.cvUrl}
                target="_blank"
                rel="noreferrer"
                hrefLang={profile.cvLanguage}
              >
                <FileText size={18} aria-hidden /> {t.contact.viewResume}
              </a>
            )}
          </p>

          <dl className="fact-rows">
            <div className="fact-row">
              <dt>{t.contact.labels.email}</dt>
              <dd>
                <a className="text-link" href={`mailto:${profile.email}`}>
                  {profile.email}
                </a>
              </dd>
            </div>
            <div className="fact-row">
              <dt>{t.contact.labels.phone}</dt>
              <dd>
                <a className="text-link" href={profile.phoneHref}>
                  {profile.phone}
                </a>
              </dd>
            </div>
            <div className="fact-row">
              <dt>{t.contact.labels.location}</dt>
              <dd>{t.contact.location}</dd>
            </div>
            <div className="fact-row">
              <dt>{t.contact.labels.github}</dt>
              <dd>
                <a
                  className="text-link"
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  github.com/KisukeSaama
                </a>
              </dd>
            </div>
            <div className="fact-row">
              <dt>{t.contact.labels.linkedin}</dt>
              <dd>
                <a
                  className="text-link"
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  linkedin.com/in/jo-blanchard
                </a>
              </dd>
            </div>
            {profile.cvAvailable && (
              <div className="fact-row">
                <dt>{t.contact.labels.resume}</dt>
                <dd>{t.contact.resumeNote}</dd>
              </div>
            )}
          </dl>

          <p className="muted">{t.contact.noForm}</p>
        </div>
      </section>
    </>
  );
}
