import type { Locale } from "~/i18n/config";
import type { Project, ProjectCopy } from "~/types/content";
import { projectFacts, projectSlugs } from "./project-facts";
import englishProjects from "./projects.en.json";
import frenchProjects from "./projects.fr.json";

const copyByLocale: Record<Locale, ProjectCopy[]> = {
  en: englishProjects as ProjectCopy[],
  fr: frenchProjects as ProjectCopy[],
};

/**
 * The prose for one language, joined to the facts every language shares.
 *
 * The registry decides which projects exist and in what order, so a language file can neither
 * introduce a project the other one has never heard of nor reorder the catalogue behind it. A slug
 * with no prose in this language is dropped rather than rendered half empty.
 */
function withFacts(locale: Locale): Project[] {
  const copy = new Map(copyByLocale[locale].map((entry) => [entry.slug, entry]));
  return projectSlugs.flatMap((slug) => {
    const entry = copy.get(slug);
    return entry ? [{ ...entry, ...projectFacts[slug] }] : [];
  });
}

const projectsByLocale: Record<Locale, Project[]> = {
  en: withFacts("en"),
  fr: withFacts("fr"),
};

export function getProjects(locale: Locale): Project[] {
  return projectsByLocale[locale];
}

export function getProject(locale: Locale, slug: string): Project | undefined {
  return projectsByLocale[locale].find((project) => project.slug === slug);
}

export { projectSlugs };
