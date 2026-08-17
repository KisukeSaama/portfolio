import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminProjectList } from "~/components/admin-project-list";
import { count } from "~/lib/admin-labels";
import { requireAdmin } from "~/lib/require-admin";
import { serverApi } from "~/lib/server-api";
import type { Page, Project } from "~/types/api";

export const metadata: Metadata = { title: "Projects | Administration" };

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
          <h1>Projects</h1>
          <p>
            {count(data.totalElements, "project")}, across every editorial
            state.
          </p>
        </div>
        <Link href="/admin/projects/new" className="button button-primary">
          <Plus size={17} aria-hidden />
          New project
        </Link>
      </header>
      <form className="filters" method="get">
        <div className="field">
          <label htmlFor="query">Search</label>
          <input
            className="input"
            id="query"
            name="query"
            type="search"
            placeholder="Title or slug"
            defaultValue={query}
          />
        </div>
        <div className="field">
          <label htmlFor="status">Editorial state</label>
          <select
            className="select"
            id="status"
            name="status"
            defaultValue={status}
          >
            <option value="">All</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Drafts</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
        <button className="button button-secondary">Filter</button>
      </form>
      <AdminProjectList projects={data.content} />
    </>
  );
}
