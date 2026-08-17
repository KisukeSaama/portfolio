# Portfolio de Jonathan Blanchard

Portfolio personnel full-stack, administrable et déployable. La partie publique présente Jonathan avant ses projets et raconte sa manière de transformer un problème concret en application complète. L’administration permet de gérer le cycle éditorial, les études de cas et leurs médias sans modifier le code.

## Stack et architecture

- **Frontend** : Next.js 16 avec App Router et React 19, Server Components, TypeScript strict, Tailwind CSS 4, React Hook Form, Zod, Vitest, Testing Library, Playwright et axe-core.
- **Backend** : Java 21, Spring Boot 4, Spring MVC, Spring Security, Spring Data JPA, Bean Validation, Flyway, PostgreSQL, Spring Session JDBC, OpenAPI et AWS SDK S3.
- **Infrastructure** : Docker Compose, PostgreSQL 17, MinIO en développement, stockage compatible S3 en production et Nginx non-root comme reverse proxy.
- **Design** : une seule famille, Manrope Variable auto-hébergée, palette orange en OKLCH, thème clair minéral et thème sombre graphite.

```text
portfolio/
├── frontend/                 # application Next.js publique + /admin
│   ├── app/                  # App Router, composants, contenu et styles
│   ├── public/               # placeholders, favicon et manifest
│   └── tests/                # Vitest et Playwright
├── backend/                  # monolithe Spring Boot modulaire
│   └── src/main/java/com/jonathan/portfolio/
│       ├── auth/ user/ project/ media/
│       ├── audit/ storage/ security/
│       └── common/ config/
├── infra/reverse-proxy/      # routage / vers Next.js et /api vers Spring
├── scripts/                  # lanceur Gradle multiplateforme
├── docker-compose.dev.yml
└── docker-compose.prod.yml
```

Le frontend et le backend se développent et se testent indépendamment. En production, ils sont servis sous le même domaine : `/` pour Next.js et `/api` pour Spring Boot. Cela simplifie les cookies de session et évite un CORS permissif. Les pages publiques sont pré-rendues lorsqu’elles sont statiques et rendues côté serveur lorsqu’elles dépendent de PostgreSQL.

### SEO et URLs publiques

Next.js génère les métadonnées globales et celles de chaque étude de cas côté serveur, ainsi que les canonical, Open Graph, Twitter Cards, données structurées, `robots.txt`, `sitemap.xml`, manifest et image sociale temporaire. Les projets publiés utilisent une URL courte directement issue du slug : `/episort`, `/janus`, `/overkill`. La route `/projects` reste l’index éditorial ; les brouillons et archives ne sont jamais ajoutés au sitemap.

## Prérequis

- Node.js 22 ou plus récent et npm ;
- Java 21 ;
- Docker Desktop ou un moteur Docker compatible pour PostgreSQL, MinIO, Testcontainers et les compositions complètes.

Gradle n’a pas besoin d’être installé : le wrapper est versionné dans `backend/`.

## Installation et lancement local

```bash
git clone git@github.com:KisukeSaama/portfolio.git
cd portfolio
cp .env.example .env
npm install
docker compose --env-file .env -f docker-compose.dev.yml up -d postgres minio minio-init
npm run dev:backend
```

Dans un second terminal :

```bash
npm run dev:frontend
```

- Portfolio : `http://localhost:5173`
- API : `http://localhost:8080/api/v1`
- OpenAPI JSON : `http://localhost:8080/api/openapi`
- Swagger UI : `http://localhost:8080/api/docs`
- Console MinIO : `http://localhost:9001`

Pour lancer également le backend dans Docker :

```bash
docker compose --env-file .env -f docker-compose.dev.yml --profile apps up -d --build
```

Le hot reload frontend reste volontairement local afin de ne pas alourdir la boucle de développement.

## Variables d’environnement

Copier `.env.example` puis remplacer toutes les valeurs signalées. Aucun secret réel n’est versionné.

| Variable                                            | Usage                                                      |
| --------------------------------------------------- | ---------------------------------------------------------- |
| `PUBLIC_SITE_URL`                                   | URL canonique publique utilisée au déploiement             |
| `NEXT_PUBLIC_API_BASE_URL`                          | Base API côté navigateur, normalement `/api/v1`            |
| `INTERNAL_API_BASE_URL`                             | Base API utilisée par les Server Components Next.js        |
| `API_PROXY_TARGET`                                  | Cible du proxy `/api` utilisé par Next.js en développement |
| `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` | Base PostgreSQL                                            |
| `DATABASE_URL`                                      | URL JDBC Spring/CLI                                        |
| `SPRING_PROFILES_ACTIVE`                            | `dev`, `test` ou `prod`                                    |
| `SESSION_COOKIE_SECURE`                             | `true` derrière HTTPS en production                        |
| `SESSION_TIMEOUT`                                   | Durée de session, `12h` par défaut                         |
| `ADMIN_INITIAL_EMAIL`, `ADMIN_INITIAL_PASSWORD`     | Uniquement pour la commande d’administration               |
| `S3_BUCKET`, `S3_REGION`, `S3_ENDPOINT`             | Stockage compatible S3                                     |
| `S3_ACCESS_KEY`, `S3_SECRET_KEY`                    | Identifiants S3, uniquement côté backend                   |
| `S3_PUBLIC_BASE_URL`                                | Base publique éventuelle du stockage                       |
| `MINIO_ROOT_USER`, `MINIO_ROOT_PASSWORD`            | MinIO local                                                |
| `PROJECT_SEED_ENABLED`                              | Active le seed non destructif au démarrage                 |
| `CONTACT_EMAIL`                                     | Réservé à une future intégration du contact                |

