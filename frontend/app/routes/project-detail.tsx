import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { ProjectMedia } from "~/components/project-media";
import { apiLoader } from "~/lib/api";
import type { Project, ProjectStatus } from "~/types/api";

const status: Record<ProjectStatus, string> = {
  CONCEPT: "Conception",
  IN_PROGRESS: "En développement",
  MAINTAINED: "Maintenu",
  COMPLETED: "Réalisé",
};
export async function loader({ request, params }: LoaderFunctionArgs) {
  return {
    project: await apiLoader<Project>(
      request,
      `/public/projects/${params.slug ?? ""}`,
    ),
  };
}
export const meta: MetaFunction<typeof loader> = ({ loaderData }) => {
  const p = loaderData?.project;
  return p
    ? [
        { title: p.seoTitle || `${p.title} — Jonathan Blanchard` },
        {
          name: "description",
          content: p.seoDescription || p.shortDescription,
        },
        { property: "og:title", content: p.seoTitle || p.title },
        {
          property: "og:description",
          content: p.seoDescription || p.shortDescription,
        },
        { property: "og:type", content: "article" },
        { tagName: "link", rel: "canonical", href: `/projects/${p.slug}` },
        ...(p.openGraphImageUrl
          ? [{ property: "og:image", content: p.openGraphImageUrl }]
          : []),
      ]
    : [{ title: "Projet introuvable" }];
};
function CaseSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="case-section">
      <h2>{title}</h2>
      <div className="case-content">{children}</div>
    </section>
  );
}
function List({ items }: { items: string[] }) {
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
export default function ProjectDetail({
  loaderData,
}: {
  loaderData: { project: Project };
}) {
  const p = loaderData.project;
  const cover = p.media.find((m) => m.type === "COVER");
  const video = p.media.find((m) => m.type === "VIDEO");
  const poster = p.media.find((m) => m.type === "POSTER");
  const gallery = p.media.filter((m) => m.type === "GALLERY");
  return (
    <article>
      <header className="case-header">
        <div className="shell">
          <Link to="/projects" className="case-back text-link">
            <ArrowLeft size={17} aria-hidden />
            Tous les projets
          </Link>
          <h1>{p.title}</h1>
          <div className="case-intro">
            <p>{p.fullDescription}</p>
            <dl className="case-facts">
              <div>
                <dt>Statut</dt>
                <dd>{status[p.status]}</dd>
              </div>
              <div>
                <dt>Type</dt>
                <dd>
                  {p.projectType === "TEAM"
                    ? "Projet d’équipe"
                    : p.projectType === "LEARNING"
                      ? "Apprentissage"
                      : "Projet personnel"}
                </dd>
              </div>
              <div>
                <dt>Rôle</dt>
                <dd>{p.role}</dd>
              </div>
            </dl>
          </div>
        </div>
      </header>
      <div className="shell">
        <ProjectMedia
          media={cover}
          title={p.title}
          className="case-media"
          priority
        />
        <CaseSection title="Le problème initial">
          <p>{p.problem}</p>
        </CaseSection>
        <CaseSection title="Contexte">
          <p>{p.context}</p>
        </CaseSection>
        <CaseSection title="Objectifs">
          <List items={p.objectives} />
        </CaseSection>
        <CaseSection title="Solution imaginée">
          <p>{p.solution}</p>
        </CaseSection>
        <CaseSection title="Fonctionnalités">
          <List items={p.features} />
        </CaseSection>
        <CaseSection title="Architecture">
          <p>{p.architecture}</p>
        </CaseSection>
        <CaseSection title="Technologies">
          <p>{p.technologies.join(" · ")}</p>
        </CaseSection>
        <CaseSection title="Choix importants">
          <List items={p.decisions} />
        </CaseSection>
        <CaseSection title="Difficultés">
          <List items={p.challenges} />
        </CaseSection>
        <CaseSection title="Apprentissages">
          <List items={p.learnings} />
        </CaseSection>
        <CaseSection title="État actuel">
          <p>
            Le projet est actuellement :{" "}
            <strong>{status[p.status].toLowerCase()}</strong>. Cette formulation
            reflète son état renseigné dans l’administration.
          </p>
        </CaseSection>
        <CaseSection title="Prochaines étapes">
          <List items={p.nextSteps} />
        </CaseSection>
        {video && (
          <CaseSection title="Démonstration">
            <ProjectMedia
              media={video}
              title={p.title}
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
                  <ProjectMedia media={media} title={p.title} />
                  {media.caption && <figcaption>{media.caption}</figcaption>}
                </figure>
              ))}
            </div>
          ) : (
            <ProjectMedia title={p.title} className="case-media" />
          )}
        </CaseSection>
        {(p.githubUrl || p.demoUrl) && (
          <CaseSection title="Liens">
            <div className="project-actions">
              {p.githubUrl && (
                <a
                  className="button button-secondary"
                  href={p.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub <ExternalLink size={16} aria-hidden />
                </a>
              )}
              {p.demoUrl && (
                <a
                  className="button button-primary"
                  href={p.demoUrl}
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
            name: p.title,
            description: p.shortDescription,
            applicationCategory:
              p.projectType === "PERSONAL"
                ? "DeveloperApplication"
                : "WebApplication",
          }),
        }}
      />
    </article>
  );
}
