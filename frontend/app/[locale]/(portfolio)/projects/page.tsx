import type { Metadata } from "next";
import { FeaturedProjects, SecondaryProjects } from "~/components/project-list";
import { getDictionary, localePath } from "~/i18n";
import type { Locale } from "~/i18n/config";
import { serverApiOrNull } from "~/lib/server-api";
import type { Project } from "~/types/api";

export const dynamic = "force-dynamic";

type LocaleParams = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  return {
    title: t.projectsPage.metaTitle,
    description: t.projectsPage.metaDescription,
    alternates: { canonical: localePath(locale, "/projects") },
  };
}

export default async function ProjectsPage({ params }: LocaleParams) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const projects = await serverApiOrNull<Project[]>(
    `/public/projects?locale=${locale}`,
    { revalidate: 0 },
  );
  const primary =
    projects?.filter((project) => project.featureLevel === "PRIMARY") ?? [];
  const secondary =
    projects?.filter((project) => project.featureLevel === "SECONDARY") ?? [];
  return (
    <>
      <header className="page-hero">
        <div className="shell">
          <h1>{t.projectsPage.heroTitle}</h1>
          <p>{t.projectsPage.heroBody}</p>
        </div>
      </header>
      <section className="section">
        <div className="shell">
          {projects ? (
            <>
              <FeaturedProjects projects={primary} locale={locale} t={t} />
              {/* The heading only earns its place when there is something under it. */}
              {secondary.length > 0 && (
                <>
                  <h2 className="section-heading">
                    {t.projectsPage.otherGrounds}
                  </h2>
                  <SecondaryProjects
                    projects={secondary}
                    locale={locale}
                    t={t}
                  />
                </>
              )}
            </>
          ) : (
            <p className="notice" role="status">
              {t.home.projectsUnavailable}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
