import { ArrowLeft, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { cache, type ReactNode } from "react";
import { ProjectMedia } from "~/components/project-media";
import type { Dictionary } from "~/i18n";
import { getDictionary, localePath } from "~/i18n";
import type { Locale } from "~/i18n/config";
import { serverApi } from "~/lib/server-api";
import type { Project } from "~/types/api";

export const dynamic = "force-dynamic";

type PageParams = { params: Promise<{ locale: Locale; slug: string }> };

const getProject = cache((slug: string) =>
  serverApi<Project>(`/public/projects/${encodeURIComponent(slug)}`, {
    notFoundOn404: true,
    revalidate: 0,
  }),
);

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProject(slug);
  const title = project.seoTitle || project.title;
  const description = project.seoDescription || project.shortDescription;
  const canonical = localePath(locale, `/${project.slug}`);
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonical,
      images: project.openGraphImageUrl
        ? [{ url: project.openGraphImageUrl, alt: project.title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: project.openGraphImageUrl
        ? [project.openGraphImageUrl]
        : undefined,
    },
  };
}

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

function ItemList({ items, t }: { items: string[]; t: Dictionary }) {
  return items.length ? (
    <ul className="case-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  ) : (
    <p className="muted">{t.caseStudy.emptySection}</p>
  );
}

export default async function ProjectPage({ params }: PageParams) {
  const { locale, slug } = await params;
  const t = getDictionary(locale);
  const project = await getProject(slug);
  const cover = project.media.find((media) => media.type === "COVER");
  const video = project.media.find((media) => media.type === "VIDEO");
  const poster = project.media.find((media) => media.type === "POSTER");
  const gallery = project.media.filter((media) => media.type === "GALLERY");
  const [beforeStatus, afterStatus] = t.caseStudy.currentStateBody.split(
    "{status}",
  );

  return (
    <article>
      <header className="case-header">
        <div className="shell">
          <Link
            href={localePath(locale, "/projects")}
            className="case-back text-link"
          >
            <ArrowLeft size={17} aria-hidden />
            {t.caseStudy.allProjects}
          </Link>
          <h1>{project.title}</h1>
          <div className="case-intro">
            <p>{project.fullDescription}</p>
            <dl className="case-facts">
              <div>
                <dt>{t.caseStudy.status}</dt>
                <dd>{t.projects.status[project.status]}</dd>
              </div>
              <div>
                <dt>{t.caseStudy.type}</dt>
                <dd>{t.projects.type[project.projectType]}</dd>
              </div>
              <div>
                <dt>{t.caseStudy.role}</dt>
                <dd>{project.role}</dd>
              </div>
            </dl>
          </div>
        </div>
      </header>
      <div className="shell">
        <ProjectMedia
          media={cover}
          title={project.title}
          t={t}
          className="case-media"
          priority
        />
        <CaseSection title={t.caseStudy.problem}>
          <p>{project.problem}</p>
        </CaseSection>
        <CaseSection title={t.caseStudy.context}>
          <p>{project.context}</p>
        </CaseSection>
        <CaseSection title={t.caseStudy.objectives}>
          <ItemList items={project.objectives} t={t} />
        </CaseSection>
        <CaseSection title={t.caseStudy.solution}>
          <p>{project.solution}</p>
        </CaseSection>
        <CaseSection title={t.caseStudy.features}>
          <ItemList items={project.features} t={t} />
        </CaseSection>
        <CaseSection title={t.caseStudy.architecture}>
          <p>{project.architecture}</p>
        </CaseSection>
        <CaseSection title={t.caseStudy.technologies}>
          <p>{project.technologies.join(" · ")}</p>
        </CaseSection>
        <CaseSection title={t.caseStudy.decisions}>
          <ItemList items={project.decisions} t={t} />
        </CaseSection>
        <CaseSection title={t.caseStudy.challenges}>
          <ItemList items={project.challenges} t={t} />
        </CaseSection>
        <CaseSection title={t.caseStudy.learnings}>
          <ItemList items={project.learnings} t={t} />
        </CaseSection>
        <CaseSection title={t.caseStudy.currentState}>
          <p>
            {beforeStatus}
            <strong>
              {t.projects.status[project.status].toLocaleLowerCase(locale)}
            </strong>
            {afterStatus}
          </p>
        </CaseSection>
        <CaseSection title={t.caseStudy.nextSteps}>
          <ItemList items={project.nextSteps} t={t} />
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
        <CaseSection title={t.caseStudy.media}>
          {gallery.length ? (
            <div className="gallery">
              {gallery.map((media) => (
                <figure key={media.id}>
                  <ProjectMedia media={media} title={project.title} t={t} />
                  {media.caption && <figcaption>{media.caption}</figcaption>}
                </figure>
              ))}
            </div>
          ) : (
            <ProjectMedia
              title={project.title}
              t={t}
              className="case-media"
            />
          )}
        </CaseSection>
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
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: project.title,
            description: project.shortDescription,
            applicationCategory:
              project.projectType === "PERSONAL"
                ? "DeveloperApplication"
                : "WebApplication",
          }),
        }}
      />
    </article>
  );
}
