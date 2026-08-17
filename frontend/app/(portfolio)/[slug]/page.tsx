import { ArrowLeft, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { cache, type ReactNode } from "react";
import { ProjectMedia } from "~/components/project-media";
import { serverApi } from "~/lib/server-api";
import type { Project, ProjectStatus } from "~/types/api";

export const dynamic = "force-dynamic";

const status: Record<ProjectStatus, string> = {
  CONCEPT: "Conception",
  IN_PROGRESS: "En développement",
  MAINTAINED: "Maintenu",
  COMPLETED: "Réalisé",
};

const getProject = cache((slug: string) =>
  serverApi<Project>(`/public/projects/${encodeURIComponent(slug)}`, {
    notFoundOn404: true,
    revalidate: 0,
  }),
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  const title = project.seoTitle || project.title;
  const description = project.seoDescription || project.shortDescription;
  return {
    title,
    description,
    alternates: { canonical: `/${project.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/${project.slug}`,
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

function ItemList({ items }: { items: string[] }) {
  return items.length ? (
    <ul className="case-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  ) : (
    <p className="muted">Cette partie sera complétée au fil du projet.</p>
  );
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  const cover = project.media.find((media) => media.type === "COVER");
  const video = project.media.find((media) => media.type === "VIDEO");
  const poster = project.media.find((media) => media.type === "POSTER");
  const gallery = project.media.filter((media) => media.type === "GALLERY");

  return (
    <article>
      <header className="case-header">
        <div className="shell">
          <Link href="/projects" className="case-back text-link">
            <ArrowLeft size={17} aria-hidden />
            Tous les projets
          </Link>
          <h1>{project.title}</h1>
          <div className="case-intro">
            <p>{project.fullDescription}</p>
            <dl className="case-facts">
              <div>
                <dt>Statut</dt>
                <dd>{status[project.status]}</dd>
              </div>
              <div>
                <dt>Type</dt>
                <dd>
                  {project.projectType === "TEAM"
                    ? "Projet d’équipe"
                    : project.projectType === "LEARNING"
                      ? "Apprentissage"
                      : "Projet personnel"}
                </dd>
              </div>
              <div>
                <dt>Rôle</dt>
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
          className="case-media"
          priority
        />
        <CaseSection title="Le problème initial">
          <p>{project.problem}</p>
        </CaseSection>
        <CaseSection title="Contexte">
          <p>{project.context}</p>
        </CaseSection>
        <CaseSection title="Objectifs">
          <ItemList items={project.objectives} />
        </CaseSection>
        <CaseSection title="Solution imaginée">
          <p>{project.solution}</p>
        </CaseSection>
        <CaseSection title="Fonctionnalités">
          <ItemList items={project.features} />
        </CaseSection>
        <CaseSection title="Architecture">
          <p>{project.architecture}</p>
        </CaseSection>
        <CaseSection title="Technologies">
          <p>{project.technologies.join(" · ")}</p>
        </CaseSection>
        <CaseSection title="Choix importants">
          <ItemList items={project.decisions} />
        </CaseSection>
        <CaseSection title="Difficultés">
          <ItemList items={project.challenges} />
        </CaseSection>
        <CaseSection title="Apprentissages">
          <ItemList items={project.learnings} />
        </CaseSection>
        <CaseSection title="État actuel">
          <p>
            Le projet est actuellement :{" "}
            <strong>{status[project.status].toLowerCase()}</strong>. Cette
            formulation reflète son état renseigné dans l’administration.
          </p>
        </CaseSection>
        <CaseSection title="Prochaines étapes">
          <ItemList items={project.nextSteps} />
        </CaseSection>
        {video && (
          <CaseSection title="Démonstration">
            <ProjectMedia
              media={video}
              title={project.title}
              className="case-media"
              poster={poster?.url}
            />
          </CaseSection>
        )}
        <CaseSection title="Médias">
          {gallery.length ? (
            <div className="gallery">
              {gallery.map((media) => (
                <figure key={media.id}>
                  <ProjectMedia media={media} title={project.title} />
                  {media.caption && <figcaption>{media.caption}</figcaption>}
                </figure>
              ))}
            </div>
          ) : (
            <ProjectMedia title={project.title} className="case-media" />
          )}
        </CaseSection>
        {(project.githubUrl || project.demoUrl) && (
          <CaseSection title="Liens">
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
                  Démonstration <ExternalLink size={16} aria-hidden />
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
