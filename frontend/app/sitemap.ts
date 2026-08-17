import type { MetadataRoute } from "next";
import { serverApi } from "~/lib/server-api";
import type { Project } from "~/types/api";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.PUBLIC_SITE_URL ?? "http://localhost:5173";
  const staticPages: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/journey",
    "/projects",
    "/contact",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
  try {
    const projects = await serverApi<Project[]>("/public/projects", {
      revalidate: 300,
    });
    return [
      ...staticPages,
      ...projects.map((project) => ({
        url: `${siteUrl}/${project.slug}`,
        lastModified: new Date(project.updatedAt),
        changeFrequency: "monthly" as const,
        priority: project.featureLevel === "PRIMARY" ? 0.9 : 0.7,
      })),
    ];
  } catch {
    return staticPages;
  }
}
