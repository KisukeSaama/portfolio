import { ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Dictionary } from "~/i18n";
import { format, localePath } from "~/i18n";
import type { Locale } from "~/i18n/config";
import type { Project } from "~/types/content";
import { safeUrl } from "~/lib/safe-url";

type ListProps = { projects: Project[]; locale: Locale; t: Dictionary };
type CatalogProps = ListProps & { compact?: boolean };

/**
 * An outbound link whose address comes from case-study content rather than from code. It renders
 * nothing when the content does not hold an http(s) address, so a repository or demo field that
 * ever carried a script URL leaves a gap on the page instead of a live link.
 */
function ExternalProjectLink({
  url,
  children,
}: {
  url: string | null;
  children: ReactNode;
}) {
  const href = safeUrl(url);
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-link project-external-link"
    >
      {children} <ExternalLink size={15} aria-hidden />
    </a>
  );
}

function formatStartDate(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export function FeaturedProjects({ projects, locale, t }: ListProps) {
  return (
    <div className="projects-featured">
      {projects.map((project) => (
        <article className="project-card" key={project.slug}>
          <div className="project-card-heading">
            <div className="showcase-head">
              <h3 className="project-title">{project.title}</h3>
              <p className="status-pill">{t.projects.status[project.status]}</p>
            </div>
          </div>
          <div className="project-card-body">
            <p className="project-lede">{project.shortDescription}</p>
            <ul className="project-stack" aria-label={t.caseStudy.technologies}>
              {project.technologies.slice(0, 5).map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
            <div className="project-link-actions">
              <ExternalProjectLink url={project.githubUrl}>
                GitHub
              </ExternalProjectLink>
              <ExternalProjectLink url={project.demoUrl}>
                {t.projects.demo}
              </ExternalProjectLink>
              <Link
                href={localePath(locale, `/${project.slug}`)}
                className="project-case-link"
                aria-label={format(t.projects.caseStudyOf, {
                  title: project.title,
                })}
              >
                {t.projects.readCaseStudy} <ArrowRight size={17} aria-hidden />
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function ProjectCatalog({
  projects,
  locale,
  t,
  compact = false,
}: CatalogProps) {
  return (
    <div
      className={`project-catalog${compact ? " project-catalog-compact" : ""}`}
    >
      {projects.map((project) => (
        <article className="catalog-project" key={project.slug}>
          <div className="catalog-project-heading">
            <h2>{project.title}</h2>
            <p className="status-pill">{t.projects.status[project.status]}</p>
            {project.startedAt && (
              <p className="catalog-project-date">
                {t.projects.startedAt}{" "}
                <time dateTime={project.startedAt}>
                  {formatStartDate(project.startedAt, locale)}
                </time>
              </p>
            )}
          </div>
          <div className="catalog-project-body">
            <p className="catalog-project-lede">{project.shortDescription}</p>
            {project.technologies.length > 0 && (
              <ul
                className="project-stack"
                aria-label={t.caseStudy.technologies}
              >
                {project.technologies.slice(0, 6).map((technology) => (
                  <li key={technology}>{technology}</li>
                ))}
              </ul>
            )}
            <div className="project-link-actions">
              <ExternalProjectLink url={project.githubUrl}>
                GitHub
              </ExternalProjectLink>
              <Link
                href={localePath(locale, `/${project.slug}`)}
                className="project-case-link"
                aria-label={format(t.projects.caseStudyOf, {
                  title: project.title,
                })}
              >
                {t.projects.readCaseStudy} <ArrowRight size={17} aria-hidden />
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
