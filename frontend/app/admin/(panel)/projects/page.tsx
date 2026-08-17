import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminProjectList } from "~/components/admin-project-list";
import { requireAdmin } from "~/lib/require-admin";
import { serverApi } from "~/lib/server-api";
import type { Page, Project } from "~/types/api";

export const metadata: Metadata = { title: "Projets — Administration" };

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; status?: string }>;
}) {
  const { query = "", status = "" } = await searchParams;
  await requireAdmin();
  const data = await serverApi<Page<Project>>(
    `/admin/projects?size=100&query=${encodeURIComponent(query)}${status ? `&status=${encodeURIComponent(status)}` : ""}`,
    { authenticated: true },
  );
  return (
    <>
      <header className="admin-head">
        <div>
          <h1>Projets</h1>
          <p>
            {data.totalElements} projet(s), tous états éditoriaux confondus.
          </p>
        </div>
        <Link href="/admin/projects/new" className="button button-primary">
          <Plus size={17} aria-hidden />
          Nouveau projet
        </Link>
      </header>
      <form className="filters" method="get">
        <div className="field">
          <label htmlFor="query">Rechercher</label>
          <input
            className="input"
            id="query"
            name="query"
            type="search"
            placeholder="Titre ou slug"
            defaultValue={query}
          />
        </div>
        <div className="field">
          <label htmlFor="status">État éditorial</label>
          <select
            className="select"
            id="status"
            name="status"
            defaultValue={status}
          >
            <option value="">Tous</option>
            <option value="PUBLISHED">Publiés</option>
            <option value="DRAFT">Brouillons</option>
            <option value="ARCHIVED">Archivés</option>
          </select>
        </div>
        <button className="button button-secondary">Filtrer</button>
      </form>
      <AdminProjectList projects={data.content} />
    </>
  );
}
