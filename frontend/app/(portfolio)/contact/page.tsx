import type { Metadata } from "next";
import { profile } from "~/content/profile";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Échanger avec Jonathan Blanchard au sujet d’une alternance ou d’un projet full-stack.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <header className="page-hero">
        <div className="shell">
          <h1>Échanger simplement.</h1>
          <p>
            Pour une alternance, une opportunité ou une discussion produit, les
            coordonnées seront affichées ici dès qu’elles auront été
            renseignées.
          </p>
        </div>
      </header>
      <section className="section">
        <div className="shell readable">
          <h2 className="section-heading">Moyens de contact</h2>
          {profile.email ? (
            <p>
              <a
                className="button button-primary"
                href={`mailto:${profile.email}`}
              >
                Envoyer un e-mail
              </a>
            </p>
          ) : (
            <p className="form-error">
              Adresse e-mail à renseigner dans{" "}
              <code>frontend/app/content/profile.ts</code>. Aucun formulaire
              externe fictif n’est activé.
            </p>
          )}
          {profile.githubUrl && (
            <p>
              <a className="text-link" href={profile.githubUrl}>
                GitHub
              </a>
            </p>
          )}
          {profile.linkedinUrl && (
            <p>
              <a className="text-link" href={profile.linkedinUrl}>
                LinkedIn
              </a>
            </p>
          )}
          {profile.cvAvailable ? (
            <p>
              <a className="button button-secondary" href={profile.cvUrl}>
                Consulter le CV
              </a>
            </p>
          ) : (
            <p className="muted">
              Le CV sera disponible après ajout du fichier documenté dans le
              README.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
