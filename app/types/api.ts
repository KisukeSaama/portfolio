export type ProjectStatus =
  | "CONCEPT"
  | "IN_PROGRESS"
  | "MAINTAINED"
  | "COMPLETED";
export type ProjectType = "PERSONAL" | "TEAM" | "LEARNING";
export type FeatureLevel = "PRIMARY" | "SECONDARY";
export type MediaType = "COVER" | "VIDEO" | "POSTER" | "GALLERY";

export interface ProjectMedia {
  type: MediaType;
  url: string;
  alt: string;
  caption: string | null;
  width: number | null;
  height: number | null;
}

/**
 * What a project is, rather than what is said about it. None of these change with the language the
 * page is read in, so they are authored once, in `app/content/project-facts.ts`.
 */
export interface ProjectFacts {
  status: ProjectStatus;
  projectType: ProjectType;
  featureLevel: FeatureLevel;
  startedAt?: string | null;
  technologies: readonly string[];
  githubUrl: string | null;
  demoUrl: string | null;
  openGraphImageUrl: string | null;
  updatedAt: string;
}

/** The prose, written once per language in `projects.<locale>.json`. */
export interface ProjectCopy {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  problem: string;
  context: string;
  objectives: string[];
  solution: string;
  role: string;
  architecture: string;
  features: string[];
  decisions: string[];
  challenges: string[];
  learnings: string[];
  nextSteps: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  media: ProjectMedia[];
}

/** A case study as every page consumes it: the facts, joined to the prose for the active language. */
export type Project = ProjectCopy & ProjectFacts;
