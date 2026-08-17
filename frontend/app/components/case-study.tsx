import { ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import type { Dictionary } from "~/i18n";
import type { Locale } from "~/i18n/config";
import type { Project } from "~/types/api";
import { ProjectMedia } from "./project-media";

/**
 * The case study body, shared by the public project page and the administration preview. The preview
 * used to render three sections of its own, so it showed the operator something publishing would
 * never produce. One renderer means the preview is the page.
 */

function CaseSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="case-section">
      <h2>{title}</h2>
      <div className="case-content">{children}</div>
    </section>
  );
}

/** A prose section, omitted when the field is empty rather than printing a bare heading. */
function TextSection({ title, value }: { title: string; value: string }) {
  return value.trim() ? (
    <CaseSection title={title}>
      <p>{value}</p>
    </CaseSection>
  ) : null;
}

/**
 * A list section, omitted when empty. It used to print "This part will be filled in as the project
 * moves forward." under every empty heading, which on a sparse project repeated five times and read
 * as an unfinished page rather than an honest one. What is still open belongs in Next steps.
 */
function ListSection({ title, items }: { title: string; items: string[] }) {
  return items.length ? (
    <CaseSection title={title}>
      <ul className="case-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </CaseSection>
  ) : null;
}

/**
 * The description and the fact list. A fact with no value is dropped rather than left as a label
 * pointing at nothing, which is what an unfinished draft used to show in the preview.
 */
export function CaseIntro({ project, t }: { project: Project; t: Dictionary }) {
  const facts = [
    [t.caseStudy.status, t.projects.status[project.status]],
    [t.caseStudy.type, t.projects.type[project.projectType]],
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

  return (
    <>
      <ProjectMedia
        media={cover}
        title={project.title}
        t={t}
        className="case-media"
        priority
      />
      <TextSection title={t.caseStudy.problem} value={project.problem} />
      <TextSection title={t.caseStudy.context} value={project.context} />
      <ListSection title={t.caseStudy.objectives} items={project.objectives} />
      <TextSection title={t.caseStudy.solution} value={project.solution} />
      <ListSection title={t.caseStudy.features} items={project.features} />
      <TextSection
        title={t.caseStudy.architecture}
        value={project.architecture}
      />
      {project.technologies.length > 0 && (
        <CaseSection title={t.caseStudy.technologies}>
          <p>{project.technologies.join(" · ")}</p>
        </CaseSection>
      )}
      <ListSection title={t.caseStudy.decisions} items={project.decisions} />
      <ListSection title={t.caseStudy.challenges} items={project.challenges} />
      <ListSection title={t.caseStudy.learnings} items={project.learnings} />
      <CaseSection title={t.caseStudy.currentState}>
        <p>
          {beforeStatus}
          <strong>
            {t.projects.status[project.status].toLocaleLowerCase(locale)}
          </strong>
          {afterStatus}
        </p>
      </CaseSection>
      <ListSection title={t.caseStudy.nextSteps} items={project.nextSteps} />
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
              <figure key={media.id}>
                <ProjectMedia media={media} title={project.title} t={t} />
                {media.caption && <figcaption>{media.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </CaseSection>
      )}
      {(project.githubUrl || project.demoUrl) && (
        <CaseSection title={t.caseStudy.links}>
          <div className="project-actions">
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
        </CaseSection>
      )}
    </>
  );
}
