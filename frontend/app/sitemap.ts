import type { MetadataRoute } from "next";
import { locales } from "~/i18n/config";
import { serverApi } from "~/lib/server-api";
import type { Project } from "~/types/api";

export const dynamic = "force-dynamic";

/**
 * Every public URL exists once per locale, and each entry lists the other locales as alternates so
 * search engines pair the two versions instead of treating them as duplicates.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.PUBLIC_SITE_URL ?? "http://localhost:5173";
  const languages = (path: string) =>
    Object.fromEntries(
      locales.map((locale) => [locale, `${siteUrl}/${locale}${path}`]),
    );

  const paths = ["", "/about", "/journey", "/projects", "/contact"];
  const staticPages: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${siteUrl}/${locale}${path}`,
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : 0.7,
      alternates: { languages: languages(path) },
    })),
  );

  try {
    const projects = await serverApi<Project[]>("/public/projects", {
      revalidate: 300,
    });
    return [
      ...staticPages,
      ...locales.flatMap((locale) =>
        projects.map((project) => ({
          url: `${siteUrl}/${locale}/${project.slug}`,
          lastModified: new Date(project.updatedAt),
          changeFrequency: "monthly" as const,
          priority: project.featureLevel === "PRIMARY" ? 0.9 : 0.7,
          alternates: { languages: languages(`/${project.slug}`) },
        })),
      ),
    ];
  } catch {
    return staticPages;
  }
}
