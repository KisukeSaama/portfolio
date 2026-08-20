import { ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import type { Dictionary } from "~/i18n";
import type { Locale } from "~/i18n/config";
import type { Project } from "~/types/api";
import { safeUrl } from "~/lib/safe-url";
import { hasDiagram, ProjectDiagram } from "./project-diagram";
import { ProjectMedia } from "./project-media";

/** The shared renderer for every public case-study page. */

function CaseSection({
  title,
  children,
  wide,
  split,
}: {
  title: string;
  children: ReactNode;
  /** Drops the heading column so the content gets the whole measure. Only the diagram needs it. */
  wide?: boolean;
  /** Uses the full measure for content that is deliberately arranged in columns. */
  split?: boolean;
}) {
  const className = [
    "case-section",
    wide ? "case-section-wide" : "",
    split ? "case-section-split" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={className}>
      <h2>{title}</h2>
      <div className="case-content">{children}</div>
    </section>
  );
}

/** The one line about how I work that belongs beside each flagship diagram, or nothing. */
function signalFor(slug: string, t: Dictionary) {
  if (slug === "janus") return t.showcase.janus.signal;
  if (slug === "episort") return t.showcase.episort.signal;
  return null;
}

/**
 * The drawing, the paragraph that reads it back, and the one line about how I work that goes with
 * it. A diagram shows the parts; the prose says why they are arranged that way. Neither is worth
 * much alone, and the paragraph used to render only when a project had no drawing, so the two
 * projects that have one were the two that never showed it.
 *
 * A project with neither renders nothing. An empty heading says less than no heading.
 */
function ArchitectureSection({
  project,
  t,
  locale,
}: {
  project: Project;
  t: Dictionary;
  locale: Locale;
}) {
  const drawn = hasDiagram(project.slug);
  const prose = project.architecture.trim();
  if (!drawn && !prose) return null;
  const signal = signalFor(project.slug, t);
  return (
    <CaseSection title={t.caseStudy.architecture} wide={drawn}>
      {drawn && <ProjectDiagram slug={project.slug} t={t} locale={locale} />}
      {prose && <p className={drawn ? "case-panel-wide" : undefined}>{prose}</p>}
      {signal && <p className="showcase-signal">{signal}</p>}
    </CaseSection>
  );
}

/**
 * The description and the fact list. A fact with no value is dropped rather than left as a label
 * pointing at nothing, which is what an unfinished draft used to show in the preview.
 */
export function CaseIntro({ project, t }: { project: Project; t: Dictionary }) {
  const facts = [
    [t.caseStudy.status, t.projects.status[project.status]],
    [t.caseStudy.role, project.role],
  ].filter(([, value]) => value?.trim());

  return (
    <div className="case-intro">
      {project.fullDescription.trim() && <p>{project.fullDescription}</p>}
      <dl className="case-facts">
        {facts.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/**
 * Four sections, in this order, on every case study: the problem, the decisions, the architecture,
 * what is left.
 *
 * It used to be thirteen, most of them a heading over two or three words. A page built that way
 * reads as a form someone filled in, not as an account of a piece of work, and a heading with a
 * fragment under it is worth less than no heading. Decisions and what-is-left are paragraphs here,
 * never bullets, which is a constraint on the content as much as on this file: a section with
 * nothing written for it does not render.
 */
export function CaseStudyBody({
  project,
  t,
  locale,
}: {
  project: Project;
  t: Dictionary;
  locale: Locale;
}) {
  const cover = project.media.find((media) => media.type === "COVER");
  const video = project.media.find((media) => media.type === "VIDEO");
  const poster = project.media.find((media) => media.type === "POSTER");
  const gallery = project.media.filter((media) => media.type === "GALLERY");
  const [beforeStatus, afterStatus] =
    t.caseStudy.currentStateBody.split("{status}");
  // Three is the ceiling on purpose. A fourth decision is always the weakest of the four, and a
  // reader who wanted the full list would be reading the repository instead.
  const decisions = project.decisions.slice(0, 3);
  const remains = project.nextSteps;
  const repositoryUrl = safeUrl(project.githubUrl);
  const demoUrl = safeUrl(project.demoUrl);
  // A project still at the concept stage has no stack and no repository. Splitting the section
  // anyway left the whole right-hand column empty, which reads as a layout that failed rather than
  // as a page with less to say.
  const hasSupportingColumn =
    project.technologies.length > 0 || Boolean(repositoryUrl || demoUrl);

  return (
    <>
      <ProjectMedia
        media={cover}
        title={project.title}
        t={t}
        className="case-media"
        priority
      />
      <CaseSection title={t.caseStudy.problem} split>
        <div className="case-split-grid case-problem-grid">
          <p>{project.problem}</p>
          <div className="case-subsection">
            <h3>{t.caseStudy.solution}</h3>
            <p>{project.solution}</p>
          </div>
        </div>
      </CaseSection>
      {decisions.length > 0 && (
        <CaseSection title={t.caseStudy.decisions}>
          {decisions.map((decision) => (
            <p key={decision}>{decision}</p>
          ))}
        </CaseSection>
      )}
      <ArchitectureSection project={project} t={t} locale={locale} />
      <CaseSection title={t.caseStudy.remains} split={hasSupportingColumn}>
        <div
          className={
            hasSupportingColumn ? "case-split-grid case-current-grid" : ""
          }
        >
          <div>
            <p className="case-status">
              {beforeStatus}
              <strong>
                {t.projects.status[project.status].toLocaleLowerCase(locale)}
              </strong>
              {afterStatus}
            </p>
            {remains.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {hasSupportingColumn && (
            <div>
              {project.technologies.length > 0 && (
                <div className="case-subsection">
                  <h3>{t.caseStudy.technologies}</h3>
                  <p className="case-technologies">
                    {project.technologies.join(" · ")}
                  </p>
                </div>
              )}
              {(repositoryUrl || demoUrl) && (
                <div className="project-actions case-actions">
                  {repositoryUrl && (
                    <a
                      className="button button-secondary"
                      href={repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub <ExternalLink size={16} aria-hidden />
                    </a>
                  )}
                  {demoUrl && (
                    <a
                      className="button button-primary"
                      href={demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t.caseStudy.demo} <ExternalLink size={16} aria-hidden />
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </CaseSection>
      {video && (
        <CaseSection title={t.caseStudy.demo}>
          <ProjectMedia
            media={video}
            title={project.title}
            t={t}
            className="case-media"
            poster={poster?.url}
          />
        </CaseSection>
      )}
      {gallery.length > 0 && (
        <CaseSection title={t.caseStudy.media}>
          <div className="gallery">
            {gallery.map((media) => (
              <figure key={media.url}>
                <ProjectMedia media={media} title={project.title} t={t} />
                {media.caption && <figcaption>{media.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </CaseSection>
      )}
    </>
  );
}
