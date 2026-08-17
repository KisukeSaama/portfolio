import http from "node:http";
import { URL } from "node:url";
import { randomUUID } from "node:crypto";

const base = {
  id: "episort-id",
  title: "Episort",
  slug: "episort",
  shortDescription: "Organize and rename a media library before Plex.",
  fullDescription:
    "A complete and safe application to organize files before importing them into a Plex media library.",
  problem:
    "Organizing a large media library becomes hard once the files are badly named.",
  context: "Mixed folders and differing orders.",
  objectives: ["Identify"],
  solution: "Analyze, then have a plan confirmed.",
  role: "Full design and development.",
  architecture: "Modular JavaFX application.",
  status: "IN_PROGRESS",
  projectType: "PERSONAL",
  featureLevel: "PRIMARY",
  featured: true,
  displayOrder: 2,
  visibility: "PUBLIC",
  publicationStatus: "PUBLISHED",
  technologies: ["Java", "JavaFX"],
  features: ["Scan"],
  decisions: ["Two-step confirmation"],
  challenges: ["Ambiguities"],
  learnings: ["Explainability"],
  nextSteps: ["Tests"],
  githubUrl: null,
  demoUrl: null,
  seoTitle: null,
  seoDescription: null,
  openGraphImageUrl: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  publishedAt: new Date().toISOString(),
  archivedAt: null,
  media: [],
};
const janus = {
  ...base,
  id: "janus-id",
  title: "Janus",
  slug: "janus",
  shortDescription:
    "Centralize, control and hand out access to API keys.",
  fullDescription:
    "An admin panel and a backend service that reduce secret exposure. The project is ongoing and not every feature is finished.",
  problem:
    "API keys tend to be scattered across projects, rotated poorly and exposed directly.",
  context:
    "More integrations means more secrets, more permissions and more rotations.",
  solution:
    "A proxy service controls authorized applications, permissions, revocation and auditing.",
  role: "Product design, permission modeling and full-stack development.",
  architecture: "Spring Boot API, PostgreSQL and Docker Compose environments.",
  displayOrder: 1,
  technologies: [
    "Java",
    "Spring Boot",
    "Spring Security",
    "PostgreSQL",
    "Docker",
  ],
  features: [
    "Centralized storage",
    "Access proxy",
    "Permissions",
    "Journaling",
    "Revocation",
  ],
  decisions: ["Trace accesses without tracing secrets"],
  challenges: ["Rotation without downtime"],
  learnings: ["Secret management is a lifecycle problem"],
  nextSteps: ["Finish the proxy flow", "Strengthen authorization tests"],
};
const overkill = {
  ...base,
  id: "overkill-id",
  title: "Overkill",
  slug: "overkill",
  shortDescription: "Aggregate and track job offers across the Paris region.",
  fullDescription:
    "A team project bringing scattered offers together, easing comparison and tracking applications.",
  problem:
    "Offers are spread across several platforms and become hard to search, compare and follow.",
  context:
    "The project pairs a React frontend with a Symfony backend around a shared model.",
  solution: "A team web application centralizes search and tracking.",
  role: "Full-stack development contribution within a team project.",
  architecture: "React/Vite frontend, Symfony API, PostgreSQL and Docker.",
  status: "COMPLETED",
  projectType: "TEAM",
  featureLevel: "SECONDARY",
  displayOrder: 3,
  technologies: [
    "React",
    "Vite",
    "Tailwind CSS",
    "Symfony",
    "PostgreSQL",
    "Docker",
  ],
  features: ["Offer aggregation", "Search", "Comparison", "Tracking"],
  decisions: ["Share a clear model between frontend and backend"],
  challenges: ["Coordinating contributions"],
  learnings: ["Good API contracts make collective work easier"],
  nextSteps: ["Add real media"],
};
const social = {
  ...base,
  id: "social-id",
  title: "Mini social network",
  slug: "mini-social-network",
  shortDescription:
    "Grow a full-stack application alongside backend learning.",
  fullDescription:
    "A learning application built in several versions, with a backend that moved from Laravel to Java.",
  problem:
    "Understanding a full-stack system means connecting authentication, data, API and interactions.",
  context:
    "The project is a testing ground for technical evolution rather than a finished product.",
  solution:
    "A deliberately small social network makes framework and modeling choices comparable.",
  role: "Design and development with learning as the goal.",
  architecture: "Several backend iterations, notably Laravel and then Java.",
  status: "COMPLETED",
  projectType: "LEARNING",
  featureLevel: "SECONDARY",
  displayOrder: 4,
  technologies: ["Laravel", "Java", "REST API"],
  features: ["Authentication", "Profiles", "Posts", "Comments"],
  decisions: ["Keep the scope small"],
  challenges: ["Evolving the model"],
  learnings: ["A rewrite pays off when the comparison is explicit"],
  nextSteps: ["Document the differences between versions"],
};
// Janus first, matching the order ProjectSeed.java ships: it is the project the site is positioned
// around, and the public navigation test asserts on which case study leads.
let projects = [janus, base, overkill, social];
const body = (request) =>
  new Promise((resolve) => {
    let data = "";
    request.on("data", (chunk) => (data += chunk));
    request.on("end", () => resolve(data ? JSON.parse(data) : {}));
  });
