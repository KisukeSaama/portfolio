# Jonathan Blanchard — Portfolio

A bilingual personal portfolio built as a single Next.js application. It introduces Jonathan before
his projects, states the apprenticeship terms clearly, and presents the product and engineering
decisions behind Janus, Episort, Overkill and the mini social network.

Profile content, translations and case studies are local, typed application content. They are
versioned with the interface and shipped together in one container.

## Stack

- Next.js 16, React 19 and TypeScript 6;
- Tailwind CSS 4 plus a custom responsive design system;
- Vitest, Testing Library, Playwright and axe-core;
- Docker Compose for local and production containers;
- GitLab CI/CD and Traefik for deployment.

## Repository

```text
portfolio/
├── app/
│   ├── [locale]/              # English and French public routes
│   ├── components/            # public UI and case-study renderers
│   ├── content/               # profile and project content
│   └── i18n/                  # dictionaries and locale routing
├── public/                    # images, documents and static media
├── tests/                     # unit, integration and browser tests
├── deploy/                    # Traefik deployment composition
├── compose.yaml               # local frontend container
├── docker-compose.prod.yml    # standalone production composition
└── .gitlab-ci.yml
```

## Local development

Requirements: Node.js 24 or newer and npm.

```bash
npm ci
npm run dev
```

Open `http://localhost:5173`. An unprefixed URL is redirected to `/en` or `/fr` from the visitor’s
language preference.

The containerized build needs only Docker:

```bash
docker compose up --build
```

The optional `PUBLIC_SITE_URL` environment variable sets canonical metadata and sitemap URLs. Copy
`.env.example` to `.env` to override its local default.

## Content

- Identity, links, photo and resume: `app/content/profile.ts`.
- English interface copy: `app/i18n/dictionaries/en.ts`.
- French interface copy: `app/i18n/dictionaries/fr.ts`.
- English case studies: `app/content/projects.en.json`.
- French case studies: `app/content/projects.fr.json`.
- Profile photo: `public/images/jonathan-blanchard.jpg`.
- Resume: `public/documents/cv-jonathan-blanchard.pdf`.

The two project JSON files use the same slugs. Edit both when changing a case study, keep their order
aligned, and place project media under `public` before referencing it from a `media` entry.

## Routes and rendering

The public site provides localized home, about, journey, projects, contact and legal pages, one route
per project slug, generated metadata, Open Graph data, JSON-LD, `robots.txt` and `sitemap.xml`.

Project content is imported during the Next.js build, so every public route is served by the same
self-contained application.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
npm run verify
```

Playwright checks public navigation, locale switching, theming, responsive overflow and WCAG rules in
light and dark themes. The application also provides semantic landmarks, keyboard navigation,
visible focus, reduced-motion handling and per-request CSP nonces.

## Deployment

For a standalone host:

```bash
PUBLIC_SITE_URL=https://example.com docker compose -f docker-compose.prod.yml up -d --build
```

The GitLab pipeline runs the frontend checks, builds a single `web` image and deploys it with
`deploy/compose.yml`. Traefik terminates TLS and applies the response-security headers. The container
runs read-only as a non-root user and needs no persistent volume or application secret.

## Before going live

- [ ] Name the hosting provider in both legal-notice dictionaries.
- [ ] Add real covers, screenshots and videos under `public`.
- [ ] Verify the public URL used by metadata and the sitemap.
- [ ] Run `npm run verify` and `npm run test:e2e`.
