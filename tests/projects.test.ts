import { describe, expect, it } from "vitest";
import { projectFacts, projectSlugs } from "~/content/project-facts";
import { getProjects } from "~/content/projects";
import englishCopy from "~/content/projects.en.json";
import frenchCopy from "~/content/projects.fr.json";
import { locales } from "~/i18n/config";

/**
 * The status a project is in, the stack it runs on and the address of its repository do not change
 * with the language the page is read in. They used to be written twice, once per language file, and
 * nothing checked the two copies against each other. A project could be maintained in English and in
 * development in French, and the home page, the catalogue and the case study would each repeat
 * whichever copy they had been handed.
 *
 * These tests hold the shape that makes that impossible: the facts live in one registry, the
 * language files carry prose only, and both of them describe exactly the projects the registry
 * lists.
 */

const FACT_KEYS = [
  "status",
  "projectType",
  "featureLevel",
  "startedAt",
  "technologies",
  "githubUrl",
  "demoUrl",
  "openGraphImageUrl",
  "updatedAt",
];

const copyFiles = { en: englishCopy, fr: frenchCopy } as const;

describe("project facts", () => {
  it.each(locales)("%s carries prose only, never a fact", (locale) => {
    for (const entry of copyFiles[locale]) {
      const facts = Object.keys(entry).filter((key) =>
        FACT_KEYS.includes(key),
      );
      expect({ slug: entry.slug, facts }).toEqual({
        slug: entry.slug,
        facts: [],
      });
    }
  });

  it.each(locales)("%s describes exactly the registered projects", (locale) => {
    expect(copyFiles[locale].map((entry) => entry.slug)).toEqual(projectSlugs);
  });

  it("gives every language the same prose fields", () => {
    const shape = (entry: { slug: string }) => Object.keys(entry).sort();
    const english = new Map(englishCopy.map((entry) => [entry.slug, entry]));
    for (const entry of frenchCopy) {
      expect(shape(entry)).toEqual(shape(english.get(entry.slug)!));
    }
  });

  it("reads the same status, stack and links in every language", () => {
    const facts = (locale: (typeof locales)[number]) =>
      getProjects(locale).map((project) => ({
        slug: project.slug,
        status: project.status,
        projectType: project.projectType,
        featureLevel: project.featureLevel,
        startedAt: project.startedAt ?? null,
        technologies: project.technologies,
        githubUrl: project.githubUrl,
        demoUrl: project.demoUrl,
      }));
    const [first, ...rest] = locales;
    for (const locale of rest) expect(facts(locale)).toEqual(facts(first));
  });

  it("renders no project the registry has not registered", () => {
    for (const locale of locales) {
      for (const project of getProjects(locale)) {
        expect(projectFacts).toHaveProperty(project.slug);
      }
    }
  });
});
