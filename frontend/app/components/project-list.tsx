import { ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { Project, ProjectStatus } from "~/types/api";
import { ProjectMedia } from "./project-media";

const status: Record<ProjectStatus, string> = {
  CONCEPT: "Conception",
  IN_PROGRESS: "En développement",
  MAINTAINED: "Maintenu",
  COMPLETED: "Réalisé",
};
export function FeaturedProjects({ projects }: { projects: Project[] }) {
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
                  Statut : {status[project.status]}
                </span>
                {project.technologies.slice(0, 4).map((item) => (
                  <span className="tag" key={item}>
                    {item}
                  </span>
                ))}
              </div>
              <p className="muted">
                <strong>Rôle :</strong> {project.role}
              </p>
              <div className="project-actions">
                <Link href={`/${project.slug}`} className="text-link">
                  Lire l’étude de cas <ArrowRight size={17} aria-hidden />
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
                    Démonstration <ExternalLink size={15} aria-hidden />
                  </a>
                )}
              </div>
            </div>
            <ProjectMedia
              media={cover}
              title={project.title}
              priority={index === 0}
            />
          </article>
        );
      })}
    </div>
  );
}
export function SecondaryProjects({ projects }: { projects: Project[] }) {
  return (
    <div className="secondary-projects">
      {projects.map((project) => (
        <article className="secondary-project" key={project.id}>
          <h3>{project.title}</h3>
          <p>
            {project.shortDescription}{" "}
            <strong>
              {project.projectType === "TEAM"
                ? "Projet d’équipe."
                : project.projectType === "LEARNING"
                  ? "Projet d’apprentissage."
                  : ""}
            </strong>
          </p>
          <Link
            href={`/${project.slug}`}
            className="text-link"
            aria-label={`Voir l’étude de cas ${project.title}`}
          >
            Découvrir <ArrowRight size={16} aria-hidden />
          </Link>
        </article>
      ))}
    </div>
  );
}
