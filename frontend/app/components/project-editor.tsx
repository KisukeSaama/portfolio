"use client";

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
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
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
  useEffect(() => {
    if (!isDirty || savingNavigation) return;
    const guardNavigation = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a[href]");
      if (!(link instanceof HTMLAnchorElement) || link.target === "_blank")
        return;
      if (
        !window.confirm(
          "Some changes are not saved. Leave this page?",
        )
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    document.addEventListener("click", guardNavigation, true);
    return () => document.removeEventListener("click", guardNavigation, true);
  }, [isDirty, savingNavigation]);
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
      setNotice("Project saved.");
      if (!project) {
        setSavingNavigation(true);
        router.replace(`/admin/projects/${saved.id}/edit?saved=created`);
        router.refresh();
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
      } else setServerError("Saving failed. Try again.");
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
        <h2>General information</h2>
        <div className="field-grid">
          <Field
            name="title"
            label="Title"
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
              help="Unique, editable before publication."
            />
          </div>
          <Field
            name="shortDescription"
            label="Short description"
            register={register}
            errors={errors}
            textarea
            className="field-span"
          />
          <Field
            name="fullDescription"
            label="Full description"
            register={register}
            errors={errors}
            textarea
            className="field-span"
          />
          <Field
            name="role"
            label="Jonathan's role"
            register={register}
            errors={errors}
            textarea
            className="field-span"
          />
          <div className="field">
            <label htmlFor="status">Project state</label>
            <select id="status" className="select" {...register("status")}>
              <option value="CONCEPT">Concept</option>
              <option value="IN_PROGRESS">In development</option>
              <option value="MAINTAINED">Maintained</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="projectType">Type</label>
            <select
              id="projectType"
              className="select"
              {...register("projectType")}
            >
              <option value="PERSONAL">Personal</option>
              <option value="TEAM">Team</option>
              <option value="LEARNING">Learning</option>
            </select>
          </div>
        </div>
      </section>
      <section className="editor-section">
        <h2>Problem and solution</h2>
        <div className="field-grid">
          <Field
            name="problem"
            label="Concrete problem"
            register={register}
            errors={errors}
            textarea
            className="field-span"
          />
          <Field
            name="context"
            label="Context"
            register={register}
            errors={errors}
            textarea
          />
          <Field
            name="solution"
            label="Solution"
            register={register}
            errors={errors}
            textarea
          />
          <Field
            name="objectives"
            label="Objectives — one per line"
            register={register}
            errors={errors}
            textarea
            className="field-span"
          />
        </div>
      </section>
      <section className="editor-section">
        <h2>Case study</h2>
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
            label="Key decisions — one per line"
            register={register}
            errors={errors}
            textarea
          />
          <Field
            name="challenges"
            label="Challenges — one per line"
            register={register}
            errors={errors}
            textarea
          />
          <Field
            name="learnings"
            label="Learnings — one per line"
            register={register}
            errors={errors}
            textarea
          />
          <Field
            name="nextSteps"
            label="Next steps — one per line"
            register={register}
            errors={errors}
            textarea
          />
        </div>
      </section>
      <section className="editor-section">
        <h2>Technologies and features</h2>
        <div className="field-grid">
          <Field
            name="technologies"
            label="Technologies — one per line"
            register={register}
            errors={errors}
            textarea
          />
          <Field
            name="features"
            label="Features — one per line"
            register={register}
            errors={errors}
            textarea
          />
        </div>
      </section>
      <section className="editor-section">
        <h2>Media</h2>
        {project ? (
          <MediaManager project={project} />
        ) : (
          <p className="muted">
            Save the draft first to upload or attach media to the project.
          </p>
        )}
      </section>
      <section className="editor-section">
        <h2>Links</h2>
        <div className="field-grid">
          <Field
            name="githubUrl"
            label="GitHub URL (optional)"
            register={register}
            errors={errors}
          />
          <Field
            name="demoUrl"
            label="Demo URL (optional)"
            register={register}
            errors={errors}
          />
        </div>
      </section>
      <section className="editor-section">
        <h2>Publication and hierarchy</h2>
        <div className="field-grid">
          <div className="field">
            <label htmlFor="featureLevel">Feature level</label>
            <select
              id="featureLevel"
              className="select"
              {...register("featureLevel")}
            >
              <option value="PRIMARY">Primary</option>
              <option value="SECONDARY">Secondary</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="displayOrder">Display order</label>
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
            <label htmlFor="visibility">Target visibility</label>
            <select
              id="visibility"
              className="select"
              {...register("visibility")}
            >
              <option value="PRIVATE">Private</option>
              <option value="PUBLIC">Public</option>
            </select>
          </div>
          <label className="checkbox">
            <input type="checkbox" {...register("featured")} />
            Featured project
          </label>
        </div>
        {project && (
          <p className="field-help">
            Current editorial state:{" "}
            <strong>{project.publicationStatus}</strong>. Publish or archive it
            from the project list.
          </p>
        )}
      </section>
      <section className="editor-section">
        <h2>SEO</h2>
        <div className="field-grid">
          <Field
            name="seoTitle"
            label="SEO title — 70 characters maximum"
            register={register}
            errors={errors}
          />
          <Field
            name="seoDescription"
            label="SEO description — 170 characters maximum"
            register={register}
            errors={errors}
            textarea
          />
          <Field
            name="openGraphImageUrl"
            label="Open Graph image (URL)"
            register={register}
            errors={errors}
            className="field-span"
          />
        </div>
      </section>
      <div className="editor-actions">
        <button className="button button-primary" disabled={isSubmitting}>
          <Save size={17} aria-hidden />
          {isSubmitting ? "Saving…" : "Save"}
        </button>
        {project && (
          <Link
            className="button button-secondary"
            href={`/admin/projects/${project.id}/preview`}
            target="_blank"
          >
            <Eye size={17} aria-hidden />
            Preview
          </Link>
        )}
        <span className="unsaved" aria-live="polite">
          {isDirty
            ? "Unsaved changes"
            : "All changes are saved"}
        </span>
      </div>
    </form>
  );
}
