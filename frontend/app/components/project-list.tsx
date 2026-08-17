import { ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { Dictionary } from "~/i18n";
import { format, localePath } from "~/i18n";
import type { Locale } from "~/i18n/config";
import type { Project } from "~/types/api";
import { ProjectMedia } from "./project-media";

type ListProps = { projects: Project[]; locale: Locale; t: Dictionary };

export function FeaturedProjects({ projects, locale, t }: ListProps) {
  return (
    <div className="projects-featured">
      {projects.map((project, index) => {
        const cover = project.media.find((m) => m.type === "COVER");
        return (
          <article className="project-chapter" key={project.id}>
            <div>
              <span className="project-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="project-title">{project.title}</h3>
              <p className="project-description">{project.shortDescription}</p>
              <p className="project-problem">{project.problem}</p>
              <div className="project-meta">
                <span className="tag status">
                  {t.projects.statusLabel} {t.projects.status[project.status]}
                </span>
                {project.technologies.slice(0, 4).map((item) => (
                  <span className="tag" key={item}>
                    {item}
                  </span>
                ))}
              </div>
              <p className="muted">
                <strong>{t.projects.roleLabel}</strong> {project.role}
              </p>
              <div className="project-actions">
                <Link
                  href={localePath(locale, `/${project.slug}`)}
                  className="text-link"
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
            </div>
            <ProjectMedia
              media={cover}
              title={project.title}
              t={t}
              priority={index === 0}
            />
          </article>
        );
      })}
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
