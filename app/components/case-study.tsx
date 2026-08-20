import { ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import type { Dictionary } from "~/i18n";
import type { Locale } from "~/i18n/config";
import type { Project } from "~/types/api";
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
 * The mechanism, drawn, read back in a paragraph, and the one line about how I work that goes with
 * it. This is the first thing under the cover on the two flagship case studies, because a reader who
 * opened the page is asking how the thing works before asking anything else.
 *
 * The paragraph belongs here rather than beside the problem: a drawing shows the parts, and the
 * prose is what says why they are arranged that way. It used to render only when a project had no
 * drawing, so the two projects that have one were the two that never showed it.
 */
function MechanismSection({
  project,
  t,
  locale,
}: {
  project: Project;
  t: Dictionary;
  locale: Locale;
}) {
  if (!hasDiagram(project.slug)) return null;
  const signal = signalFor(project.slug, t);
  return (
    <CaseSection title={t.caseStudy.mechanism} wide>
      <ProjectDiagram slug={project.slug} t={t} locale={locale} />
      {project.architecture.trim() && (
        <p className="case-panel-wide">{project.architecture}</p>
      )}
      {signal && <p className="showcase-signal">{signal}</p>}
    </CaseSection>
  );
}

function CompactList({ items }: { items: string[] }) {
  return (
    <ul className="case-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
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
  const decisions = project.decisions.slice(0, 3);
  const challenges = project.challenges.slice(0, 2);
  const nextSteps = project.nextSteps.slice(0, 2);
  const hasMechanism = hasDiagram(project.slug);

  return (
    <>
      <ProjectMedia
        media={cover}
        title={project.title}
        t={t}
        className="case-media"
        priority
      />
      <MechanismSection project={project} t={t} locale={locale} />
      <CaseSection title={t.caseStudy.problem} split>
        <div className="case-split-grid case-problem-grid">
          <p>{project.problem}</p>
          <div className="case-subsection">
            <h3>{t.caseStudy.solution}</h3>
            <p>{project.solution}</p>
          </div>
          {!hasMechanism && project.architecture.trim() && (
            <div className="case-subsection case-panel-wide">
              <h3>{t.caseStudy.architecture}</h3>
              <p>{project.architecture}</p>
            </div>
          )}
        </div>
      </CaseSection>
      {(decisions.length > 0 || challenges.length > 0) && (
        <CaseSection title={t.caseStudy.decisions} split>
          <div className="case-split-grid case-decisions-grid">
            {decisions.length > 0 && <CompactList items={decisions} />}
            {challenges.length > 0 && (
              <div className="case-subsection">
                <h3>{t.caseStudy.challenges}</h3>
                <CompactList items={challenges} />
              </div>
            )}
          </div>
        </CaseSection>
      )}
      <CaseSection title={t.caseStudy.currentState} split>
        <div className="case-split-grid case-current-grid">
          <div>
            <p className="case-status">
              {beforeStatus}
              <strong>
                {t.projects.status[project.status].toLocaleLowerCase(locale)}
              </strong>
              {afterStatus}
            </p>
            {nextSteps.length > 0 && (
              <div className="case-subsection">
                <h3>{t.caseStudy.nextSteps}</h3>
                <CompactList items={nextSteps} />
              </div>
            )}
          </div>
          <div>
            {project.technologies.length > 0 && (
              <div className="case-subsection">
                <h3>{t.caseStudy.technologies}</h3>
                <p className="case-technologies">
                  {project.technologies.join(" · ")}
                </p>
              </div>
            )}
            {(project.githubUrl || project.demoUrl) && (
              <div className="project-actions case-actions">
                {project.githubUrl && (
                  <a
                    className="button button-secondary"
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub <ExternalLink size={16} aria-hidden />
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    className="button button-primary"
                    href={project.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t.caseStudy.demo} <ExternalLink size={16} aria-hidden />
                  </a>
                )}
              </div>
            )}
          </div>
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
