import { z } from "zod";
import type { Project, ProjectTranslation, ProjectWrite } from "~/types/api";
const optionalUrl = z
  .string()
  .refine(
    (value) => !value || z.url().safeParse(value).success,
    "Enter a complete URL.",
  );
export const projectFormSchema = z.object({
  title: z.string().min(2, "Title is too short.").max(120),
  slug: z
    .string()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, digits and hyphens.",
    ),
  shortDescription: z.string().min(20).max(280),
  fullDescription: z.string().min(40).max(10000),
  problem: z.string().min(20).max(5000),
  context: z.string().max(5000),
  solution: z.string().min(20).max(5000),
  role: z.string().min(10).max(2000),
  architecture: z.string().max(5000),
  status: z.enum(["CONCEPT", "IN_PROGRESS", "MAINTAINED", "COMPLETED"]),
  projectType: z.enum(["PERSONAL", "TEAM", "LEARNING"]),
  featureLevel: z.enum(["PRIMARY", "SECONDARY"]),
  featured: z.boolean(),
  displayOrder: z.number().int().min(0).max(9999),
  visibility: z.enum(["PUBLIC", "PRIVATE"]),
  objectives: z.string(),
  technologies: z.string(),
  features: z.string(),
  decisions: z.string(),
  challenges: z.string(),
  learnings: z.string(),
  nextSteps: z.string(),
  githubUrl: optionalUrl,
  demoUrl: optionalUrl,
  seoTitle: z.string().max(70),
  seoDescription: z.string().max(170),
  openGraphImageUrl: optionalUrl,
  /**
   * The French case study. Every field is optional and empty means "not translated yet", which the
   * API resolves by falling back to the English one above. The editor is deliberately one form and
   * not two: the translator is the same person as the author, and a second screen would let the two
   * languages drift without anyone noticing.
   */
  frTitle: z.string().max(120),
  frShortDescription: z.string().max(280),
  frFullDescription: z.string().max(10000),
  frProblem: z.string().max(5000),
  frContext: z.string().max(5000),
  frSolution: z.string().max(5000),
  frRole: z.string().max(2000),
  frArchitecture: z.string().max(5000),
  frObjectives: z.string(),
  frFeatures: z.string(),
  frDecisions: z.string(),
  frChallenges: z.string(),
  frLearnings: z.string(),
  frNextSteps: z.string(),
  frSeoTitle: z.string().max(70),
  frSeoDescription: z.string().max(170),
});
export type ProjectFormValues = z.infer<typeof projectFormSchema>;
const lines = (value: string) =>
  value
    .split(/\r?\n/)
    .map((v) => v.trim())
    .filter(Boolean);
/** Splits the French half back out of the flat form and drops it if nothing was filled in. */
function frenchTranslation(
  v: ProjectFormValues,
): Record<string, ProjectTranslation> {
  const translation: ProjectTranslation = {
    title: v.frTitle,
    shortDescription: v.frShortDescription,
    fullDescription: v.frFullDescription,
    problem: v.frProblem,
    context: v.frContext,
    solution: v.frSolution,
    role: v.frRole,
    architecture: v.frArchitecture,
    objectives: lines(v.frObjectives),
    features: lines(v.frFeatures),
    decisions: lines(v.frDecisions),
    challenges: lines(v.frChallenges),
    learnings: lines(v.frLearnings),
    nextSteps: lines(v.frNextSteps),
    seoTitle: v.frSeoTitle,
    seoDescription: v.frSeoDescription,
  };
  const filled = Object.values(translation).some((value) =>
    Array.isArray(value) ? value.length > 0 : Boolean(value?.trim()),
  );
  // Storing an all-blank translation would be indistinguishable from a real one on the next read.
  return filled ? { fr: translation } : {};
}

