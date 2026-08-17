import { index, layout, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  layout("routes/public-layout.tsx",[
    index("routes/home.tsx"),
    route("about","routes/about.tsx"),
    route("journey","routes/journey.tsx"),
    route("projects","routes/projects.tsx"),
    route("projects/:slug","routes/project-detail.tsx"),
    route("contact","routes/contact.tsx"),
    route("legal","routes/legal.tsx"),
  ]),
  route("admin/login","routes/admin-login.tsx"),
  route("admin","routes/admin-layout.tsx",[
    index("routes/admin-dashboard.tsx"),
    route("projects","routes/admin-projects.tsx"),
    route("projects/new","routes/admin-project-new.tsx"),
    route("projects/:id/edit","routes/admin-project-edit.tsx"),
    route("projects/:id/preview","routes/admin-preview.tsx"),
    route("audit","routes/admin-audit.tsx"),
  ]),
  route("sitemap.xml","routes/sitemap.ts"),
  route("robots.txt","routes/robots.ts"),
  route("*","routes/not-found.tsx"),
] satisfies RouteConfig;
