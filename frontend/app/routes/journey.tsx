import type { MetaFunction } from "react-router";
import { ContactPanel } from "~/components/contact-panel";
import { journey } from "~/content/journey";
export const meta: MetaFunction = () => [
  { title: "Parcours — Jonathan Blanchard" },
  {
    name: "description",
    content:
      "Reconversion, apprentissage par les projets et recherche d’une alternance full-stack.",
  },
  { tagName: "link", rel: "canonical", href: "/journey" },
];
export default function Journey() {
  return (
    <>
      <header className="page-hero">
        <div className="shell">
          <h1>Apprendre en construisant.</h1>
          <p>
            Un parcours de reconversion et de progression technique, nourri par
            des applications complètes et l’envie de rejoindre une équipe
            professionnelle.
          </p>
        </div>
      </header>
      <section className="section">
        <div className="shell">
          <ol className="journey-list">
            {journey.map((item) => (
              <li className="journey-item" key={item.title}>
                <span className="journey-period">{item.period}</span>
                <div>
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                  {item.placeholder && (
                    <span className="placeholder-note">
                      Formation, dates et expérience à compléter dans
                      app/content/journey.ts
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <ContactPanel />
    </>
  );
}
