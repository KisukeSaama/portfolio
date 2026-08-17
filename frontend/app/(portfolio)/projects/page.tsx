import type { Metadata } from "next";
import { FeaturedProjects, SecondaryProjects } from "~/components/project-list";
import { serverApi } from "~/lib/server-api";
import type { Project } from "~/types/api";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Projets",
  description:
    "Episort, Janus, Overkill et les projets full-stack de Jonathan Blanchard.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const projects = await serverApi<Project[]>("/public/projects", {
    revalidate: 0,
  });
  const primary = projects.filter(
    (project) => project.featureLevel === "PRIMARY",
  );
  const secondary = projects.filter(
    (project) => project.featureLevel === "SECONDARY",
  );
  return (
    <>
      <header className="page-hero">
        <div className="shell">
          <h1>Des applications face à des problèmes concrets.</h1>
          <p>
            Les technologies comptent, mais seulement lorsqu’elles rendent la
            solution plus claire, plus sûre ou plus durable.
          </p>
        </div>
      </header>
      <section className="section">
        <div className="shell">
          <FeaturedProjects projects={primary} />
          <h2 className="section-heading">Autres terrains d’apprentissage</h2>
          <SecondaryProjects projects={secondary} />
        </div>
      </section>
    </>
  );
}
