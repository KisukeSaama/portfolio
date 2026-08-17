import http from "node:http";
import { URL } from "node:url";
import { randomUUID } from "node:crypto";

const base = {
  id: "episort-id",
  title: "Episort",
  slug: "episort",
  shortDescription: "Organiser et renommer une médiathèque avant Plex.",
  fullDescription:
    "Une application complète et sûre pour organiser les fichiers avant leur intégration dans une médiathèque Plex.",
  problem:
    "Organiser correctement une grande médiathèque devient difficile lorsque les fichiers sont mal nommés.",
  context: "Des dossiers mélangés et des ordres différents.",
  objectives: ["Identifier"],
  solution: "Analyser puis faire valider un plan.",
  role: "Conception et développement complet.",
  architecture: "Application JavaFX modulaire.",
  status: "IN_PROGRESS",
  projectType: "PERSONAL",
  featureLevel: "PRIMARY",
  featured: true,
  displayOrder: 1,
  visibility: "PUBLIC",
  publicationStatus: "PUBLISHED",
  technologies: ["Java", "JavaFX"],
  features: ["Scan"],
  decisions: ["Double validation"],
  challenges: ["Ambiguïtés"],
  learnings: ["Explicabilité"],
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
    "Centraliser, contrôler et distribuer l’accès aux clés API.",
  fullDescription:
    "Un panneau d’administration et un service backend pour réduire l’exposition des secrets. Le projet est en cours et toutes les fonctions ne sont pas finalisées.",
  problem:
    "Les clés API sont souvent dispersées dans différents projets, mal renouvelées et directement exposées.",
  context:
    "Les intégrations multiplient les secrets, leurs permissions et les opérations de rotation.",
  solution:
    "Un service proxy contrôle les applications autorisées, les permissions, la révocation et l’audit.",
  role: "Conception produit, modélisation des permissions et développement full-stack.",
  architecture: "API Spring Boot, PostgreSQL et environnements Docker Compose.",
  displayOrder: 2,
  technologies: [
    "Java",
    "Spring Boot",
    "Spring Security",
    "PostgreSQL",
    "Docker",
  ],
  features: [
    "Stockage centralisé",
    "Proxy d’accès",
    "Permissions",
    "Journalisation",
    "Révocation",
  ],
  decisions: ["Tracer les accès sans tracer les secrets"],
  challenges: ["Rotation sans interruption"],
  learnings: ["La gestion des secrets est un problème de cycle de vie"],
  nextSteps: ["Finaliser le flux proxy", "Renforcer les tests d’autorisation"],
};
const overkill = {
  ...base,
  id: "overkill-id",
  title: "Overkill",
  slug: "overkill",
  shortDescription: "Agréger et suivre des offres d’emploi en Île-de-France.",
  fullDescription:
    "Projet d’équipe visant à réunir des offres dispersées, faciliter leur comparaison et suivre les candidatures.",
  problem:
    "Les offres sont dispersées sur plusieurs plateformes et deviennent difficiles à rechercher, comparer et suivre.",
  context:
    "Le projet associe un frontend React et un backend Symfony autour d’un modèle partagé.",
  solution: "Une application web d’équipe centralise la recherche et le suivi.",
  role: "Contribution au développement full-stack au sein d’un projet d’équipe.",
  architecture: "Frontend React/Vite, API Symfony, PostgreSQL et Docker.",
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
  features: ["Agrégation d’offres", "Recherche", "Comparaison", "Suivi"],
  decisions: ["Partager un modèle clair entre frontend et backend"],
  challenges: ["Coordonner les contributions"],
  learnings: ["De bons contrats d’API facilitent le travail collectif"],
  nextSteps: ["Ajouter les médias réels"],
};
const social = {
  ...base,
  id: "social-id",
  title: "Mini réseau social",
  slug: "mini-reseau-social",
  shortDescription:
    "Faire évoluer une application full-stack au fil des apprentissages backend.",
  fullDescription:
    "Application d’apprentissage construite en plusieurs versions, avec un backend passé notamment de Laravel à Java.",
  problem:
    "Comprendre un système full-stack demande de relier authentification, données, API et interactions.",
  context:
    "Le projet sert de terrain d’évolution technique plutôt que de produit final.",
  solution:
    "Un réseau social volontairement réduit permet de comparer les choix de framework et de modélisation.",
  role: "Conception et développement dans un objectif d’apprentissage.",
  architecture: "Plusieurs itérations backend, notamment Laravel puis Java.",
  status: "COMPLETED",
  projectType: "LEARNING",
  featureLevel: "SECONDARY",
  displayOrder: 4,
  technologies: ["Laravel", "Java", "API REST"],
  features: ["Authentification", "Profils", "Publications", "Commentaires"],
  decisions: ["Conserver un périmètre réduit"],
  challenges: ["Faire évoluer le modèle"],
  learnings: ["Réécrire est utile lorsque la comparaison est explicite"],
  nextSteps: ["Documenter les différences entre versions"],
};
let projects = [base, janus, overkill, social];
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
