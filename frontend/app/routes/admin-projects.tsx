import {
  Archive,
  ArrowDown,
  ArrowUp,
  Copy,
  Eye,
  Plus,
  RotateCcw,
  Send,
  Trash2,
  Undo2,
} from "lucide-react";
import { Form, Link, useNavigate, useRevalidator } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useState } from "react";
import { ApiRequestError, apiLoader, apiMutation } from "~/lib/api";
import type { Page, Project } from "~/types/api";

export const meta: MetaFunction = () => [
  { title: "Projets — Administration" },
  { name: "robots", content: "noindex,nofollow" },
];
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query") ?? "";
  const status = url.searchParams.get("status") ?? "";
  return apiLoader<Page<Project>>(
    request,
    `/admin/projects?size=100&query=${encodeURIComponent(query)}${status ? `&status=${status}` : ""}`,
  );
}

export default function AdminProjects({
  loaderData,
}: {
  loaderData: Page<Project>;
}) {
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const projects = loaderData.content;
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<
    { type: "success" | "error"; message: string } | undefined
  >();

  async function perform(
    projectId: string,
    task: () => Promise<void>,
    successMessage?: string,
  ) {
    setPendingId(projectId);
    setFeedback(undefined);
    try {
      await task();
      if (successMessage)
        setFeedback({ type: "success", message: successMessage });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof ApiRequestError
            ? error.payload.message
            : "L’action n’a pas pu être effectuée. Réessayez.",
      });
    } finally {
      setPendingId(null);
    }
  }
  async function lifecycle(
    project: Project,
    action: "publish" | "unpublish" | "archive" | "restore",
  ) {
    if (
      (action === "archive" || action === "unpublish") &&
      !window.confirm(
        `${action === "archive" ? "Archiver" : "Dépublier"} « ${project.title} » ?`,
      )
    )
      return;
    await perform(
      project.id,
      async () => {
        await apiMutation(`/admin/projects/${project.id}/${action}`, {
          method: "POST",
        });
        await revalidator.revalidate();
      },
      "L’état éditorial a été mis à jour.",
    );
  }
  async function duplicate(project: Project) {
    await perform(project.id, async () => {
      const copy = await apiMutation<Project>(
        `/admin/projects/${project.id}/duplicate`,
        { method: "POST" },
      );
      await navigate(`/admin/projects/${copy.id}/edit`);
    });
  }
  async function remove(project: Project) {
    const value = window.prompt(
      `Suppression définitive. Saisissez exactement : ${project.title}`,
    );
    if (value !== project.title) return;
    await perform(
      project.id,
      async () => {
      await apiMutation(`/admin/projects/${project.id}`, {
        method: "DELETE",
        headers: { "X-Confirm-Project-Title": value },
      });
      await revalidator.revalidate();
      },
      "Le projet a été supprimé définitivement.",
    );
  }
  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= projects.length) return;
    const ids = projects.map((p) => p.id);
    [ids[index], ids[target]] = [ids[target]!, ids[index]!];
    await perform(
      projects[index]!.id,
      async () => {
        await apiMutation("/admin/projects/reorder", {
          method: "PUT",
          body: JSON.stringify({ projectIds: ids }),
        });
        await revalidator.revalidate();
      },
      "L’ordre d’affichage a été enregistré.",
    );
  }
  return (
    <>
      <header className="admin-head">
        <div>
          <h1>Projets</h1>
          <p>
            {loaderData.totalElements} projet(s), tous états éditoriaux
            confondus.
          </p>
        </div>
        <Link to="/admin/projects/new" className="button button-primary">
          <Plus size={17} aria-hidden />
          Nouveau projet
        </Link>
      </header>
      {feedback && (
        <p
          className={feedback.type === "error" ? "form-error" : "form-success"}
          role={feedback.type === "error" ? "alert" : "status"}
        >
          {feedback.message}
        </p>
      )}
      <Form className="filters" method="get">
        <div className="field">
          <label htmlFor="query">Rechercher</label>
          <input
            className="input"
            id="query"
            name="query"
            type="search"
            placeholder="Titre ou slug"
          />
        </div>
        <div className="field">
          <label htmlFor="status">État éditorial</label>
          <select className="select" id="status" name="status" defaultValue="">
            <option value="">Tous</option>
            <option value="PUBLISHED">Publiés</option>
            <option value="DRAFT">Brouillons</option>
            <option value="ARCHIVED">Archivés</option>
          </select>
        </div>
        <button className="button button-secondary">Filtrer</button>
      </Form>
      <div className="data-list" aria-busy={pendingId !== null}>
        <div className="data-head">
          <span>Projet</span>
          <span>Publication</span>
          <span>Ordre</span>
          <span>Modifié</span>
          <span>Actions</span>
        </div>
        {projects.length === 0 ? (
          <p className="empty-state">
            Aucun projet ne correspond à ces filtres.
          </p>
        ) : (
          projects.map((project, index) => (
            <div className="data-row" key={project.id}>
              <div className="data-title">
                <Link to={`/admin/projects/${project.id}/edit`}>
                  {project.title}
                </Link>
                <small>
                  {project.slug} ·{" "}
                  {project.featureLevel === "PRIMARY"
                    ? "Principal"
                    : "Secondaire"}
                </small>
              </div>
              <span data-label="Publication" className="tag status">
                {project.publicationStatus}
              </span>
              <span data-label="Ordre">{project.displayOrder}</span>
              <time data-label="Modifié" dateTime={project.updatedAt}>
                {new Intl.DateTimeFormat("fr-FR", {
                  dateStyle: "short",
                }).format(new Date(project.updatedAt))}
              </time>
              <div className="row-actions" data-label="Actions">
                <button
                  className="button button-quiet"
                  type="button"
                  onClick={() => void move(index, -1)}
                  disabled={index === 0 || pendingId !== null}
                  aria-label={`Remonter ${project.title}`}
                >
                  <ArrowUp size={16} aria-hidden />
                </button>
                <button
                  className="button button-quiet"
                  type="button"
                  onClick={() => void move(index, 1)}
                  disabled={index === projects.length - 1 || pendingId !== null}
                  aria-label={`Descendre ${project.title}`}
                >
                  <ArrowDown size={16} aria-hidden />
                </button>
                <Link
                  className="button button-quiet"
                  to={`/admin/projects/${project.id}/preview`}
                  target="_blank"
                  aria-label={`Prévisualiser ${project.title}`}
                >
                  <Eye size={16} aria-hidden />
                </Link>
                <button
                  className="button button-quiet"
                  type="button"
                  onClick={() => void duplicate(project)}
                  disabled={pendingId !== null}
                  aria-label={`Dupliquer ${project.title}`}
                >
                  <Copy size={16} aria-hidden />
                </button>
                {project.publicationStatus === "DRAFT" && (
                  <button
                    className="button button-quiet"
                    type="button"
                    onClick={() => void lifecycle(project, "publish")}
                    disabled={pendingId !== null}
                    title="Publier"
                    aria-label={`Publier ${project.title}`}
                  >
                    <Send size={16} aria-hidden />
                  </button>
                )}
                {project.publicationStatus === "PUBLISHED" && (
                  <>
                    <button
                      className="button button-quiet"
                      type="button"
                      onClick={() => void lifecycle(project, "unpublish")}
                      disabled={pendingId !== null}
                      title="Dépublier"
                      aria-label={`Dépublier ${project.title}`}
                    >
                      <Undo2 size={16} aria-hidden />
                    </button>
                    <button
                      className="button button-quiet"
                      type="button"
                      onClick={() => void lifecycle(project, "archive")}
                      disabled={pendingId !== null}
                      title="Archiver"
                      aria-label={`Archiver ${project.title}`}
                    >
                      <Archive size={16} aria-hidden />
                    </button>
                  </>
                )}
                {project.publicationStatus === "ARCHIVED" && (
                  <>
                    <button
                      className="button button-quiet"
                      type="button"
                      onClick={() => void lifecycle(project, "restore")}
                      disabled={pendingId !== null}
                      title="Restaurer"
                      aria-label={`Restaurer ${project.title}`}
                    >
                      <RotateCcw size={16} aria-hidden />
                    </button>
                    <button
                      className="button button-quiet"
                      type="button"
                      onClick={() => void remove(project)}
                      disabled={pendingId !== null}
                      title="Supprimer définitivement"
                      aria-label={`Supprimer définitivement ${project.title}`}
                    >
                      <Trash2 size={16} aria-hidden />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
