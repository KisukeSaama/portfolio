import type { Dictionary } from "./en";

export const fr: Dictionary = {
  htmlLang: "fr",
  ogLocale: "fr_FR",

  site: {
    titleDefault: "Jonathan Blanchard — Développeur full-stack",
    titleTemplate: "%s — Jonathan Blanchard",
    applicationName: "Portfolio de Jonathan Blanchard",
    ogDescription: "Des applications complètes, de l’idée au déploiement.",
    skipToContent: "Aller au contenu",
    jobTitle: "Développeur full-stack",
  },

  nav: {
    home: "Accueil",
    about: "À propos",
    journey: "Parcours",
    projects: "Projets",
    contact: "Contact",
    resume: "CV",
    viewResume: "Consulter le CV",
    homeAriaLabel: "Jonathan Blanchard — accueil",
    primary: "Navigation principale",
    mobile: "Navigation mobile",
    openMenu: "Ouvrir le menu",
    theme: "Thème",
    language: "Langue",
  },

  theme: {
    toLight: "Activer le thème clair",
    toDark: "Activer le thème sombre",
  },

  profile: {
    title: "Développeur full-stack & créateur d’applications",
    tagline:
      "Je conçois des applications complètes pour répondre à des problèmes concrets, de l’idée à l’interface, du backend jusqu’au déploiement.",
    availability:
      "Je recherche une alternance en développement full-stack pour progresser au contact d’une équipe et contribuer à des produits utiles.",
    photoAlt:
      "Emplacement réservé pour le futur portrait professionnel de Jonathan Blanchard",
  },

  introduction: [
    "J’aime commencer par une situation qui résiste : des fichiers difficiles à organiser, des secrets dispersés, des offres impossibles à suivre. Avant de choisir une technologie, je cherche à comprendre ce qui gêne réellement l’utilisateur.",
    "Je transforme ensuite cette compréhension en produit complet. Je travaille l’interface, les règles métier, les données et le déploiement comme les parties d’un même système — avec une attention particulière aux cas ambigus, à la sécurité et à la reprise en cas d’erreur.",
    "Mes projets personnels sont mon terrain d’exploration. Ils me permettent de construire au-delà d’un exercice isolé, de confronter mes décisions à l’usage et d’apprendre à terminer proprement ce que j’entreprends.",
  ],

  journey: [
    {
      title: "Reconversion vers le développement",
      period: "Point de départ",
      description:
        "Une transition professionnelle construite autour de l’envie de comprendre les systèmes et de fabriquer des outils utiles. Les informations précises de formation et d’expérience seront complétées par Jonathan.",
    },
    {
      title: "Apprendre par des applications complètes",
      period: "Progression technique",
      description:
        "Des premières applications web au desktop, Jonathan fait évoluer ses projets pour pratiquer l’interface, le backend, les données, la sécurité et l’exploitation dans un même contexte.",
    },
    {
      title: "Construire avec une équipe professionnelle",
      period: "Prochaine étape",
      description:
        "Rejoindre une équipe en alternance, contribuer à un produit réel, recevoir des retours exigeants et continuer à progresser sur l’ensemble de la chaîne de développement.",
    },
  ],

  skillGroups: [
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
  ],

  home: {
    metaTitle: "Développeur full-stack & créateur d’applications",
    discoverApproach: "Découvrir mon approche",
    viewResume: "Consulter mon CV",
    contactMe: "Me contacter",
    introTitle: "Comprendre avant de construire.",
    approachTitle: "Une application est un ensemble de décisions.",
    approachLede:
      "Jonathan relie l’usage, l’interface, les règles métier et l’exploitation pour que la solution reste cohérente du premier écran au déploiement.",
    principles: [
      {
        title: "Partir de la gêne réelle",
        body: "Observer les erreurs, les hésitations et les risques avant de dessiner une fonctionnalité.",
      },
      {
        title: "Rendre les choix explicables",
        body: "Préférer les comportements compréhensibles aux automatismes opaques, notamment lorsque l’action est sensible.",
      },
      {
        title: "Relier toutes les couches",
        body: "Faire évoluer l’interface, l’API, les données et l’infrastructure comme un même produit.",
      },
      {
        title: "Aller jusqu’au fonctionnement réel",
        body: "Tester, journaliser, conteneuriser et préparer le déploiement plutôt que s’arrêter à la démonstration.",
      },
    ],
    journeyTitle: "Un parcours construit en avançant.",
    journeyPlaceholder: "Informations de parcours à compléter",
    fullJourney: "Voir le parcours complet",
    projectsTitle: "Des projets pensés comme des produits.",
    projectsLede:
      "Chaque étude de cas commence par le besoin, puis montre la solution, les choix et ce qu’il reste à apprendre.",
    allProjects: "Voir tous les projets",
    skillsTitle: "Des compétences reliées à l’usage.",
    skillProof: "Mises en pratique dans :",
  },

  about: {
    metaTitle: "À propos",
    metaDescription:
      "La démarche de Jonathan Blanchard : comprendre un problème concret avant de construire l’application complète.",
    heroTitle: "Une approche full-stack guidée par l’usage.",
    heroBody:
      "Jonathan ne choisit pas une technologie pour remplir une liste. Il cherche d’abord ce qui doit devenir plus simple, plus sûr ou plus lisible.",
    sectionTitle: "De l’idée au comportement réel.",
    pillars: [
      {
        title: "Produit",
        body: "Clarifier le besoin, le périmètre et les cas limites avant d’ajouter des fonctionnalités.",
      },
      {
        title: "Frontend",
        body: "Transformer les règles en parcours compréhensibles, accessibles et efficaces.",
      },
      {
        title: "Backend",
        body: "Modéliser les données, les permissions, les erreurs et les transitions de manière explicite.",
      },
      {
        title: "Exploitation",
        body: "Préparer les environnements, la persistance, les journaux et le déploiement comme une partie du produit.",
      },
    ],
  },

  journeyPage: {
    metaTitle: "Parcours",
    metaDescription:
      "Reconversion, apprentissage par les projets et recherche d’une alternance full-stack.",
    heroTitle: "Apprendre en construisant.",
    heroBody:
      "Un parcours de reconversion et de progression technique, nourri par des applications complètes et l’envie de rejoindre une équipe professionnelle.",
    placeholder:
      "Formation, dates et expérience à compléter dans app/i18n/dictionaries",
  },

  projectsPage: {
    metaTitle: "Projets",
    metaDescription:
      "Episort, Janus, Overkill et les projets full-stack de Jonathan Blanchard.",
    heroTitle: "Des applications face à des problèmes concrets.",
    heroBody:
      "Les technologies comptent, mais seulement lorsqu’elles rendent la solution plus claire, plus sûre ou plus durable.",
    otherGrounds: "Autres terrains d’apprentissage",
  },

  contact: {
    metaTitle: "Contact",
    metaDescription:
      "Échanger avec Jonathan Blanchard au sujet d’une alternance ou d’un projet full-stack.",
    heroTitle: "Échanger simplement.",
    heroBody:
      "Pour une alternance, une opportunité ou une discussion produit, les coordonnées seront affichées ici dès qu’elles auront été renseignées.",
    sectionTitle: "Moyens de contact",
    sendEmail: "Envoyer un e-mail",
    emailMissing:
      "Adresse e-mail à renseigner dans {file}. Aucun formulaire externe fictif n’est activé.",
    resumeMissing:
      "Le CV sera disponible après ajout du fichier documenté dans le README.",
    viewResume: "Consulter le CV",
  },

  legal: {
    metaTitle: "Mentions légales",
    heroTitle: "Mentions légales",
    heroBody:
      "Les informations dépendant du futur hébergeur et du domaine restent à compléter avant mise en ligne.",
    publisher: "Éditeur",
    publisherBody: "Jonathan Blanchard — coordonnées à compléter.",
    hosting: "Hébergement",
    hostingBody:
      "Hébergeur, adresse et contact à compléter après choix de la plateforme.",
    data: "Données et administration",
    dataBody:
      "Le site public ne dépose aucun cookie de suivi. L’espace d’administration utilise un cookie de session strictement nécessaire et un jeton CSRF.",
  },

  contactPanel: {
    title: "Construisons la prochaine étape.",
    body: "Une alternance, un produit à faire avancer ou simplement une discussion sur une application utile : Jonathan est ouvert aux échanges professionnels.",
    write: "Écrire à Jonathan",
    seeContact: "Voir les moyens de contact",
    missing: "Adresse de contact à renseigner.",
  },

  projects: {
    status: {
      CONCEPT: "Conception",
      IN_PROGRESS: "En développement",
      MAINTAINED: "Maintenu",
      COMPLETED: "Réalisé",
    },
    type: {
      PERSONAL: "Projet personnel",
      TEAM: "Projet d’équipe",
      LEARNING: "Projet d’apprentissage",
    },
    statusLabel: "Statut :",
    roleLabel: "Rôle :",
    readCaseStudy: "Lire l’étude de cas",
    caseStudyOf: "Voir l’étude de cas {title}",
    discover: "Découvrir",
    demo: "Démonstration",
  },

  caseStudy: {
    allProjects: "Tous les projets",
    status: "Statut",
    type: "Type",
    role: "Rôle",
    problem: "Le problème initial",
    context: "Contexte",
    objectives: "Objectifs",
    solution: "Solution imaginée",
    features: "Fonctionnalités",
    architecture: "Architecture",
    technologies: "Technologies",
    decisions: "Choix importants",
    challenges: "Difficultés",
    learnings: "Apprentissages",
    currentState: "État actuel",
    currentStateBody:
      "Le projet est actuellement : {status}. Cette formulation reflète son état renseigné dans l’administration.",
    nextSteps: "Prochaines étapes",
    demo: "Démonstration",
    media: "Médias",
    links: "Liens",
    emptySection: "Cette partie sera complétée au fil du projet.",
    mediaPlaceholderAlt: "Média de {title} à ajouter",
    videoFallback: "Votre navigateur ne peut pas lire cette vidéo.",
  },

  footer: {
    tagline: "Des problèmes, des choix et des applications.",
    legal: "Mentions légales",
  },

  errors: {
    csrf: "Impossible d’initialiser la protection de la requête.",
    network: "Le serveur n’a pas pu traiter la demande.",
    notFoundTitle: "Page introuvable",
    notFoundBody: "Cette page n’existe pas ou n’est plus publiée.",
    backHome: "Revenir à l’accueil",
    unexpectedTitle: "Une erreur inattendue est survenue",
    unexpectedBody:
      "Réessayez ; si le problème persiste, revenez un peu plus tard.",
    retry: "Réessayer",
    loading: "Chargement du contenu…",
  },
};
