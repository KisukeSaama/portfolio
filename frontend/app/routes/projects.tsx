import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { FeaturedProjects, SecondaryProjects } from "~/components/project-list";
import { apiLoader } from "~/lib/api";
import type { Project } from "~/types/api";
export const meta: MetaFunction = () => [
  { title: "Projets — Jonathan Blanchard" },
  {
    name: "description",
    content:
      "Episort, Janus, Overkill et les projets full-stack de Jonathan Blanchard.",
  },
  { tagName: "link", rel: "canonical", href: "/projects" },
];
export async function loader({ request }: LoaderFunctionArgs) {
  return { projects: await apiLoader<Project[]>(request, "/public/projects") };
}
export default function Projects({
  loaderData,
}: {
  loaderData: { projects: Project[] };
}) {
  const primary = loaderData.projects.filter(
    (p) => p.featureLevel === "PRIMARY",
  );
  const secondary = loaderData.projects.filter(
    (p) => p.featureLevel === "SECONDARY",
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
