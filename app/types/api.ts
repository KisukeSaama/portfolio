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

/** Public case-study content, authored directly in the repository. */
export interface Project {
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
  status: ProjectStatus;
  projectType: ProjectType;
  featureLevel: FeatureLevel;
  startedAt?: string | null;
  technologies: string[];
  features: string[];
  decisions: string[];
  challenges: string[];
  learnings: string[];
  nextSteps: string[];
  githubUrl: string | null;
  demoUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  openGraphImageUrl: string | null;
  updatedAt: string;
  media: ProjectMedia[];
}
