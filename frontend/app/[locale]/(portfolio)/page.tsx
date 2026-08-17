import { ArrowRight, FileText } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactPanel } from "~/components/contact-panel";
import { FeaturedProjects, SecondaryProjects } from "~/components/project-list";
import { profile } from "~/content/profile";
import { getDictionary, localePath } from "~/i18n";
import type { Locale } from "~/i18n/config";
import { serverApi } from "~/lib/server-api";
import type { Project } from "~/types/api";

export const dynamic = "force-dynamic";

type LocaleParams = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  return {
    title: t.home.metaTitle,
    description: t.profile.tagline,
    alternates: { canonical: localePath(locale, "/") },
  };
}

export default async function HomePage({ params }: LocaleParams) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const projects = await serverApi<Project[]>("/public/projects", {
    revalidate: 0,
  });
  const primary = projects.filter(
    (project) => project.featureLevel === "PRIMARY",
  );
  const secondary = projects.filter(
    (project) => project.featureLevel === "SECONDARY",
  );

  return (
    <>
      <section className="hero">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="hero-name">{profile.name}</p>
            <h1>{t.profile.title}</h1>
            <p className="hero-statement">{t.profile.tagline}</p>
            <p className="hero-availability">{t.profile.availability}</p>
            <div className="hero-actions">
              <Link
                href={localePath(locale, "/about")}
                className="button button-primary"
              >
                {t.home.discoverApproach} <ArrowRight size={18} aria-hidden />
              </Link>
              {profile.cvAvailable ? (
                <a
                  href={profile.cvUrl}
                  className="button button-secondary"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FileText size={18} aria-hidden /> {t.home.viewResume}
                </a>
              ) : (
                <Link
                  href={localePath(locale, "/contact")}
                  className="button button-secondary"
                >
                  {t.home.contactMe}
                </Link>
              )}
            </div>
          </div>
          <div className="portrait-frame">
            <Image
              src={profile.photo}
              alt={t.profile.photoAlt}
              width={800}
              height={1000}
              priority
              sizes="(max-width: 760px) 82vw, 38vw"
            />
          </div>
        </div>
      </section>

      <section className="intro-section section" aria-labelledby="intro-title">
        <div className="shell intro-grid">
          <h2 id="intro-title" className="intro-title">
            {t.home.introTitle}
          </h2>
          <div className="intro-copy">
            {t.introduction.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="approach-title">
        <div className="shell">
          <h2 id="approach-title" className="section-heading">
            {t.home.approachTitle}
          </h2>
          <p className="section-lede">{t.home.approachLede}</p>
          <div className="principles">
            {t.home.principles.map((principle) => (
              <div className="principle" key={principle.title}>
                <h3>{principle.title}</h3>
                <p>{principle.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="journey-title">
        <div className="shell">
          <h2 id="journey-title" className="section-heading">
            {t.home.journeyTitle}
          </h2>
          <ol className="journey-list">
            {t.journey.map((item, index) => (
              <li className="journey-item" key={item.title}>
                <span className="journey-period">{item.period}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  {index === 0 && (
                    <span className="placeholder-note">
                      {t.home.journeyPlaceholder}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ol>
          <p>
            <Link href={localePath(locale, "/journey")} className="text-link">
              {t.home.fullJourney} <ArrowRight size={16} aria-hidden />
            </Link>
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="projects-title">
        <div className="shell">
          <h2 id="projects-title" className="section-heading">
            {t.home.projectsTitle}
          </h2>
          <p className="section-lede">{t.home.projectsLede}</p>
          <FeaturedProjects projects={primary} locale={locale} t={t} />
          <SecondaryProjects projects={secondary} locale={locale} t={t} />
          <p>
            <Link
              href={localePath(locale, "/projects")}
              className="button button-secondary"
            >
              {t.home.allProjects}
            </Link>
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="skills-title">
        <div className="shell">
          <h2 id="skills-title" className="section-heading">
            {t.home.skillsTitle}
          </h2>
          <div className="skills-list">
            {t.skillGroups.map((group) => (
              <article className="skill-group" key={group.title}>
                <h3>{group.title}</h3>
                <p>{group.summary}</p>
                <p className="skill-names">{group.skills.join(" · ")}</p>
                <p className="skill-proof">
                  {t.home.skillProof} {group.proof}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <ContactPanel locale={locale} t={t} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: profile.name,
            jobTitle: t.site.jobTitle,
            description: t.profile.tagline,
          }),
        }}
      />
    </>
  );
}
