import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  useForm,
  useWatch,
  type FieldErrors,
  type Path,
  type UseFormRegister,
} from "react-hook-form";
import { Link, useBlocker } from "react-router";
import { ApiRequestError, apiMutation } from "~/lib/api";
import {
  defaults,
  projectFormSchema,
  slugify,
  toWrite,
  type ProjectFormValues,
} from "~/lib/project-form";
import type { Project } from "~/types/api";
import { MediaManager } from "./media-manager";

function Field({
  name,
  label,
  register,
  errors,
  textarea = false,
  help,
  className = "",
}: {
  name: Path<ProjectFormValues>;
  label: string;
  register: UseFormRegister<ProjectFormValues>;
  errors: FieldErrors<ProjectFormValues>;
  textarea?: boolean;
  help?: string;
  className?: string;
}) {
  const error = errors[name]?.message?.toString();
  const id = `field-${name}`;
  return (
    <div className={`field ${className}`}>
      <label htmlFor={id}>{label}</label>
      {textarea ? (
        <textarea
          id={id}
          className={`textarea ${name === "technologies" || name === "objectives" ? "textarea-list" : ""}`}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${id}-error` : help ? `${id}-help` : undefined
          }
          {...register(name)}
        />
      ) : (
        <input
          id={id}
          className="input"
          aria-invalid={!!error}
          aria-describedby={
            error ? `${id}-error` : help ? `${id}-help` : undefined
          }
          {...register(name)}
        />
      )}{" "}
      {help && !error && (
        <span id={`${id}-help`} className="field-help">
          {help}
        </span>
      )}
      {error && (
        <span id={`${id}-error`} className="field-error">
          {error}
        </span>
      )}
    </div>
  );
}

export function ProjectEditor({ project }: { project?: Project }) {
  const [notice, setNotice] = useState("");
  const [serverError, setServerError] = useState("");
  const [savingNavigation, setSavingNavigation] = useState(false);
  const slugEdited = useRef(Boolean(project));
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: defaults(project),
    mode: "onBlur",
  });
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    control,
    formState: { errors, isDirty, isSubmitting },
  } = form;
  const title = useWatch({ control, name: "title" });
  useEffect(() => {
    if (!slugEdited.current)
      setValue("slug", slugify(title), { shouldDirty: true });
  }, [title, setValue]);
  useEffect(() => {
    const prevent = (event: BeforeUnloadEvent) => {
      if (isDirty && !savingNavigation) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", prevent);
    return () => window.removeEventListener("beforeunload", prevent);
  }, [isDirty, savingNavigation]);
  const blocker = useBlocker(isDirty && !savingNavigation);
  useEffect(() => {
    if (blocker.state === "blocked") {
      if (
        window.confirm(
          "Des modifications ne sont pas enregistrées. Quitter cette page ?",
        )
      )
        blocker.proceed();
      else blocker.reset();
    }
  }, [blocker]);
  async function submit(values: ProjectFormValues) {
    setServerError("");
    setNotice("");
    try {
      const saved = await apiMutation<Project>(
        project ? `/admin/projects/${project.id}` : "/admin/projects",
        {
          method: project ? "PUT" : "POST",
          body: JSON.stringify(toWrite(values)),
        },
      );
      reset(defaults(saved));
      setNotice("Projet enregistré.");
      if (!project) {
        setSavingNavigation(true);
        window.location.assign(
          `/admin/projects/${saved.id}/edit?saved=created`,
        );
      }
    } catch (error) {
      setSavingNavigation(false);
      if (error instanceof ApiRequestError) {
        setServerError(error.payload.message);
        for (const [field, message] of Object.entries(
          error.payload.fields ?? {},
        )) {
          if (field in values)
            setError(field as Path<ProjectFormValues>, { message });
        }
      } else setServerError("Enregistrement impossible. Réessayez.");
    }
  }
  return (
    <form
      className="editor-form"
      onSubmit={(event) => void handleSubmit(submit)(event)}
      noValidate
    >
      {serverError && (
        <p className="form-error" role="alert">
          {serverError}
        </p>
      )}
      {notice && (
        <p className="form-success" role="status">
          {notice}
        </p>
      )}
      <section className="editor-section">
        <h2>Informations générales</h2>
        <div className="field-grid">
          <Field
            name="title"
            label="Titre"
            register={register}
            errors={errors}
          />
          <div
            onFocus={() => {
              slugEdited.current = true;
            }}
          >
            <Field
              name="slug"
              label="Slug"
              register={register}
              errors={errors}
              help="Unique, modifiable avant publication."
            />
          </div>
          <Field
            name="shortDescription"
            label="Description courte"
            register={register}
            errors={errors}
            textarea
            className="field-span"
          />
          <Field
            name="fullDescription"
            label="Description complète"
            register={register}
            errors={errors}
            textarea
            className="field-span"
          />
          <Field
            name="role"
            label="Rôle de Jonathan"
            register={register}
            errors={errors}
            textarea
            className="field-span"
          />
          <div className="field">
            <label htmlFor="status">État du projet</label>
            <select id="status" className="select" {...register("status")}>
              <option value="CONCEPT">Conception</option>
              <option value="IN_PROGRESS">En développement</option>
              <option value="MAINTAINED">Maintenu</option>
              <option value="COMPLETED">Réalisé</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="projectType">Type</label>
            <select
              id="projectType"
              className="select"
              {...register("projectType")}
            >
              <option value="PERSONAL">Personnel</option>
              <option value="TEAM">Équipe</option>
              <option value="LEARNING">Apprentissage</option>
            </select>
          </div>
        </div>
      </section>
      <section className="editor-section">
        <h2>Problème et solution</h2>
        <div className="field-grid">
          <Field
            name="problem"
            label="Problème concret"
            register={register}
            errors={errors}
            textarea
            className="field-span"
          />
          <Field
            name="context"
            label="Contexte"
            register={register}
            errors={errors}
            textarea
          />
          <Field
            name="solution"
            label="Solution imaginée"
            register={register}
            errors={errors}
            textarea
          />
          <Field
            name="objectives"
            label="Objectifs — un par ligne"
            register={register}
            errors={errors}
            textarea
            className="field-span"
          />
        </div>
      </section>
      <section className="editor-section">
        <h2>Étude de cas</h2>
        <div className="field-grid">
          <Field
            name="architecture"
            label="Architecture"
            register={register}
            errors={errors}
            textarea
            className="field-span"
          />
          <Field
            name="decisions"
            label="Choix importants — un par ligne"
            register={register}
            errors={errors}
            textarea
          />
          <Field
            name="challenges"
            label="Difficultés — une par ligne"
            register={register}
            errors={errors}
            textarea
          />
          <Field
            name="learnings"
            label="Apprentissages — un par ligne"
            register={register}
            errors={errors}
            textarea
          />
          <Field
            name="nextSteps"
            label="Prochaines étapes — une par ligne"
            register={register}
            errors={errors}
            textarea
          />
        </div>
      </section>
      <section className="editor-section">
        <h2>Technologies et fonctionnalités</h2>
        <div className="field-grid">
          <Field
            name="technologies"
            label="Technologies — une par ligne"
            register={register}
            errors={errors}
            textarea
          />
          <Field
            name="features"
            label="Fonctionnalités — une par ligne"
            register={register}
            errors={errors}
            textarea
          />
        </div>
      </section>
      <section className="editor-section">
        <h2>Médias</h2>
        {project ? (
          <MediaManager project={project} />
        ) : (
          <p className="muted">
            Enregistrez d’abord le brouillon pour envoyer ou associer des médias
            au projet.
          </p>
        )}
      </section>
      <section className="editor-section">
        <h2>Liens</h2>
        <div className="field-grid">
          <Field
            name="githubUrl"
            label="URL GitHub (facultative)"
            register={register}
            errors={errors}
          />
          <Field
            name="demoUrl"
            label="URL de démonstration (facultative)"
            register={register}
            errors={errors}
          />
        </div>
      </section>
      <section className="editor-section">
        <h2>Publication et hiérarchie</h2>
        <div className="field-grid">
          <div className="field">
            <label htmlFor="featureLevel">Niveau de mise en avant</label>
            <select
              id="featureLevel"
              className="select"
              {...register("featureLevel")}
            >
              <option value="PRIMARY">Principal</option>
              <option value="SECONDARY">Secondaire</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="displayOrder">Ordre d’affichage</label>
            <input
              id="displayOrder"
              type="number"
              min="0"
              max="9999"
              className="input"
              {...register("displayOrder", { valueAsNumber: true })}
            />
            {errors.displayOrder && (
              <span className="field-error">{errors.displayOrder.message}</span>
            )}
          </div>
          <div className="field">
            <label htmlFor="visibility">Visibilité cible</label>
            <select
              id="visibility"
              className="select"
              {...register("visibility")}
            >
              <option value="PRIVATE">Privé</option>
              <option value="PUBLIC">Public</option>
            </select>
          </div>
          <label className="checkbox">
            <input type="checkbox" {...register("featured")} />
            Projet mis en avant
          </label>
        </div>
        {project && (
          <p className="field-help">
            État éditorial actuel : <strong>{project.publicationStatus}</strong>
            . Publiez ou archivez depuis la liste des projets.
          </p>
        )}
      </section>
      <section className="editor-section">
        <h2>SEO</h2>
        <div className="field-grid">
          <Field
            name="seoTitle"
            label="Titre SEO — 70 caractères maximum"
            register={register}
            errors={errors}
          />
          <Field
            name="seoDescription"
            label="Description SEO — 170 caractères maximum"
            register={register}
            errors={errors}
            textarea
          />
          <Field
            name="openGraphImageUrl"
            label="Image Open Graph (URL)"
            register={register}
            errors={errors}
            className="field-span"
          />
        </div>
      </section>
      <div className="editor-actions">
        <button className="button button-primary" disabled={isSubmitting}>
          <Save size={17} aria-hidden />
          {isSubmitting ? "Enregistrement…" : "Enregistrer"}
        </button>
        {project && (
          <Link
            className="button button-secondary"
            to={`/admin/projects/${project.id}/preview`}
            target="_blank"
          >
            <Eye size={17} aria-hidden />
            Prévisualiser
          </Link>
        )}
        <span className="unsaved" aria-live="polite">
          {isDirty
            ? "Modifications non enregistrées"
            : "Toutes les modifications sont enregistrées"}
        </span>
      </div>
    </form>
  );
}
