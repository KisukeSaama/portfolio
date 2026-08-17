import type { Metadata } from "next";
import { auditActionLabels } from "~/lib/admin-labels";
import { requireAdmin } from "~/lib/require-admin";
import { serverApi } from "~/lib/server-api";
import type { AuditEntry, Page } from "~/types/api";

export const metadata: Metadata = { title: "Administration log" };

export default async function AdminAuditPage() {
  await requireAdmin();
  const data = await serverApi<Page<AuditEntry>>("/admin/audit?size=50", {
    authenticated: true,
  });
  return (
    <>
      <header className="admin-head">
        <div>
          <h1>Administration log</h1>
          <p>
            Sensitive actions, with no passwords, cookies, tokens or secrets.
          </p>
        </div>
      </header>
      <ul className="audit-list">
        {data.content.length === 0 ? (
          <li className="empty-state">No action recorded.</li>
        ) : (
          data.content.map((entry) => (
            <li key={entry.id}>
              <strong>{auditActionLabels[entry.action] ?? entry.action}</strong>
              <span>{entry.projectTitle ?? entry.actorEmail ?? "System"}</span>
              <time dateTime={entry.createdAt}>
                {new Intl.DateTimeFormat("en-US", {
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
