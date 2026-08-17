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
  // The sentence wraps a <code> element, so it is split around the placeholder, not formatted.
  const [beforeFile, afterFile] = t.contact.emailMissing.split("{file}");

  return (
    <>
      <header className="page-hero">
        <div className="shell">
          <h1>{t.contact.heroTitle}</h1>
          <p>{t.contact.heroBody}</p>
        </div>
      </header>
      <section className="section">
        <div className="shell readable">
          <h2 className="section-heading">{t.contact.sectionTitle}</h2>
          {profile.email ? (
            <p>
              <a
                className="button button-primary"
                href={`mailto:${profile.email}`}
              >
                {t.contact.sendEmail}
              </a>
            </p>
          ) : (
            <p className="form-error">
              {beforeFile}
              <code>frontend/app/content/profile.ts</code>
              {afterFile}
            </p>
          )}
          {profile.githubUrl && (
            <p>
              <a className="text-link" href={profile.githubUrl}>
                GitHub
              </a>
            </p>
          )}
          {profile.linkedinUrl && (
            <p>
              <a className="text-link" href={profile.linkedinUrl}>
                LinkedIn
              </a>
            </p>
          )}
          {profile.cvAvailable ? (
            <p>
              <a className="button button-secondary" href={profile.cvUrl}>
                {t.contact.viewResume}
              </a>
            </p>
          ) : (
            <p className="muted">{t.contact.resumeMissing}</p>
          )}
        </div>
      </section>
    </>
  );
}
