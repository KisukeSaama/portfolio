# Jonathan Blanchard's portfolio

A personal full-stack portfolio, administrable and deployable. The public side introduces Jonathan before his projects and tells how he turns a concrete problem into a complete application. The administration area manages the editorial cycle, the case studies and their media without touching the code.

The public site is bilingual (English / French). Code, comments and documentation are written in US English only; French exists as a translation locale.

## Stack and architecture

- **Frontend**: Next.js 16 with the App Router and React 19, Server Components, strict TypeScript, Tailwind CSS 4, React Hook Form, Zod, Vitest, Testing Library, Playwright and axe-core.
- **Backend**: Java 21, Spring Boot 4, Spring MVC, Spring Security, Spring Data JPA, Bean Validation, Flyway, PostgreSQL, Spring Session JDBC and OpenAPI.
- **Infrastructure**: Docker Compose, PostgreSQL 17, local-disk media storage on a Docker volume, and non-root Nginx as a reverse proxy. Everything is self-hosted — no managed cloud object storage.
- **Design**: a single self-hosted family, Manrope Variable, an orange OKLCH palette, a mineral light theme and a graphite dark theme.

```text
portfolio/
├── frontend/                 # public Next.js application + /admin
│   ├── app/                  # App Router, components, dictionaries and styles
│   │   ├── [locale]/         # bilingual public site (en, fr)
│   │   ├── admin/            # administration area, English only
│   │   └── i18n/             # locale config and en/fr dictionaries
│   ├── proxy.ts              # locale detection and redirect
│   ├── public/               # placeholders, favicon and manifest
│   └── tests/                # Vitest and Playwright
├── backend/                  # modular Spring Boot monolith
│   └── src/main/java/com/jonathan/portfolio/
│       ├── auth/ user/ project/ media/
│       ├── audit/ storage/ security/
│       └── common/ config/
├── deploy/                   # compose, paths and env for the GitLab CI deployment
├── infra/reverse-proxy/      # routes / to Next.js and /api to Spring
├── scripts/                  # cross-platform Gradle launcher
├── docker-compose.dev.yml
└── docker-compose.prod.yml
```

The frontend and the backend are developed and tested independently. In production they are served under the same domain: `/` for Next.js and `/api` for Spring Boot. That keeps session cookies simple and avoids a permissive CORS setup. Public pages are pre-rendered when static and server-rendered when they depend on PostgreSQL.

### Languages and URLs

Every public URL carries its locale: `/en/...` and `/fr/...`. A request without a prefix is redirected by `frontend/proxy.ts`, which picks the locale from the `portfolio-locale` cookie, then from `Accept-Language`, and falls back to English. The header/footer switcher keeps the visitor on the same page and stores their choice in the cookie.

UI copy lives in `frontend/app/i18n/dictionaries/en.ts` (the source language) and `fr.ts`. The English dictionary is the type contract: adding a key there makes TypeScript require a French translation. Project case-study content is stored once per project in the database and therefore exists in one language only; the administration area is English-only.

### SEO and public URLs

Next.js generates the global metadata and each case study's metadata server-side, along with canonical URLs, Open Graph, Twitter Cards, structured data, `robots.txt`, `sitemap.xml`, the manifest and a temporary social image. Published projects use a short URL taken from the slug: `/en/episort`, `/fr/janus`. Each sitemap entry lists both locales as alternates. The `/projects` route stays the editorial index; drafts and archives are never added to the sitemap.

## Requirements

- Node.js 22 or newer, and npm;
- Java 21;
- Docker Desktop or a compatible Docker engine for PostgreSQL, Testcontainers and the full compositions.

Gradle does not need to be installed: the wrapper is versioned in `backend/`.

## Local installation and start-up

```bash
git clone git@github.com:KisukeSaama/portfolio.git
cd portfolio
cp .env.example .env
npm install
docker compose --env-file .env -f docker-compose.dev.yml up -d postgres
npm run dev:backend
```

In a second terminal:

```bash
npm run dev:frontend
```

- Portfolio: `http://localhost:5173`
- API: `http://localhost:8080/api/v1`
- OpenAPI JSON: `http://localhost:8080/api/openapi`
- Swagger UI: `http://localhost:8080/api/docs`

