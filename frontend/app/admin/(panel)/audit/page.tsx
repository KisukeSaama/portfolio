import type { Metadata } from "next";
import { requireAdmin } from "~/lib/require-admin";
import { serverApi } from "~/lib/server-api";
import type { AuditEntry, Page } from "~/types/api";

export const metadata: Metadata = { title: "Journal d’administration" };
const labels: Record<string, string> = {
  LOGIN_SUCCESS: "Connexion réussie",
  LOGIN_FAILURE: "Connexion refusée",
  LOGOUT: "Déconnexion",
  PROJECT_CREATE: "Projet créé",
  PROJECT_UPDATE: "Projet modifié",
  PROJECT_DUPLICATE: "Projet dupliqué",
  PROJECT_PUBLISH: "Projet publié",
  PROJECT_UNPUBLISH: "Projet dépublié",
  PROJECT_ARCHIVE: "Projet archivé",
  PROJECT_RESTORE: "Projet restauré",
  PROJECT_DELETE: "Projet supprimé",
  PROJECT_REORDER: "Ordre modifié",
  PROJECT_SLUG_CHANGE: "Slug modifié",
  MEDIA_ADD: "Média ajouté",
  MEDIA_DELETE: "Média supprimé",
};

export default async function AdminAuditPage() {
  await requireAdmin();
  const data = await serverApi<Page<AuditEntry>>("/admin/audit?size=50", {
    authenticated: true,
  });
  return (
    <>
      <header className="admin-head">
        <div>
          <h1>Journal d’administration</h1>
          <p>
            Actions sensibles, sans mots de passe, cookies, tokens ni secrets.
          </p>
        </div>
      </header>
      <ul className="audit-list">
        {data.content.length === 0 ? (
          <li className="empty-state">Aucune action enregistrée.</li>
        ) : (
          data.content.map((entry) => (
            <li key={entry.id}>
              <strong>{labels[entry.action] ?? entry.action}</strong>
              <span>{entry.projectTitle ?? entry.actorEmail ?? "Système"}</span>
              <time dateTime={entry.createdAt}>
                {new Intl.DateTimeFormat("fr-FR", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(entry.createdAt))}
              </time>
            </li>
          ))
        )}
      </ul>
    </>
  );
}
