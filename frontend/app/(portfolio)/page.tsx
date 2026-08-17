import { ArrowRight, FileText } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactPanel } from "~/components/contact-panel";
import { FeaturedProjects, SecondaryProjects } from "~/components/project-list";
import { journey } from "~/content/journey";
import { personalIntroduction, profile } from "~/content/profile";
import { skillGroups } from "~/content/skills";
import { serverApi } from "~/lib/server-api";
import type { Project } from "~/types/api";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Développeur full-stack & créateur d’applications",
  description: profile.tagline,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const projects = await serverApi<Project[]>("/public/projects", {
    revalidate: 0,
  });
  const primary = projects.filter(
    (project) => project.featureLevel === "PRIMARY",
  );
  const secondary = projects.filter(
    (project) => project.featureLevel === "SECONDARY",
  );

  return (
    <>
      <section className="hero">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="hero-name">{profile.name}</p>
            <h1>{profile.title}</h1>
            <p className="hero-statement">{profile.tagline}</p>
            <p className="hero-availability">{profile.availability}</p>
            <div className="hero-actions">
              <Link href="/about" className="button button-primary">
                Découvrir mon approche <ArrowRight size={18} aria-hidden />
              </Link>
              {profile.cvAvailable ? (
                <a
                  href={profile.cvUrl}
                  className="button button-secondary"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FileText size={18} aria-hidden /> Consulter mon CV
                </a>
              ) : (
                <Link href="/contact" className="button button-secondary">
                  Me contacter
                </Link>
              )}
            </div>
          </div>
          <div className="portrait-frame">
            <Image
              src={profile.photo}
              alt={profile.photoAlt}
              width={800}
              height={1000}
              priority
              sizes="(max-width: 760px) 82vw, 38vw"
            />
          </div>
        </div>
      </section>

      <section className="intro-section section" aria-labelledby="intro-title">
        <div className="shell intro-grid">
          <h2 id="intro-title" className="intro-title">
            Comprendre avant de construire.
          </h2>
          <div className="intro-copy">
            {personalIntroduction.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="approach-title">
        <div className="shell">
          <h2 id="approach-title" className="section-heading">
            Une application est un ensemble de décisions.
          </h2>
          <p className="section-lede">
            Jonathan relie l’usage, l’interface, les règles métier et
            l’exploitation pour que la solution reste cohérente du premier écran
            au déploiement.
          </p>
          <div className="principles">
            <div className="principle">
              <h3>Partir de la gêne réelle</h3>
              <p>
                Observer les erreurs, les hésitations et les risques avant de
                dessiner une fonctionnalité.
              </p>
            </div>
            <div className="principle">
              <h3>Rendre les choix explicables</h3>
              <p>
                Préférer les comportements compréhensibles aux automatismes
                opaques, notamment lorsque l’action est sensible.
              </p>
            </div>
            <div className="principle">
              <h3>Relier toutes les couches</h3>
              <p>
                Faire évoluer l’interface, l’API, les données et
                l’infrastructure comme un même produit.
              </p>
            </div>
            <div className="principle">
              <h3>Aller jusqu’au fonctionnement réel</h3>
              <p>
                Tester, journaliser, conteneuriser et préparer le déploiement
                plutôt que s’arrêter à la démonstration.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="journey-title">
        <div className="shell">
          <h2 id="journey-title" className="section-heading">
            Un parcours construit en avançant.
          </h2>
          <ol className="journey-list">
            {journey.map((item) => (
              <li className="journey-item" key={item.title}>
                <span className="journey-period">{item.period}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  {item.placeholder && (
                    <span className="placeholder-note">
                      Informations de parcours à compléter
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ol>
          <p>
            <Link href="/journey" className="text-link">
              Voir le parcours complet <ArrowRight size={16} aria-hidden />
            </Link>
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="projects-title">
        <div className="shell">
          <h2 id="projects-title" className="section-heading">
            Des projets pensés comme des produits.
          </h2>
          <p className="section-lede">
            Chaque étude de cas commence par le besoin, puis montre la solution,
            les choix et ce qu’il reste à apprendre.
          </p>
          <FeaturedProjects projects={primary} />
          <SecondaryProjects projects={secondary} />
          <p>
            <Link href="/projects" className="button button-secondary">
              Voir tous les projets
            </Link>
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="skills-title">
        <div className="shell">
          <h2 id="skills-title" className="section-heading">
            Des compétences reliées à l’usage.
          </h2>
          <div className="skills-list">
            {skillGroups.map((group) => (
              <article className="skill-group" key={group.title}>
                <h3>{group.title}</h3>
                <p>{group.summary}</p>
                <p className="skill-names">{group.skills.join(" · ")}</p>
                <p className="skill-proof">
                  Mises en pratique dans : {group.proof}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <ContactPanel />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: profile.name,
            jobTitle: "Développeur full-stack",
            description: profile.tagline,
          }),
        }}
      />
    </>
  );
}
