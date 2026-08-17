import type { Metadata } from "next";
import { ProjectEditor } from "~/components/project-editor";

export const metadata: Metadata = { title: "Nouveau projet — Administration" };
export default function NewProjectPage() {
  return (
    <>
      <header className="admin-head">
        <div>
          <h1>Nouveau projet</h1>
          <p>Le projet est créé comme brouillon privé.</p>
        </div>
      </header>
      <ProjectEditor />
    </>
  );
}