Les variables `ADMIN_INITIAL_*` ne sont pas nécessaires au fonctionnement quotidien et doivent être supprimées de l’environnement après la commande.

## PostgreSQL, Flyway et seed

Flyway applique automatiquement les migrations de `backend/src/main/resources/db/migration`. Hibernate reste en `ddl-auto=validate` : il ne modifie pas le schéma.

Le seed applicatif ajoute uniquement les slugs absents : `episort`, `janus`, `overkill` et `mini-reseau-social`. Il ne contient pas Overly et ne remplace jamais une modification faite dans l’administration. Une réexécution ne crée donc pas de doublon.

Les tables principales sont :

- `admin_user` et les tables `SPRING_SESSION*` ;
- `project` avec enums explicites de statut, publication, visibilité, type et mise en avant ;
- les collections ordonnées d’objectifs, technologies, fonctionnalités, décisions, difficultés, apprentissages et prochaines étapes ;
- `project_media`, qui ne stocke que les références et métadonnées ;
- `audit_log` et `login_attempt`.

Des index couvrent le slug, la publication/visibilité, le statut, l’ordre, la date de modification, l’archivage, les médias et le journal.

## Compte administrateur

La base doit avoir été migrée au moins une fois, par exemple en démarrant le backend. Les commandes suivantes lisent les identifiants dans l’environnement et hachent les mots de passe avec BCrypt coût 12. Le mot de passe doit contenir au moins 14 caractères.

PowerShell :

```powershell
$env:ADMIN_INITIAL_EMAIL='admin@example.invalid'
$env:ADMIN_INITIAL_PASSWORD='une-phrase-secrete-longue'
node scripts/gradle.mjs -PadminCommand=create adminCli
Remove-Item Env:ADMIN_INITIAL_EMAIL
Remove-Item Env:ADMIN_INITIAL_PASSWORD
```

Sous bash, utiliser `export` puis `unset`. Les opérations disponibles sont :

```bash
node scripts/gradle.mjs -PadminCommand=create adminCli
node scripts/gradle.mjs -PadminCommand=reset adminCli
node scripts/gradle.mjs -PadminCommand=disable adminCli
node scripts/gradle.mjs -PadminCommand=enable adminCli
node scripts/gradle.mjs -PadminCommand=delete adminCli
```

`reset`, `disable` et `delete` invalident les sessions actives lorsque nécessaire. Pour faire tourner les secrets, changer le mot de passe via `reset`, renouveler les identifiants S3 et les secrets de base dans le gestionnaire de secrets de l’hébergeur, puis redéployer. Ne jamais placer ces valeurs dans un fichier suivi par Git.

## Administration

`/admin` est absent de la navigation publique et protégé par Spring Security. Il n’existe ni inscription ni endpoint de création de compte public.

Le panel comprend :

- tableau de bord issu de la base : publiés, brouillons, archivés, médias manquants, contenu incomplet et modifications récentes ;
- recherche, filtres, ordre d’affichage, niveau principal/secondaire ;
- création, édition, duplication, brouillon, publication, dépublication, archivage, restauration et suppression définitive confirmée par le titre ;
- éditeur spécialisé en neuf sections, génération/modification du slug, validation Zod et serveur, sauvegarde explicite et protection contre la perte des changements ;
- prévisualisation privée protégée par la session `ADMIN` ;
- association de médias par envoi ou URL externe ;
- journal paginé des connexions et opérations sensibles.

### API principale

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

Les endpoints publics ne retournent que `PUBLISHED + PUBLIC + non archivé`. Toutes les mutations admin sont autorisées côté serveur avec le rôle `ADMIN` et protégées par CSRF.

## Sécurité

- session persistée en PostgreSQL, cookie `HttpOnly`, `SameSite=Lax`, `Secure` en production et invalidation à la déconnexion ;
- cookie CSRF lisible par le navigateur uniquement pour recopier le jeton dans `X-XSRF-TOKEN` ;
- BCrypt coût 12, erreurs de connexion non révélatrices et limitation par IP/e-mail, renforcée par Nginx ;
- validation Bean Validation et règles métier sur chaque mutation ;
- requêtes JPA paramétrées, contenus d’étude de cas stockés comme texte et jamais injectés comme HTML ;
- en-têtes CSP, anti-framing, `nosniff`, politique de référent et permissions restrictives ;
- journal sans mot de passe, jeton, cookie ou secret ;
- corrélation des erreurs sans stack trace exposée en production.