To run the backend in Docker as well:

```bash
docker compose --env-file .env -f docker-compose.dev.yml --profile apps up -d --build
```

Frontend hot reload deliberately stays local so the development loop stays fast.

## Environment variables

Copy `.env.example`, then replace every flagged value. No real secret is versioned.

| Variable                                            | Purpose                                                       |
| --------------------------------------------------- | ------------------------------------------------------------- |
| `PUBLIC_SITE_URL`                                   | Public canonical URL used at deployment                       |
| `NEXT_PUBLIC_API_BASE_URL`                          | Browser-side API base, normally `/api/v1`                     |
| `INTERNAL_API_BASE_URL`                             | API base used by Next.js Server Components                    |
| `API_PROXY_TARGET`                                  | Target of the `/api` proxy used by Next.js in development     |
| `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` | PostgreSQL database                                           |
| `DATABASE_URL`                                      | Spring/CLI JDBC URL                                           |
| `SPRING_PROFILES_ACTIVE`                            | `dev`, `test` or `prod`                                       |
| `SESSION_COOKIE_SECURE`                             | `true` behind HTTPS in production                             |
| `SESSION_TIMEOUT`                                   | Session duration, `12h` by default                            |
| `ADMIN_INITIAL_EMAIL`, `ADMIN_INITIAL_PASSWORD`     | Only for the administration command                           |
| `MEDIA_DIR`                                         | Directory where uploaded media is written on disk             |
| `PROJECT_SEED_ENABLED`                              | Enables the non-destructive seed at start-up                  |
| `CONTACT_EMAIL`                                     | Reserved for a future contact integration                     |

The `ADMIN_INITIAL_*` variables are not needed for day-to-day operation and should be removed from the environment after the command runs.

## PostgreSQL, Flyway and seed

Flyway applies the migrations in `backend/src/main/resources/db/migration` automatically. Hibernate stays on `ddl-auto=validate`: it never changes the schema.

The application seed only adds missing slugs: `episort`, `janus`, `overkill` and `mini-social-network`. It never replaces a change made in the administration area, so re-running it creates no duplicate.

The main tables are:

- `admin_user` and the `SPRING_SESSION*` tables;
- `project`, with explicit enums for status, publication, visibility, type and feature level;
- the ordered collections of objectives, technologies, features, decisions, challenges, learnings and next steps;
- `project_media`, which stores references and metadata only;
- `audit_log` and `login_attempt`.

Indexes cover the slug, publication/visibility, status, order, update date, archiving, media and the log.

## Administrator account

The database must have been migrated at least once, for example by starting the backend. The commands below read credentials from the environment and hash passwords with BCrypt cost 12. The password must be at least 14 characters long.

PowerShell:

```powershell
$env:ADMIN_INITIAL_EMAIL='admin@example.invalid'
$env:ADMIN_INITIAL_PASSWORD='a-long-secret-passphrase'
node scripts/gradle.mjs -PadminCommand=create adminCli
Remove-Item Env:ADMIN_INITIAL_EMAIL
Remove-Item Env:ADMIN_INITIAL_PASSWORD
```

Under bash, use `export` then `unset`. The available operations are:

```bash
node scripts/gradle.mjs -PadminCommand=create adminCli
node scripts/gradle.mjs -PadminCommand=reset adminCli
node scripts/gradle.mjs -PadminCommand=disable adminCli
node scripts/gradle.mjs -PadminCommand=enable adminCli
node scripts/gradle.mjs -PadminCommand=delete adminCli
```

`reset`, `disable` and `delete` invalidate active sessions when needed. To rotate secrets, change the password with `reset`, renew the database secrets in the host's secret manager, then redeploy. Never put those values in a file tracked by Git.

## Administration

`/admin` is absent from the public navigation and protected by Spring Security. There is no sign-up and no public account-creation endpoint. The panel is English-only.

It provides:

