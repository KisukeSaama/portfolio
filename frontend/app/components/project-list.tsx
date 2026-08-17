import { ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { Dictionary } from "~/i18n";
import { format, localePath } from "~/i18n";
import type { Locale } from "~/i18n/config";
import type { Project } from "~/types/api";

type ListProps = { projects: Project[]; locale: Locale; t: Dictionary };

/**
 * A featured project on a listing page. It answers three questions and stops: what is it, what is it
 * built with, and is it finished. The mechanism, the diagram and the reasoning live on the case study
 * page, where a reader who wants them has already asked for them. A listing that tried to carry all
 * of that made two projects fill four screens, and nobody scrolls a summary.
 */
export function FeaturedProjects({ projects, locale, t }: ListProps) {
  return (
    <div className="projects-featured">
      {projects.map((project) => (
        <article className="project-card" key={project.id}>
          <div className="showcase-head">
            <h3 className="project-title">{project.title}</h3>
            <p className="status-pill">{t.projects.status[project.status]}</p>
          </div>
          <p className="project-lede">{project.shortDescription}</p>
          <p className="project-stack">
            {project.technologies.slice(0, 5).join(" · ")}
          </p>
          <div className="project-actions">
            <Link
              href={localePath(locale, `/${project.slug}`)}
              className="button button-secondary"
            >
              {t.projects.readCaseStudy} <ArrowRight size={17} aria-hidden />
            </Link>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                GitHub <ExternalLink size={15} aria-hidden />
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                {t.projects.demo} <ExternalLink size={15} aria-hidden />
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

export function SecondaryProjects({ projects, locale, t }: ListProps) {
  return (
    <div className="secondary-projects">
      {projects.map((project) => (
        <article className="secondary-project" key={project.id}>
          <h3>{project.title}</h3>
          <p>
            {project.shortDescription}{" "}
            {project.projectType !== "PERSONAL" && (
              <strong>{t.projects.type[project.projectType]}.</strong>
            )}
          </p>
          <Link
            href={localePath(locale, `/${project.slug}`)}
            className="text-link"
            aria-label={format(t.projects.caseStudyOf, {
              title: project.title,
            })}
          >
            {t.projects.discover} <ArrowRight size={16} aria-hidden />
          </Link>
        </article>
      ))}
    </div>
  );
}
