export type ProjectStatus =
  "CONCEPT" | "IN_PROGRESS" | "MAINTAINED" | "COMPLETED";
export type ProjectType = "PERSONAL" | "TEAM" | "LEARNING";
export type FeatureLevel = "PRIMARY" | "SECONDARY";
export type Visibility = "PUBLIC" | "PRIVATE";
export type PublicationStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type MediaType = "COVER" | "VIDEO" | "POSTER" | "GALLERY";

export interface ProjectMedia {
  id: string;
  type: MediaType;
  url: string;
  alt: string;
  caption: string | null;
  mimeType: string | null;
  width: number | null;
  height: number | null;
  durationSeconds: number | null;
  sortOrder: number;
}
export interface Project {
  id: string;
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
  featured: boolean;
  displayOrder: number;
  visibility: Visibility;
  publicationStatus: PublicationStatus;
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
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  archivedAt: string | null;
  media: ProjectMedia[];
}
export interface ProjectWrite {
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
  featured: boolean;
  displayOrder: number;
  visibility: Visibility;
  technologies: string[];
  features: string[];
  decisions: string[];
  challenges: string[];
  learnings: string[];
  nextSteps: string[];
  githubUrl: string;
  demoUrl: string;
  seoTitle: string;
  seoDescription: string;
  openGraphImageUrl: string;
}
export interface ApiError {
  code: string;
  message: string;
  correlationId: string;
  fields?: Record<string, string>;
}
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
export interface Dashboard {
  published: number;
  drafts: number;
  archived: number;
  withoutCover: number;
  incomplete: number;
  recent: Project[];
}
export interface Session {
  authenticated: boolean;
  email: string | null;
  role: string | null;
}
export interface AuditEntry {
  id: string;
  action: string;
  actorEmail: string | null;
  projectId: string | null;
  projectTitle: string | null;
  details: string | null;
  correlationId: string | null;
  createdAt: string;
}