- a database-backed dashboard: published, drafts, archived, missing media, incomplete content and recent changes;
- search, filters, display order, primary/secondary feature level;
- creation, editing, duplication, draft, publication, unpublication, archiving, restoration and permanent deletion confirmed by title;
- a dedicated nine-section editor, slug generation/editing, Zod and server validation, explicit saving and protection against losing changes;
- a private preview protected by the `ADMIN` session;
- media attachment by upload or external URL;
- a paginated log of sign-ins and sensitive operations.

### Main API

```text
GET  /api/v1/public/projects
GET  /api/v1/public/projects/{slug}

GET  /api/v1/auth/csrf
POST /api/v1/auth/login
GET  /api/v1/auth/session
POST /api/v1/auth/logout

GET/POST       /api/v1/admin/projects
GET/PUT/DELETE /api/v1/admin/projects/{id}
GET            /api/v1/admin/projects/{id}/preview
POST           /api/v1/admin/projects/{id}/{publish|unpublish|archive|restore|duplicate}
PUT            /api/v1/admin/projects/reorder
GET            /api/v1/admin/projects/dashboard
POST/DELETE    /api/v1/admin/media
GET            /api/v1/admin/audit
```

Public endpoints only return `PUBLISHED + PUBLIC + not archived`. Every admin mutation is authorized server-side with the `ADMIN` role and protected by CSRF.

## Security

- session persisted in PostgreSQL, `HttpOnly` cookie, `SameSite=Lax`, `Secure` in production, invalidated on sign-out;
- a CSRF cookie readable by the browser only so the token can be copied into `X-XSRF-TOKEN`;
- BCrypt cost 12, non-revealing sign-in errors and per-IP/email rate limiting, reinforced by Nginx;
- Bean Validation and business rules on every mutation;
- parameterized JPA queries; case-study content is stored as text and never injected as HTML;
- CSP, anti-framing, `nosniff`, referrer policy and restrictive permissions headers;
- a log free of passwords, tokens, cookies and secrets;
- error correlation with no stack trace exposed in production.

## Media and storage

Media is stored on the local filesystem, under the directory named by `MEDIA_DIR`, which is mounted as a Docker volume (`/var/lib/portfolio/media` in the compositions). There is no S3 or other managed object storage: this deployment is self-hosted. The backend container runs read-only apart from that volume, so the deployment pipeline chowns it to the container's UID (10001, pinned in `backend/Dockerfile`).

The backend checks authentication, MIME type, extension, size (8 MiB for images, 40 MiB for videos) and the dimensions of readable images, then generates an unpredictable UUID key. Stored media is served by the API with `nosniff`, and only media belonging to a public project can be read publicly. External URLs remain available as an alternative.

In the admin editor, pick cover, video, poster or gallery, then provide alternative text and a caption. Public videos are muted by default, controllable, paused off-screen, and only one can play at a time.

## Personal content and placeholders

- Profile identity, links and availability: `frontend/app/content/profile.ts` for locale-independent data, `frontend/app/i18n/dictionaries/*.ts` for the wording.
- Journey and skills: `journey` and `skillGroups` in each dictionary.
- Photo to replace: `frontend/public/images/profile-placeholder.svg`. Keep the path or update `profile.photo` and the `profile.photoAlt` entry in both dictionaries.
- Resume to add: `frontend/public/documents/cv-jonathan-blanchard.pdf`, then switch `cvAvailable` to `true`.
- Project media: upload it from `/admin`; the `frontend/public/images/project-placeholder.svg` placeholder is not a fake screenshot.

Actions with no data behind them are hidden or replaced by a non-clickable note: no personal link is ever invented.

## Theme and accessibility

The theme script runs before hydration to avoid a flash of the wrong theme. The first choice follows the system, then the accessible button persists `light` or `dark` in `localStorage`. The palettes are not simply inverted: surfaces, action orange, shadows and contrasts all have distinct values.

The site provides a skip link, landmarks, a logical heading order, labels and errors that are tied together, 44 px targets, visible focus, keyboard-operable menus and `prefers-reduced-motion`. Playwright also runs axe-core in light and dark themes over representative public and administration screens, in both locales.

## Tests and quality

```bash
# Frontend
npm run lint
npm run typecheck
npm run test:frontend
npm run build:frontend

# Backend
npm run test:backend
npm run build:backend

# Browser journeys (installs Chromium on first run)
npx playwright install chromium
npm run test:e2e

# Everything except E2E
npm run verify
```

