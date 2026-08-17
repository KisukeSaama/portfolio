import type { LoaderFunctionArgs } from "react-router";
import { apiLoader } from "~/lib/api";
import type { Project } from "~/types/api";
export async function loader({ request }: LoaderFunctionArgs) {
  const configuredOrigin = process.env.PUBLIC_SITE_URL?.replace(/\/$/, "");
  const origin =
    configuredOrigin && /^https?:\/\//.test(configuredOrigin)
      ? configuredOrigin
      : new URL(request.url).origin;
  const projects = await apiLoader<Project[]>(request, "/public/projects");
  const urls = [
    "",
    "/about",
    "/journey",
    "/projects",
    "/contact",
    ...projects.map((p) => `/projects/${p.slug}`),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((path) => `<url><loc>${origin}${path}</loc></url>`).join("")}</urlset>`;
  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
