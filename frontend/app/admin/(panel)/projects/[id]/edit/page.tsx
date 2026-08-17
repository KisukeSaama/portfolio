import type { Metadata } from "next";
import { ProjectEditor } from "~/components/project-editor";
import { requireAdmin } from "~/lib/require-admin";
import { serverApi } from "~/lib/server-api";
import type { Project } from "~/types/api";

export const metadata: Metadata = {
  title: "Edit a project — Administration",
};
export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireAdmin();
  const project = await serverApi<Project>(
    `/admin/projects/${encodeURIComponent(id)}`,
    { authenticated: true, notFoundOn404: true },
  );
  return (
    <>
      <header className="admin-head">
        <div>
          <h1>Edit {project.title}</h1>
          <p>
            Last change:{" "}
            {new Intl.DateTimeFormat("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(new Date(project.updatedAt))}
          </p>
        </div>
      </header>
      <ProjectEditor project={project} />
    </>
  );
}
