import { AlertCircle, ArrowRight, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { count, publicationStatusLabels } from "~/lib/admin-labels";
import { requireAdmin } from "~/lib/require-admin";
import { serverApi } from "~/lib/server-api";
import type { Dashboard } from "~/types/api";

export const metadata: Metadata = { title: "Dashboard | Administration" };

export default async function AdminDashboardPage() {
  await requireAdmin();
  const dashboard = await serverApi<Dashboard>("/admin/projects/dashboard", {
    authenticated: true,
  });
  const gaps = [
    dashboard.withoutCover > 0 &&
      `${count(dashboard.withoutCover, "project")} without a cover image`,
    dashboard.incomplete > 0 &&
      `${count(dashboard.incomplete, "short description")} still to write`,
  ].filter(Boolean);

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
      {/* Work left to do, not a failure: it reads as a warning rather than an error. */}
      {gaps.length > 0 && (
        <p className="form-warning" role="status">
          <AlertCircle size={17} aria-hidden />
          <span>{gaps.join(". ")}.</span>
        </p>
      )}
      <section className="admin-section">
        <div className="admin-section-head">
          <h2>Recent changes</h2>
          <Link href="/admin/projects" className="text-link">
            All projects <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
        <div className="data-list">
          {dashboard.recent.length === 0 ? (
            <p className="empty-state">
              No project yet. Create the first one to start the portfolio.
            </p>
          ) : (
            <>
              <div className="data-head">
                <span>Project</span>
                <span>Publication</span>
                <span>Order</span>
                <span>Updated</span>
                <span>Actions</span>
              </div>
              {dashboard.recent.map((project) => (
                <div className="data-row" key={project.id}>
                  <div className="data-title">
                    <Link href={`/admin/projects/${project.id}/edit`}>
                      {project.title}
                    </Link>
                    <small>{project.slug}</small>
                  </div>
                  <span data-label="Publication">
                    {publicationStatusLabels[project.publicationStatus]}
                  </span>
                  <span data-label="Order">{project.displayOrder}</span>
                  <time data-label="Updated" dateTime={project.updatedAt}>
                    {new Intl.DateTimeFormat("en-US", {
                      dateStyle: "medium",
                    }).format(new Date(project.updatedAt))}
                  </time>
                  <div className="row-actions" data-label="Actions">
                    <Link
                      className="button button-quiet"
                      href={`/admin/projects/${project.id}/edit`}
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </section>
    </>
  );
}
