import "@fontsource-variable/manrope";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { profile } from "~/content/profile";
import "./styles/global.css";

const siteUrl = process.env.PUBLIC_SITE_URL ?? "http://localhost:5173";
const themeScript = `(()=>{try{const saved=localStorage.getItem('jonathan-theme');const theme=saved==='light'||saved==='dark'?saved:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme}catch{}})()`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Jonathan Blanchard — Développeur full-stack",
    template: "%s — Jonathan Blanchard",
  },
  description: profile.tagline,
  applicationName: "Portfolio de Jonathan Blanchard",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Jonathan Blanchard",
    title: "Jonathan Blanchard — Développeur full-stack",
    description: "Des applications complètes, de l’idée au déploiement.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jonathan Blanchard — Développeur full-stack",
    description: "Des applications complètes, de l’idée au déploiement.",
  },
  icons: { icon: "/favicon.svg" },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5efe5" },
    { media: "(prefers-color-scheme: dark)", color: "#20211f" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Aller au contenu
        </a>
        {children}
      </body>
    </html>
  );
}
