import "@fontsource-variable/manrope";
import "./styles/global.css";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from "react-router";
import type { Route } from "./+types/root";

const themeScript = `(()=>{try{const saved=localStorage.getItem('jonathan-theme');const theme=saved==='light'||saved==='dark'?saved:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme}catch{}})()`;

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  { rel: "manifest", href: "/manifest.webmanifest" },
];
export const meta: Route.MetaFunction = () => [
  { title: "Jonathan Blanchard — Développeur full-stack" },
  {
    name: "description",
    content:
      "Portfolio de Jonathan Blanchard, développeur full-stack et créateur d’applications répondant à des problèmes concrets.",
  },
  { property: "og:type", content: "website" },
  {
    property: "og:title",
    content: "Jonathan Blanchard — Développeur full-stack",
  },
  {
    property: "og:description",
    content: "Des applications complètes, de l’idée au déploiement.",
  },
  { name: "twitter:card", content: "summary_large_image" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,viewport-fit=cover"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Meta />
        <Links />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Aller au contenu
        </a>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
export default function App() {
  return <Outlet />;
}
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const status = isRouteErrorResponse(error) ? error.status : 500;
  return (
    <main id="main-content" className="error-page">
      <div>
        <p className="error-code">{status}</p>
        <h1>La page n’a pas pu être chargée.</h1>
        <p>
          Le service est peut-être momentanément indisponible. Vous pouvez
          revenir à l’accueil et réessayer.
        </p>
        <a className="button button-primary" href="/">
          Retour à l’accueil
        </a>
      </div>
    </main>
  );
}
