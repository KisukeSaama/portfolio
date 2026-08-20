import type { ProjectFacts } from "~/types/api";

/**
 * Everything about a project that does not change with the language it is read in: where it stands,
 * what it is built with, where the code lives.
 *
 * These used to sit in both `projects.en.json` and `projects.fr.json`, which meant the home page, the
 * catalogue and the case study could each be told a different status depending on the language the
 * visitor was reading in. Nothing enforced the copies matching. They live here once instead, and the
 * language files carry prose only. `tests/projects.test.ts` fails if a fact finds its way back into
 * one of them.
 *
 * The key order is the order projects appear in, on the home page and in the catalogue alike.
 */
export const projectFacts = {
  "episort": {
    status: "MAINTAINED",
    projectType: "PERSONAL",
    featureLevel: "PRIMARY",
    startedAt: "2026-05-07",
    technologies: [
      "Java 25",
      "JavaFX 25",
      "Gradle",
      "JUnit 5",
      "TMDB API",
      "Janus gateway",
      "Go 1.26",
      "GitHub Actions",
    ],
    githubUrl: "https://github.com/KisukeSaama/episort",
    demoUrl: null,
    openGraphImageUrl: null,
    updatedAt: "2026-08-19T19:04:18.427819Z",
  },
  "janus": {
    status: "MAINTAINED",
    projectType: "PERSONAL",
    featureLevel: "PRIMARY",
    startedAt: "2026-08-10",
    technologies: [
      "Java 25",
      "Spring Boot 4",
      "Virtual threads",
      "React 19",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "PostgreSQL",
      "OpenBao",
      "Maven",
      "Docker Compose",
      "Traefik",
      "nginx",
      "GitLab CI",
    ],
    githubUrl: "https://github.com/KisukeSaama/janus",
    demoUrl: null,
    openGraphImageUrl: null,
    updatedAt: "2026-08-19T19:04:18.429410Z",
  },
  "overkill": {
    status: "COMPLETED",
    projectType: "LEARNING",
    featureLevel: "SECONDARY",
    technologies: [],
    githubUrl: null,
    demoUrl: null,
    openGraphImageUrl: null,
    updatedAt: "2026-08-19T19:04:18.430621Z",
  },
  "mini-social-network": {
    status: "COMPLETED",
    projectType: "LEARNING",
    featureLevel: "SECONDARY",
    technologies: [
      "Laravel",
      "PHP",
      "Java",
      "REST API",
    ],
    githubUrl: null,
    demoUrl: null,
    openGraphImageUrl: null,
    updatedAt: "2026-08-19T19:04:18.431907Z",
  },
} as const satisfies Record<string, ProjectFacts>;

export type ProjectSlug = keyof typeof projectFacts;

export const projectSlugs = Object.keys(projectFacts) as ProjectSlug[];
