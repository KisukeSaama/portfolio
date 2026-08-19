import type { Locale } from "~/i18n/config";
import type { Project } from "~/types/api";
import englishProjects from "./projects.en.json";
import frenchProjects from "./projects.fr.json";

const projectsByLocale: Record<Locale, Project[]> = {
  en: englishProjects as Project[],
  fr: frenchProjects as Project[],
};

export function getProjects(locale: Locale): Project[] {
  return projectsByLocale[locale];
}

export function getProject(locale: Locale, slug: string): Project | undefined {
  return projectsByLocale[locale].find((project) => project.slug === slug);
}

export const projectSlugs = englishProjects.map((project) => project.slug);
