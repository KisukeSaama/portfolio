import type { Metadata } from "next";
import { ContactPanel } from "~/components/contact-panel";
import { personalIntroduction } from "~/content/profile";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "La démarche de Jonathan Blanchard : comprendre un problème concret avant de construire l’application complète.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <header className="page-hero">
        <div className="shell">
          <h1>Une approche full-stack guidée par l’usage.</h1>
          <p>
            Jonathan ne choisit pas une technologie pour remplir une liste. Il
            cherche d’abord ce qui doit devenir plus simple, plus sûr ou plus
            lisible.
          </p>
        </div>
      </header>
      <section className="section">
        <div className="shell intro-grid">
          <h2 className="section-heading">De l’idée au comportement réel.</h2>
          <div className="intro-copy">
            {personalIntroduction.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
        </div>
      </section>
      <section className="section-compact">
        <div className="shell">
          <div className="principles">
            <article className="principle">
              <h3>Produit</h3>
              <p>
                Clarifier le besoin, le périmètre et les cas limites avant
                d’ajouter des fonctionnalités.
              </p>
            </article>
            <article className="principle">
              <h3>Frontend</h3>
              <p>
                Transformer les règles en parcours compréhensibles, accessibles
                et efficaces.
              </p>
            </article>
            <article className="principle">
              <h3>Backend</h3>
              <p>
                Modéliser les données, les permissions, les erreurs et les
                transitions de manière explicite.
              </p>
            </article>
            <article className="principle">
              <h3>Exploitation</h3>
              <p>
                Préparer les environnements, la persistance, les journaux et le
                déploiement comme une partie du produit.
              </p>
            </article>
          </div>
        </div>
      </section>
      <ContactPanel />
    </>
  );
}
