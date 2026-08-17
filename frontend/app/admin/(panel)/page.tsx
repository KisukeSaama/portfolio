import { AlertCircle, ArrowRight, ImageOff, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "~/lib/require-admin";
import { serverApi } from "~/lib/server-api";
import type { Dashboard } from "~/types/api";

export const metadata: Metadata = { title: "Tableau de bord — Administration" };

export default async function AdminDashboardPage() {
  await requireAdmin();
  const dashboard = await serverApi<Dashboard>("/admin/projects/dashboard", {
    authenticated: true,
  });
  return (
    <>
      <header className="admin-head">
        <div>
          <h1>Tableau de bord</h1>
          <p>État éditorial réel du portfolio.</p>
        </div>
        <Link href="/admin/projects/new" className="button button-primary">
          <Plus size={17} aria-hidden />
          Nouveau projet
        </Link>
      </header>
      <div className="metric-strip" aria-label="Résumé des projets">
        <div className="metric">
          <strong>{dashboard.published}</strong>
          <span>publiés</span>
        </div>
        <div className="metric">
          <strong>{dashboard.drafts}</strong>
          <span>brouillons</span>
        </div>
        <div className="metric">
          <strong>{dashboard.archived}</strong>
          <span>archivés</span>
        </div>
        <div className="metric">
          <strong>{dashboard.withoutCover}</strong>
          <span>sans couverture</span>
        </div>
        <div className="metric">
          <strong>{dashboard.incomplete}</strong>
          <span>à compléter</span>
        </div>
      </div>
      {(dashboard.withoutCover > 0 || dashboard.incomplete > 0) && (
        <div className="form-error" role="status">
          <AlertCircle size={18} aria-hidden />{" "}
          {dashboard.withoutCover > 0 && (
            <span>
              <ImageOff size={16} aria-hidden /> {dashboard.withoutCover}{" "}
              projet(s) sans couverture.
            </span>
          )}{" "}
          {dashboard.incomplete > 0 && (
            <span>{dashboard.incomplete} description(s) courte(s).</span>
          )}
        </div>
      )}
      <section className="admin-section">
        <div className="admin-section-head">
          <h2>Modifications récentes</h2>
          <Link href="/admin/projects" className="text-link">
            Tous les projets <ArrowRight size={16} aria-hidden />
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
              <span data-label="État">{project.publicationStatus}</span>
              <span data-label="Ordre">{project.displayOrder}</span>
              <time data-label="Modifié" dateTime={project.updatedAt}>
                {new Intl.DateTimeFormat("fr-FR", {
                  dateStyle: "medium",
                }).format(new Date(project.updatedAt))}
              </time>
              <Link
                className="button button-quiet"
                href={`/admin/projects/${project.id}/edit`}
              >
                Modifier
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
