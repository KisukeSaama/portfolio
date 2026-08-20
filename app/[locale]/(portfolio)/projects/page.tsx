import type { Metadata } from "next";
import { ProjectCatalog } from "~/components/project-list";
import { getProjects } from "~/content/projects";
import { getDictionary, localePath } from "~/i18n";
import type { Locale } from "~/i18n/config";

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
  const projects = getProjects(locale);
  const personalProjects = projects.filter(
    (project) => project.projectType === "PERSONAL",
  );
  const schoolProjects = projects.filter(
    (project) => project.projectType !== "PERSONAL",
  );
  return (
    <>
      <header className="page-hero">
        <div className="shell">
          <h1>{t.projectsPage.heroTitle}</h1>
          <p>{t.projectsPage.heroBody}</p>
        </div>
      </header>
      <section
        className="section projects-page projects-page-personal"
        aria-labelledby="personal-projects"
      >
        <div className="shell">
          <h2 className="projects-group-heading" id="personal-projects">
            {t.projectsPage.personalProjects}
          </h2>
          <ProjectCatalog
            projects={personalProjects}
            locale={locale}
            t={t}
          />
        </div>
      </section>
      {schoolProjects.length > 0 && (
        <section
          className="section projects-page-school"
          aria-labelledby="school-projects"
        >
          <div className="shell">
            <h2 className="projects-group-heading" id="school-projects">
              {t.projectsPage.schoolProjects}
            </h2>
            <ProjectCatalog
              projects={schoolProjects}
              locale={locale}
              t={t}
              compact
            />
          </div>
        </section>
      )}
    </>
  );
}
