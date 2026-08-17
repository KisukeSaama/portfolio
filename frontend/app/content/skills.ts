export const skillGroups = [
  {
    title: "Interfaces",
    summary:
      "Construire des parcours lisibles, accessibles et reliés aux règles métier.",
    skills: ["React", "TypeScript", "JavaScript", "JavaFX"],
    proof: "Episort, Overkill, mini réseau social",
  },
  {
    title: "Services & API",
    summary:
      "Modéliser les accès, les permissions et les échanges entre applications.",
    skills: [
      "Java",
      "Spring Boot",
      "Spring Security",
      "API REST",
      "PHP",
      "Laravel",
      "Symfony",
    ],
    proof: "Janus, Overkill, mini réseau social",
  },
  {
    title: "Données",
    summary: "Structurer la persistance selon les besoins du produit.",
    skills: ["PostgreSQL", "MySQL", "MongoDB"],
    proof: "Janus, Overkill, mini réseau social",
  },
  {
    title: "Exploitation",
    summary:
      "Préparer des environnements reproductibles et aller jusqu’au déploiement.",
    skills: ["Docker", "Git", "Linux"],
    proof: "Janus, Overkill",
  },
  {
    title: "Conception produit",
    summary:
      "Partir du problème, encadrer les actions sensibles et prévoir les cas ambigus.",
    skills: ["Analyse du besoin", "Modélisation", "Sécurité par conception"],
    proof: "Episort, Janus",
  },
] as const;
