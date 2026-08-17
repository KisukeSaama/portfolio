"use client";

import { ImagePlus, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ApiRequestError, apiMutation } from "~/lib/api";
import { mediaTypeLabels } from "~/lib/admin-labels";
import type { MediaType, Project, ProjectMedia } from "~/types/api";
import { ConfirmDialog } from "./confirm-dialog";

export function MediaManager({ project }: { project: Project }) {
  const [items, setItems] = useState(project.media);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<ProjectMedia>();

  async function run(task: () => Promise<void>, fallback: string) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await task();
    } catch (e) {
      setError(e instanceof ApiRequestError ? e.payload.message : fallback);
    } finally {
      setBusy(false);
    }
  }

  async function upload(form: HTMLFormElement) {
    await run(async () => {
      const data = new FormData(form);
      data.set("projectId", project.id);
      const item = await apiMutation<ProjectMedia>("/admin/media", {
        method: "POST",
        body: data,
      });
      setItems((current) => [...current, item]);
      form.reset();
      setNotice("File uploaded.");
    }, "Upload failed.");
  }

  async function external(form: HTMLFormElement) {
    const data = new FormData(form);
    await run(async () => {
      const item = await apiMutation<ProjectMedia>("/admin/media/external", {
        method: "POST",
        body: JSON.stringify({
          projectId: project.id,
          type: data.get("type") as MediaType,
          url: data.get("url"),
          alt: data.get("alt"),
          caption: data.get("caption"),
          sortOrder: items.length,
        }),
      });
      setItems((current) => [...current, item]);
      form.reset();
      setNotice("URL attached.");
    }, "Could not attach the URL.");
  }

  /**
   * The row is removed only once the server confirms. Previously the call was unguarded, so a failed
   * delete still dropped the row from the list and the operator was told nothing.
   */
  async function remove(item: ProjectMedia) {
    setPendingDelete(undefined);
    await run(async () => {
      await apiMutation<void>(`/admin/media/${item.id}`, { method: "DELETE" });
      setItems((current) => current.filter((value) => value.id !== item.id));
      setNotice("Media deleted.");
    }, "Could not delete the media.");
  }

  return (
    <div className="media-manager" aria-busy={busy}>
      <p className="field-help">
        Media is saved as soon as you upload or attach it. It does not wait for
        Save.
      </p>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="form-success" role="status">
          {notice}
        </p>
      )}

      {items.length === 0 ? (
        <p className="muted">
          No media attached. The public page shows an explicit placeholder.
        </p>
      ) : (
        <div className="media-list">
          {items.map((item) => (
            <div className="media-row" key={item.id}>
              {item.type === "VIDEO" ? (
                <video
                  className="media-thumb"
                  src={item.url}
                  muted
                  controls
                  aria-label={item.alt}
                />
              ) : (
                <Image
                  className="media-thumb"
                  src={item.url}
                  alt={item.alt}
                  width={160}
                  height={120}
                  unoptimized
                />
              )}
              <div className="media-meta">
                <strong>{mediaTypeLabels[item.type]}</strong>
                <p className="muted">{item.alt}</p>
              </div>
              <button
                type="button"
                className="button button-quiet"
                disabled={busy}
                onClick={() => setPendingDelete(item)}
              >
                <Trash2 size={16} aria-hidden />
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      <section className="media-group">
        <h3>Upload a file</h3>
        <form
          className="field-grid"
          onSubmit={(event) => {
            event.preventDefault();
            void upload(event.currentTarget);
          }}
        >
          <div className="field">
            <label htmlFor="upload-type">Type</label>
            <select id="upload-type" name="type" className="select">
              {Object.entries(mediaTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="upload-alt">Alternative text</label>
            <input
              id="upload-alt"
              name="alt"
              required
              maxLength={300}
              className="input"
            />
          </div>
          <div className="field field-span">
            <label htmlFor="upload-file">Image or video file</label>
            <input
              id="upload-file"
              name="file"
              required
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm"
              className="input"
            />
            <span className="field-help">
              Images up to 8 MB, videos up to 40 MB. MIME type and extension are
              validated server-side.
            </span>
          </div>
          <div className="field-span">
            <button className="button button-secondary" disabled={busy}>
              <Upload size={16} aria-hidden />
              {busy ? "Working…" : "Upload the file"}
            </button>
          </div>
        </form>
      </section>

      <section className="media-group">
        <h3>Attach an external URL</h3>
        <form
          className="field-grid"
          onSubmit={(event) => {
            event.preventDefault();
            void external(event.currentTarget);
          }}
        >
          <div className="field">
            <label htmlFor="external-type">Type</label>
            <select id="external-type" name="type" className="select">
              {Object.entries(mediaTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="external-url">External URL</label>
            <input
              id="external-url"
              name="url"
              type="url"
              required
              className="input"
            />
          </div>
          <div className="field">
            <label htmlFor="external-alt">Alternative text</label>
            <input
              id="external-alt"
              name="alt"
              required
              maxLength={300}
              className="input"
            />
          </div>
          <div className="field">
            <label htmlFor="external-caption">Caption</label>
            <input
              id="external-caption"
              name="caption"
              maxLength={500}
              className="input"
            />
          </div>
          <div className="field-span">
            <button className="button button-secondary" disabled={busy}>
              <ImagePlus size={16} aria-hidden />
              {busy ? "Working…" : "Attach the URL"}
            </button>
          </div>
        </form>
      </section>

      {pendingDelete && (
        <ConfirmDialog
          request={{
            title: "Delete this media?",
            body: `“${pendingDelete.alt}” is removed from the project and from storage. This cannot be undone.`,
            confirmLabel: "Delete the media",
            danger: true,
          }}
          onConfirm={() => void remove(pendingDelete)}
          onCancel={() => setPendingDelete(undefined)}
        />
      )}
    </div>
  );
}
