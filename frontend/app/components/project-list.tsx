import { ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { Dictionary } from "~/i18n";
import { format, localePath } from "~/i18n";
import type { Locale } from "~/i18n/config";
import type { Project } from "~/types/api";
import { hasDiagram, ProjectDiagram } from "./project-diagram";
import { ProjectMedia } from "./project-media";

type ListProps = { projects: Project[]; locale: Locale; t: Dictionary };

/** The one line about how I work that belongs beside each flagship diagram, or nothing. */
function signalFor(slug: string, t: Dictionary) {
  if (slug === "janus") return t.showcase.janus.signal;
  if (slug === "episort") return t.showcase.episort.signal;
  return null;
}

/**
 * A featured project used to be a two-column chapter: a text column, and beside it a four-by-three
 * box holding a placeholder. Half the width of the strongest thing on the page therefore carried no
 * information at all, and the mechanism that makes each project interesting sat a click away.
 *
 * The chapter is now a full-width band, and the visual slot holds the mechanism itself. A project
 * with no diagram keeps the same band and falls back to its cover, so anything published later from
 * the administration area still renders.
 */
export function FeaturedProjects({ projects, locale, t }: ListProps) {
  return (
    <div className="projects-featured">
      {projects.map((project, index) => {
        const cover = project.media.find((m) => m.type === "COVER");
        const signal = signalFor(project.slug, t);
        const drawn = hasDiagram(project.slug);
        return (
          <article className="project-showcase" key={project.id}>
            <div className="showcase-head">
              <h3 className="project-title">{project.title}</h3>
              <p className="status-pill">{t.projects.status[project.status]}</p>
            </div>
            <p className="project-lede">{project.shortDescription}</p>

            {drawn && <ProjectDiagram slug={project.slug} t={t} locale={locale} />}
            {/* A real screenshot, once there is one, sits under the drawing rather than replacing
                it: the diagram explains the mechanism, a capture only shows one screen of it. */}
            {(cover || !drawn) && (
              <ProjectMedia
                media={cover}
                title={project.title}
                t={t}
                className="showcase-media"
                priority={index === 0}
              />
            )}

            <div className="showcase-body">
              <dl className="project-meta">
                <dt>{t.projects.stackLabel}</dt>
                <dd>{project.technologies.slice(0, 5).join(" · ")}</dd>
                <dt>{t.projects.roleLabel}</dt>
                <dd>{project.role}</dd>
              </dl>
              {signal && <p className="showcase-signal">{signal}</p>}
            </div>

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