export function toWrite(v: ProjectFormValues): ProjectWrite {
  // Listed field by field rather than spread: the form also carries the `fr`-prefixed translation,
  // and spreading `v` would post those to the API as unknown properties.
  return {
    title: v.title,
    slug: v.slug,
    shortDescription: v.shortDescription,
    fullDescription: v.fullDescription,
    problem: v.problem,
    context: v.context,
    solution: v.solution,
    role: v.role,
    architecture: v.architecture,
    status: v.status,
    projectType: v.projectType,
    featureLevel: v.featureLevel,
    featured: v.featured,
    displayOrder: v.displayOrder,
    visibility: v.visibility,
    objectives: lines(v.objectives),
    technologies: lines(v.technologies),
    features: lines(v.features),
    decisions: lines(v.decisions),
    challenges: lines(v.challenges),
    learnings: lines(v.learnings),
    nextSteps: lines(v.nextSteps),
    githubUrl: v.githubUrl,
    demoUrl: v.demoUrl,
    seoTitle: v.seoTitle,
    seoDescription: v.seoDescription,
    openGraphImageUrl: v.openGraphImageUrl,
    translations: frenchTranslation(v),
  };
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
export function defaults(project?: Project): ProjectFormValues {
  return project
    ? {
        title: project.title,
        slug: project.slug,
        shortDescription: project.shortDescription,
        fullDescription: project.fullDescription,
        problem: project.problem,
        context: project.context,
        solution: project.solution,
        role: project.role,
        architecture: project.architecture,
        status: project.status,
        projectType: project.projectType,
        featureLevel: project.featureLevel,
        featured: project.featured,
        displayOrder: project.displayOrder,
        visibility: project.visibility,
        objectives: project.objectives.join("\n"),
        technologies: project.technologies.join("\n"),
        features: project.features.join("\n"),
        decisions: project.decisions.join("\n"),
        challenges: project.challenges.join("\n"),
        learnings: project.learnings.join("\n"),
        nextSteps: project.nextSteps.join("\n"),
        githubUrl: project.githubUrl ?? "",
        demoUrl: project.demoUrl ?? "",
        seoTitle: project.seoTitle ?? "",
        seoDescription: project.seoDescription ?? "",
        openGraphImageUrl: project.openGraphImageUrl ?? "",
        ...french(project.translations?.fr),
      }
    : {
        title: "",
        slug: "",
        shortDescription: "",
        fullDescription: "",
        problem: "",
        context: "",
        solution: "",
        role: "",
        architecture: "",
        status: "IN_PROGRESS",
        projectType: "PERSONAL",
        featureLevel: "SECONDARY",
        featured: false,
        displayOrder: 10,
        visibility: "PRIVATE",
        objectives: "",
        technologies: "",
        features: "",
        decisions: "",
        challenges: "",
        learnings: "",
        nextSteps: "",
        githubUrl: "",
        demoUrl: "",
        seoTitle: "",
        seoDescription: "",
        openGraphImageUrl: "",
        ...french(undefined),
      };
}

/** The stored French translation flattened back into the form's `fr`-prefixed fields. */
function french(t: ProjectTranslation | undefined) {
  return {
    frTitle: t?.title ?? "",
    frShortDescription: t?.shortDescription ?? "",
    frFullDescription: t?.fullDescription ?? "",
    frProblem: t?.problem ?? "",
    frContext: t?.context ?? "",
    frSolution: t?.solution ?? "",
    frRole: t?.role ?? "",
    frArchitecture: t?.architecture ?? "",
    frObjectives: (t?.objectives ?? []).join("\n"),
    frFeatures: (t?.features ?? []).join("\n"),
    frDecisions: (t?.decisions ?? []).join("\n"),
    frChallenges: (t?.challenges ?? []).join("\n"),
    frLearnings: (t?.learnings ?? []).join("\n"),
    frNextSteps: (t?.nextSteps ?? []).join("\n"),
    frSeoTitle: t?.seoTitle ?? "",
    frSeoDescription: t?.seoDescription ?? "",
  };
}
