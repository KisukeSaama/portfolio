"use client";

import {
  Archive,
  ArrowDown,
  ArrowUp,
  Copy,
  Eye,
  RotateCcw,
  Send,
  Trash2,
  Undo2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApiRequestError, apiMutation } from "~/lib/api";
import { publicationStatusLabels } from "~/lib/admin-labels";
import type { Project } from "~/types/api";
import { ConfirmDialog, type ConfirmRequest } from "./confirm-dialog";

type Pending = { request: ConfirmRequest; run: () => Promise<void> };

export function AdminProjectList({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<Pending>();
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  }>();

  async function perform(
    projectId: string,
    task: () => Promise<void>,
    message?: string,
  ) {
    setPendingId(projectId);
    setFeedback(undefined);
    try {
      await task();
      if (message) setFeedback({ type: "success", message });
      router.refresh();
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof ApiRequestError
            ? error.payload.message
            : "The action could not be completed. Try again.",
      });
    } finally {
      setPendingId(null);
    }
  }

  function lifecycle(
    project: Project,
    action: "publish" | "unpublish" | "archive" | "restore",
  ) {
    const apply = () =>
      perform(
        project.id,
        () =>
          apiMutation(`/admin/projects/${project.id}/${action}`, {
            method: "POST",
          }),
        "The editorial state has been updated.",
      );

    // Publishing and restoring add visibility; the two that remove it are confirmed first.
    if (action === "archive" || action === "unpublish") {
      setConfirmation({
        request:
          action === "archive"
            ? {
                title: `Archive “${project.title}”?`,
                body: "The case study leaves the public site. You can restore it from the Archived filter.",
                confirmLabel: "Archive the project",
              }
            : {
                title: `Unpublish “${project.title}”?`,
                body: "The case study leaves the public site and returns to draft.",
                confirmLabel: "Unpublish the project",
              },
        run: apply,
      });
      return;
    }
    void apply();
  }

  async function duplicate(project: Project) {
    await perform(project.id, async () => {
      const copy = await apiMutation<Project>(
        `/admin/projects/${project.id}/duplicate`,
        { method: "POST" },
      );
      router.push(`/admin/projects/${copy.id}/edit`);
    });
  }

  function remove(project: Project) {
    setConfirmation({
      request: {
        title: "Delete this project permanently?",
        body: `“${project.title}”, its case study and its media are removed for good. This cannot be undone.`,
        confirmLabel: "Delete permanently",
        danger: true,
        requireText: project.title,
        requireTextLabel: `Type ${project.title} to confirm`,
      },
      run: () =>
        perform(
          project.id,
          () =>
            apiMutation(`/admin/projects/${project.id}`, {
              method: "DELETE",
              headers: { "X-Confirm-Project-Title": project.title },
            }),
          "The project has been permanently deleted.",
        ),
    });
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= projects.length) return;
    const projectIds = projects.map((project) => project.id);
    [projectIds[index], projectIds[target]] = [
      projectIds[target]!,
      projectIds[index]!,
    ];
    await perform(
      projects[index]!.id,
      () =>
        apiMutation("/admin/projects/reorder", {
          method: "PUT",
          body: JSON.stringify({ projectIds }),
        }),
      "The display order has been saved.",
    );
  }

  const busy = pendingId !== null;

  return (
    <>
      {feedback && (
        <p
          className={feedback.type === "error" ? "form-error" : "form-success"}
          role={feedback.type === "error" ? "alert" : "status"}
        >
          {feedback.message}
        </p>
      )}
      <div className="data-list" aria-busy={busy}>
        {projects.length === 0 ? (
          <p className="empty-state">
            No project matches these filters. Clear the search, or pick another
            editorial state.
          </p>
        ) : (
          <>
            {/* The header row is part of the table, so it only makes sense with rows under it. */}
            <div className="data-head">
              <span>Project</span>
              <span>Publication</span>
              <span>Order</span>
              <span>Updated</span>
              <span>Actions</span>
            </div>
            {projects.map((project, index) => (
              <div className="data-row" key={project.id}>
                <div className="data-title">
                  <Link href={`/admin/projects/${project.id}/edit`}>
                    {project.title}
                  </Link>
                  <small>
                    {project.slug} ·{" "}
                    {project.featureLevel === "PRIMARY"
                      ? "Primary"
                      : "Secondary"}
                  </small>
                </div>
                <span data-label="Publication">
                  {publicationStatusLabels[project.publicationStatus]}
                </span>
                <span data-label="Order">{project.displayOrder}</span>
                <time data-label="Updated" dateTime={project.updatedAt}>
                  {new Intl.DateTimeFormat("en-US", {
                    dateStyle: "short",
                  }).format(new Date(project.updatedAt))}
                </time>
                <div className="row-actions" data-label="Actions">
                  <button
                    className="button button-quiet"
                    type="button"
                    onClick={() => void move(index, -1)}
                    disabled={index === 0 || busy}
                    title="Move up"
                    aria-label={`Move ${project.title} up`}
                  >
                    <ArrowUp size={16} aria-hidden />
                  </button>
                  <button
                    className="button button-quiet"
                    type="button"
                    onClick={() => void move(index, 1)}
                    disabled={index === projects.length - 1 || busy}
                    title="Move down"
                    aria-label={`Move ${project.title} down`}
                  >
                    <ArrowDown size={16} aria-hidden />
                  </button>
                  <Link
                    className="button button-quiet"
                    href={`/admin/projects/${project.id}/preview`}
                    target="_blank"
                    title="Preview"
                    aria-label={`Preview ${project.title}`}
                  >
                    <Eye size={16} aria-hidden />
                  </Link>
                  <button
                    className="button button-quiet"
                    type="button"
                    onClick={() => void duplicate(project)}
                    disabled={busy}
                    title="Duplicate"
                    aria-label={`Duplicate ${project.title}`}
                  >
                    <Copy size={16} aria-hidden />
                  </button>
                  {project.publicationStatus === "DRAFT" && (
                    <button
                      className="button button-quiet"
                      type="button"
                      onClick={() => lifecycle(project, "publish")}
                      disabled={busy}
                      title="Publish"
                      aria-label={`Publish ${project.title}`}
                    >
                      <Send size={16} aria-hidden />
                    </button>
                  )}
                  {project.publicationStatus === "PUBLISHED" && (
                    <>
                      <button
                        className="button button-quiet"
                        type="button"
                        onClick={() => lifecycle(project, "unpublish")}
                        disabled={busy}
                        title="Unpublish"
                        aria-label={`Unpublish ${project.title}`}
                      >
                        <Undo2 size={16} aria-hidden />
                      </button>
                      <button
                        className="button button-quiet"
                        type="button"
                        onClick={() => lifecycle(project, "archive")}
                        disabled={busy}
                        title="Archive"
                        aria-label={`Archive ${project.title}`}
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
                        onClick={() => lifecycle(project, "restore")}
                        disabled={busy}
                        title="Restore"
                        aria-label={`Restore ${project.title}`}
                      >
                        <RotateCcw size={16} aria-hidden />
                      </button>
                      <button
                        className="button button-quiet"
                        type="button"
                        onClick={() => remove(project)}
                        disabled={busy}
                        title="Delete permanently"
                        aria-label={`Permanently delete ${project.title}`}
                      >
                        <Trash2 size={16} aria-hidden />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      {confirmation && (
        <ConfirmDialog
          request={confirmation.request}
          onConfirm={() => {
            const { run } = confirmation;
            setConfirmation(undefined);
            void run();
          }}
          onCancel={() => setConfirmation(undefined)}
        />
      )}
    </>
  );
}