## Médias et stockage

MinIO simule S3 en développement. En production, renseigner un endpoint S3 ou compatible S3 ; aucune clé n’est transmise au frontend.

Le backend vérifie l’authentification, le type MIME, l’extension, la taille (8 Mio image, 40 Mio vidéo), les dimensions des images lisibles et génère une clé UUID imprévisible. Les médias stockés sont servis par l’API avec `nosniff`; seuls ceux d’un projet public peuvent être lus publiquement. Les URLs externes restent possibles quand le stockage n’est pas configuré.

Dans l’éditeur admin, choisir couverture, vidéo, poster ou galerie, puis fournir un texte alternatif et une légende. Les vidéos publiques sont muettes par défaut, contrôlables, mises en pause hors écran et une seule peut être lue à la fois.

## Contenu personnel et placeholders

- Profil, coordonnées et disponibilité : `frontend/app/content/profile.ts`.
- Parcours : `frontend/app/content/journey.ts`.
- Compétences : `frontend/app/content/skills.ts`.
- Photo à remplacer : `frontend/public/images/profile-placeholder.svg`. Conserver le chemin ou mettre à jour `profile.photo` et son texte alternatif.
- CV à ajouter : `frontend/public/documents/cv-jonathan-blanchard.pdf`, puis passer `cvAvailable` à `true`.
- Médias de projet : à charger depuis `/admin`; le placeholder `frontend/public/images/project-placeholder.svg` n’est pas une fausse capture.

Les actions sans donnée sont masquées ou remplacées par une indication non cliquable : aucun lien personnel n’est inventé.

## Thème et accessibilité

Le script de thème est exécuté avant l’hydratation afin d’éviter le flash du mauvais thème. Le premier choix suit le système, puis le bouton accessible persiste `light` ou `dark` dans `localStorage`. Les palettes ne sont pas inversées : surfaces, orange d’action, ombres et contrastes ont des valeurs distinctes.

Le site fournit un lien d’évitement, des landmarks, un ordre de titres logique, des labels et erreurs reliés, des cibles de 44 px, des focus visibles, des menus clavier et `prefers-reduced-motion`. Playwright exécute aussi axe-core en clair et sombre sur des écrans publics et administratifs représentatifs.

## Tests et qualité

```bash
# Frontend
npm run lint
npm run typecheck
npm run test:frontend
npm run build:frontend

# Backend
npm run test:backend
npm run build:backend

# Parcours navigateur (installe Chromium la première fois)
npx playwright install chromium
npm run test:e2e

# Ensemble hors E2E
npm run verify
```

Les tests backend d’intégration utilisent Testcontainers et sont automatiquement ignorés lorsqu’aucun moteur Docker n’est disponible. Avec Docker actif, ils couvrent PostgreSQL réel, Flyway, authentification/session, CSRF, autorisations, CRUD, cycle éditorial, filtrage public, audit et seed idempotent.

## Build et déploiement

Le déploiement de référence :

```bash
docker compose --env-file .env -f docker-compose.prod.yml config
docker compose --env-file .env -f docker-compose.prod.yml up -d --build
```

La composition de production utilise des images multi-stage et des processus non-root lorsque possible. PostgreSQL n’est pas publié. Nginx expose le port 80 local ; terminer TLS dans le proxy de la plateforme ou ajouter les certificats HTTPS avant exposition publique. Vérifier ensuite `/actuator/health`, `/api/openapi`, `/robots.txt` et `/sitemap.xml`.

Pour une base managée, remplacer l’hôte de `DATABASE_URL` et retirer le service PostgreSQL de la composition. Pour un stockage S3 managé, renseigner l’endpoint/région/bucket et ne jamais utiliser les identifiants MinIO de développement.

## Checklist avant mise en ligne

- [ ] Remplacer la photo temporaire et son texte alternatif.
- [ ] Ajouter le CV et activer `cvAvailable`.
- [ ] Compléter dates, formation et expérience dans `journey.ts`.
- [ ] Renseigner e-mail, GitHub et LinkedIn sans laisser de lien mort.
- [ ] Charger couvertures, posters, vidéos courtes et galeries réelles depuis `/admin`.
- [ ] Vérifier et enrichir les études de cas avec les faits réels de Jonathan.
- [ ] Définir `PUBLIC_SITE_URL`, les secrets PostgreSQL et S3 dans un coffre de secrets.
- [ ] Créer l’administrateur puis supprimer `ADMIN_INITIAL_*` de l’environnement.
- [ ] Activer HTTPS et conserver `SESSION_COOKIE_SECURE=true`.
- [ ] Exécuter lint, typecheck, tests, E2E, builds et la configuration Docker Compose.
