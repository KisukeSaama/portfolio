import type { Metadata } from "next";
import { ProjectEditor } from "~/components/project-editor";

export const metadata: Metadata = { title: "New project — Administration" };
export default function NewProjectPage() {
  return (
    <>
      <header className="admin-head">
        <div>
          <h1>New project</h1>
          <p>The project is created as a private draft.</p>
        </div>
      </header>
      <ProjectEditor />
    </>
  );
}