The backend integration tests use Testcontainers and are skipped automatically when no Docker engine is available. With Docker running, they cover a real PostgreSQL, Flyway, authentication/session, CSRF, authorization, CRUD, the editorial cycle, public filtering, auditing and the idempotent seed.

## Build and deployment

The reference deployment:

```bash
docker compose --env-file .env -f docker-compose.prod.yml config
docker compose --env-file .env -f docker-compose.prod.yml up -d --build
```

The production composition uses multi-stage images and non-root processes wherever possible. PostgreSQL is not published. Nginx exposes local port 80; terminate TLS in the platform's proxy or add HTTPS certificates before public exposure. Then check `/actuator/health`, `/api/openapi`, `/robots.txt` and `/sitemap.xml`.

For a managed database, replace the host in `DATABASE_URL` and remove the PostgreSQL service from the composition. Media stays on the host: back up the `MEDIA_DIR` volume along with the database.

## GitLab CI/CD

The pipeline follows the DevOps group model (`docs/ci-cd-model.md`): a runner tagged `devops`, a Docker executor with the host socket, Traefik as the only reverse proxy, and paths under `/home/kisuke/`.

| Stage         | Trigger                              | Behavior                                                        |
| ------------- | ------------------------------------ | --------------------------------------------------------------- |
| `test_*`      | `develop`, merge requests, tags `v*` | Lint, typecheck, Vitest, Next.js build and Gradle tests          |
| `build`       | `develop`, tags `v*`                 | Builds and pushes `backend` and `web` to the GitLab registry     |
| `deploy_dev`  | `develop`                            | **Manual** → `https://portfolio-d.kisukesaama.com`               |
| `stop_dev`    | `develop`                            | Manual, stops DEV                                                |
| `deploy_prod` | tag `v*`                             | **Automatic** → `https://kisukesaama.com`                        |
| `stop_prod`   | tag `v*`                             | Manual, stops PROD                                               |

Production is served on the apex domain: the portfolio *is* `kisukesaama.com`. Deployment is triggered by tag only:

```bash
git tag v1.0.0
git push origin v1.0.0
```

The deployed stack (`deploy/compose.yml`) no longer contains Nginx: Next.js already rewrites `/api/*` to Spring Boot, and the security headers are set by a Traefik middleware. `infra/reverse-proxy` remains the reference for local compositions.

CI/CD variables to define in GitLab (scoped per environment, protected for production):

| Variable                         | Required | Purpose                                 |
| -------------------------------- | -------- | --------------------------------------- |
| `PORTFOLIO_POSTGRES_PASSWORD`    | yes      | PostgreSQL password for the deployment  |
| `PORTFOLIO_POSTGRES_DB/_USER`    | no       | Defaults to `portfolio`                 |
| `PORTFOLIO_PROJECT_SEED_ENABLED` | no       | Defaults to `true`                      |
| `PORTFOLIO_CONTACT_EMAIL`        | no       | Contact address                         |

The deployment job writes `${DEPLOY_DIR}/{dev,prod}/app.env` with mode `600` from those variables: no secret is versioned. The administrator account is still created manually through `adminCli`, never by the pipeline.

## Checklist before going live

- [ ] Replace the temporary photo and its alternative text in both dictionaries.
- [ ] Add the resume and switch `cvAvailable` on.
- [ ] Fill in dates, education and experience in the `journey` entries of both dictionaries.
- [ ] Fill in email, GitHub and LinkedIn without leaving a dead link.
- [ ] Upload real covers, posters, short videos and galleries from `/admin`.
- [ ] Review and enrich the case studies with Jonathan's real facts.
- [ ] Set `PUBLIC_SITE_URL` and the PostgreSQL secrets in a secret vault.
- [ ] Create the administrator, then remove `ADMIN_INITIAL_*` from the environment.
- [ ] Enable HTTPS and keep `SESSION_COOKIE_SECURE=true`.
- [ ] Back up the media volume alongside the database.
- [ ] Run lint, typecheck, tests, E2E, builds and the Docker Compose configuration.
