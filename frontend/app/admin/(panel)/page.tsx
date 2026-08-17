import { AlertCircle, ArrowRight, ImageOff, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "~/lib/require-admin";
import { serverApi } from "~/lib/server-api";
import type { Dashboard } from "~/types/api";

export const metadata: Metadata = { title: "Dashboard — Administration" };

export default async function AdminDashboardPage() {
  await requireAdmin();
  const dashboard = await serverApi<Dashboard>("/admin/projects/dashboard", {
    authenticated: true,
  });
  return (
    <>
      <header className="admin-head">
        <div>
          <h1>Dashboard</h1>
          <p>The portfolio&apos;s actual editorial state.</p>
        </div>
        <Link href="/admin/projects/new" className="button button-primary">
          <Plus size={17} aria-hidden />
          New project
        </Link>
      </header>
      <div className="metric-strip" aria-label="Project summary">
        <div className="metric">
          <strong>{dashboard.published}</strong>
          <span>published</span>
        </div>
        <div className="metric">
          <strong>{dashboard.drafts}</strong>
          <span>drafts</span>
        </div>
        <div className="metric">
          <strong>{dashboard.archived}</strong>
          <span>archived</span>
        </div>
        <div className="metric">
          <strong>{dashboard.withoutCover}</strong>
          <span>without a cover</span>
        </div>
        <div className="metric">
          <strong>{dashboard.incomplete}</strong>
          <span>to complete</span>
        </div>
      </div>
      {(dashboard.withoutCover > 0 || dashboard.incomplete > 0) && (
        <div className="form-error" role="status">
          <AlertCircle size={18} aria-hidden />{" "}
          {dashboard.withoutCover > 0 && (
            <span>
              <ImageOff size={16} aria-hidden /> {dashboard.withoutCover}{" "}
              project(s) without a cover.
            </span>
          )}{" "}
          {dashboard.incomplete > 0 && (
            <span>{dashboard.incomplete} short description(s).</span>
          )}
        </div>
      )}
      <section className="admin-section">
        <div className="admin-section-head">
          <h2>Recent changes</h2>
          <Link href="/admin/projects" className="text-link">
            All projects <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
        <div className="data-list">
          {dashboard.recent.map((project) => (
            <div className="data-row" key={project.id}>
              <div className="data-title">
                <Link href={`/admin/projects/${project.id}/edit`}>
                  {project.title}
                </Link>
                <small>{project.slug}</small>
              </div>
              <span data-label="State">{project.publicationStatus}</span>
              <span data-label="Order">{project.displayOrder}</span>
              <time data-label="Updated" dateTime={project.updatedAt}>
                {new Intl.DateTimeFormat("en-US", {
                  dateStyle: "medium",
                }).format(new Date(project.updatedAt))}
              </time>
              <Link
                className="button button-quiet"
                href={`/admin/projects/${project.id}/edit`}
              >
                Edit
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
