"use client";

import { ImagePlus, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ApiRequestError, apiMutation } from "~/lib/api";
import type { MediaType, Project, ProjectMedia } from "~/types/api";

export function MediaManager({ project }: { project: Project }) {
  const [items, setItems] = useState(project.media);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function upload(form: HTMLFormElement) {
    setBusy(true);
    setError("");
    try {
      const data = new FormData(form);
      data.set("projectId", project.id);
      const item = await apiMutation<ProjectMedia>("/admin/media", {
        method: "POST",
        body: data,
      });
      setItems((current) => [...current, item]);
      form.reset();
    } catch (e) {
      setError(
        e instanceof ApiRequestError ? e.payload.message : "Envoi impossible.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function external(form: HTMLFormElement) {
    setBusy(true);
    setError("");
    const data = new FormData(form);
    try {
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
    } catch (e) {
      setError(
        e instanceof ApiRequestError
          ? e.payload.message
          : "Association impossible.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function remove(item: ProjectMedia) {
    if (!window.confirm(`Supprimer définitivement le média « ${item.alt} » ?`))
      return;
    await apiMutation<void>(`/admin/media/${item.id}`, { method: "DELETE" });
    setItems((current) => current.filter((value) => value.id !== item.id));
  }
  return (
    <div className="media-manager">
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {items.length === 0 ? (
        <p className="muted">
          Aucun média associé. Le site public affichera le placeholder
          explicite.
        </p>
      ) : (
        items.map((item) => (
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
            <div>
              <strong>{item.type}</strong>
              <p className="muted">{item.alt}</p>
            </div>
            <button
              type="button"
              className="button button-quiet"
              onClick={() => void remove(item)}
            >
              <Trash2 size={16} aria-hidden />
              Supprimer
            </button>
          </div>
        ))
      )}
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
            <option value="COVER">Couverture</option>
            <option value="VIDEO">Vidéo</option>
            <option value="POSTER">Poster</option>
            <option value="GALLERY">Galerie</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="upload-alt">Texte alternatif</label>
          <input
            id="upload-alt"
            name="alt"
            required
            maxLength={300}
            className="input"
          />
        </div>
        <div className="field field-span">
          <label htmlFor="upload-file">Fichier image ou vidéo</label>
          <input
            id="upload-file"
            name="file"
            required
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm"
            className="input"
          />
          <span className="field-help">
            Images 8 Mo max ; vidéos 40 Mo max. Validation MIME et extension
            côté serveur.
          </span>
        </div>
        <button className="button button-secondary" disabled={busy}>
          <Upload size={16} aria-hidden />
          Envoyer vers le stockage S3
        </button>
      </form>
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
            <option value="COVER">Couverture</option>
            <option value="VIDEO">Vidéo</option>
            <option value="POSTER">Poster</option>
            <option value="GALLERY">Galerie</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="external-url">URL externe</label>
          <input
            id="external-url"
            name="url"
            type="url"
            required
            className="input"
          />
        </div>
        <div className="field">
          <label htmlFor="external-alt">Texte alternatif</label>
          <input
            id="external-alt"
            name="alt"
            required
            maxLength={300}
            className="input"
          />
        </div>
        <div className="field">
          <label htmlFor="external-caption">Légende</label>
          <input
            id="external-caption"
            name="caption"
            maxLength={500}
            className="input"
          />
        </div>
        <button className="button button-secondary" disabled={busy}>
          <ImagePlus size={16} aria-hidden />
          Associer l’URL
        </button>
      </form>
    </div>
  );
}