const cors = {
  "Access-Control-Allow-Origin": "http://127.0.0.1:5173",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Headers":
    "Content-Type, X-XSRF-TOKEN, X-Confirm-Project-Title",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
};
const json = (response, status, value, headers = {}) => {
  response.writeHead(status, {
    "Content-Type": "application/json",
    ...cors,
    ...headers,
  });
  response.end(JSON.stringify(value));
};
const authenticated = (request) =>
  request.headers.cookie?.includes("PORTFOLIO_SESSION=e2e");

http
  .createServer(async (request, response) => {
    const url = new URL(request.url ?? "/", "http://localhost");
    if (request.method === "OPTIONS") {
      response.writeHead(204, cors);
      return response.end();
    }
    if (url.pathname === "/health") return json(response, 200, { ok: true });
    if (url.pathname === "/api/v1/auth/csrf")
      return json(
        response,
        200,
        { token: "e2e-csrf", headerName: "X-XSRF-TOKEN" },
        { "Set-Cookie": "XSRF-TOKEN=e2e-csrf; Path=/; SameSite=Lax" },
      );
    if (url.pathname === "/api/v1/auth/login" && request.method === "POST")
      return json(
        response,
        200,
        { authenticated: true, email: "e2e@example.test", role: "ADMIN" },
        {
          "Set-Cookie": "PORTFOLIO_SESSION=e2e; HttpOnly; Path=/; SameSite=Lax",
        },
      );
    if (url.pathname === "/api/v1/auth/logout" && request.method === "POST") {
      response.writeHead(204, {
        ...cors,
        "Set-Cookie": "PORTFOLIO_SESSION=; Max-Age=0; Path=/; SameSite=Lax",
      });
      return response.end();
    }
    if (url.pathname === "/api/v1/auth/session")
      return json(
        response,
        200,
        authenticated(request)
          ? { authenticated: true, email: "e2e@example.test", role: "ADMIN" }
          : { authenticated: false, email: null, role: null },
      );
    if (url.pathname === "/api/v1/public/projects" && request.method === "GET")
      return json(
        response,
        200,
        projects.filter(
          (p) =>
            p.publicationStatus === "PUBLISHED" && p.visibility === "PUBLIC",
        ),
      );
    if (
      url.pathname.startsWith("/api/v1/public/projects/") &&
      request.method === "GET"
    ) {
      const slug = url.pathname.split("/").pop();
      const project = projects.find(
        (p) => p.slug === slug && p.publicationStatus === "PUBLISHED",
      );
      return project
        ? json(response, 200, project)
        : json(response, 404, {
            code: "not_found",
            message: "Projet introuvable.",
            correlationId: "e2e",
          });
    }
    if (url.pathname.startsWith("/api/v1/admin/") && !authenticated(request))
      return json(response, 401, {
        code: "unauthorized",
        message: "Authentification requise.",
        correlationId: "e2e",
      });
    if (url.pathname === "/api/v1/admin/projects/dashboard")
      return json(response, 200, {
        published: projects.filter((p) => p.publicationStatus === "PUBLISHED")
          .length,
        drafts: projects.filter((p) => p.publicationStatus === "DRAFT").length,
        archived: 0,
        withoutCover: projects.length,
        incomplete: 0,
        recent: projects,
      });
    if (url.pathname === "/api/v1/admin/projects" && request.method === "GET")
      return json(response, 200, {
        content: projects,
        totalElements: projects.length,
        totalPages: 1,
        number: 0,
        size: 100,
      });
    if (
      url.pathname === "/api/v1/admin/projects" &&
      request.method === "POST"
    ) {
      const input = await body(request);
      const now = new Date().toISOString();
      const project = {
        ...input,
        id: randomUUID(),
        publicationStatus: "DRAFT",
        visibility: "PRIVATE",
        createdAt: now,
        updatedAt: now,
        publishedAt: null,
        archivedAt: null,
        media: [],
      };
      projects.push(project);
      return json(response, 201, project);
    }
    const match = url.pathname.match(
      /^\/api\/v1\/admin\/projects\/([^/]+)(?:\/(preview|publish|unpublish|archive|restore|duplicate))?$/,
    );
    if (match) {
      const project = projects.find((p) => p.id === match[1]);
      if (!project)
        return json(response, 404, {
          code: "not_found",
          message: "Projet introuvable.",
          correlationId: "e2e",
        });
      const action = match[2];
      if (request.method === "GET") return json(response, 200, project);
      if (request.method === "PUT") {
        Object.assign(project, await body(request), {
          updatedAt: new Date().toISOString(),
        });
        return json(response, 200, project);
      }
      if (action) {
        if (action === "publish")
          Object.assign(project, {
            publicationStatus: "PUBLISHED",
            visibility: "PUBLIC",
            publishedAt: new Date().toISOString(),
          });
        if (action === "unpublish")
          Object.assign(project, {
            publicationStatus: "DRAFT",
            publishedAt: null,
          });
        if (action === "archive")
          Object.assign(project, {
            publicationStatus: "ARCHIVED",
            visibility: "PRIVATE",
          });
        if (action === "restore")
          Object.assign(project, {
            publicationStatus: "DRAFT",
            visibility: "PRIVATE",
          });
        return json(response, 200, project);
      }
    }
    if (url.pathname === "/api/v1/admin/projects/reorder")
      return json(response, 200, {});
    if (url.pathname === "/api/v1/admin/audit")
      return json(response, 200, {
        content: [],
        totalElements: 0,
        totalPages: 0,
        number: 0,
        size: 50,
      });
    return json(response, 404, {
      code: "not_found",
      message: "Route de test inconnue.",
      correlationId: "e2e",
    });
  })
  .listen(4010, "127.0.0.1");
