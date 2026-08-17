import type { Dictionary } from "./en";

export const fr: Dictionary = {
  htmlLang: "fr",
  ogLocale: "fr_FR",

  site: {
    titleDefault: "Jonathan Blanchard | Développeur Java / Spring Boot",
    titleTemplate: "%s | Jonathan Blanchard",
    applicationName: "Portfolio de Jonathan Blanchard",
    ogDescription:
      "Deux applications livrées et maintenues, dont une en production sur un serveur que j’exploite moi-même. Alternance de 14 mois recherchée dès septembre 2026.",
    skipToContent: "Aller au contenu",
    jobTitle: "Développeur full-stack Java / Spring Boot",
  },

  nav: {
    home: "Accueil",
    about: "Méthode",
    journey: "Parcours",
    projects: "Projets",
    contact: "Contact",
    resume: "CV",
    viewResume: "Consulter mon CV",
    homeAriaLabel: "Jonathan Blanchard, accueil",
    primary: "Navigation principale",
    mobile: "Navigation mobile",
    openMenu: "Ouvrir le menu",
    theme: "Thème",
    language: "Langue",
  },

  language: {
    change: "Changer de langue",
    title: "Langue",
    close: "Fermer",
  },

  theme: {
    toLight: "Activer le thème clair",
    toDark: "Activer le thème sombre",
  },

  profile: {
    title: "Développeur full-stack. Java et Spring Boot d’abord.",
    tagline:
      "Je construis des applications, puis je les maintiens debout. Janus est en production sur un serveur Linux que j’exploite moi-même. Quand ça casse, c’est moi qui déroule les logs.",
    availability:
      "Alternance de 14 mois, dès septembre 2026. Six semaines en entreprise, deux à l’école. Paris et Île-de-France.",
    photoAlt:
      "Visuel abstrait tenant lieu du portrait de Jonathan Blanchard, qui n’est pas encore publié",
    portraitNote: "Portrait pas encore publié",
  },

  availability: {
    title: "Ce que je cherche",
    lede: "Les informations pratiques d’abord.",
    facts: [
      { label: "Contrat", value: "Alternance, 14 mois" },
      { label: "Début", value: "Septembre 2026" },
      { label: "Rythme", value: "6 semaines entreprise, 2 semaines école" },
      { label: "École", value: "Web@cadémie by EPITECH, Paris" },
      {
        label: "Localisation",
        value: "Paris, mobile sur toute l’Île-de-France",
      },
      {
        label: "Poste visé",
        value: "Back-end Java, fonctionnalités menées de bout en bout",
      },
    ],
  },

  introduction: [
    "Une application a cassé un dimanche soir. C’est moi qui l’ai remise debout. Trois ans chez Novelty, sans droit à l’erreur. J’y ai appris que je préférais construire les outils plutôt que les réparer.",
    "J’ai donc choisi Java et React. C’est ce qui tourne en entreprise. Janus tourne en production sur un serveur Linux que j’exploite moi-même, et Episort en dépend. Je suis ma propre astreinte. Ça casse, je déroule les logs, je corrige, je rollback.",
    "12 projets rendus en groupe à la Web@cadémie. Binômes, trinômes, une équipe de cinq. Relecture entre pairs, et code d’autrui à reprendre. Ce qui me manque, c’est l’échelle.",
    "Au bout de quatorze mois, je veux être le développeur backend Java à qui on confie une fonctionnalité de bout en bout.",
  ],

  aiNote: {
    title: "La place de l’IA dans mon travail",
    body: "Codex (GPT 5.6 Sol) pour le cadrage et la génération. Je relis et je teste ce qui en sort, systématiquement. Sans lui j’avance moins vite, pas ailleurs. La conception et les arbitrages restent les miens.",
  },

  journey: [
    {
      period: "2022 – 2025",
      title: "Référent informatique",
      org: "Novelty, prestataire technique événementiel, Île-de-France",
      description:
        "Incidents hardware, software et réseau. Une centaine de prestations par mois. Un parc multi-agences de plus de cent postes.",
      points: [
        "Environnements Windows, macOS et réseau scénique préparés sous contrainte de délai. Jusqu’à 8 postes prêts à l’emploi en 1 h.",
        "L’appel en urgence. Qualifier avec quelqu’un qui panique. Arbitrer. Dire non. Expliquer sans jargon.",
        "Trois ans à regarder des systèmes tomber m’ont appris ce que coûte la production. C’est pour ça que mon code sait revenir en arrière.",
      ],
    },
    {
      period: "2025 – 2027",
      title: "Développeur web",
      org: "Web@cadémie by EPITECH, Paris",
      description:
        "100 % par projets. Aucun cours magistral derrière lequel se cacher. Douze projets rendus en groupe : 9 binômes, 2 trinômes, une équipe de cinq.",
      points: [
        "La relecture entre pairs par défaut. Du code écrit par d’autres à reprendre et à finir.",
        "En parallèle, je construis et j’exploite mes propres applications.",
      ],
    },
    {
      period: "Dès septembre 2026",
      title: "L’alternance que je cherche",
      org: "14 mois, 6 semaines entreprise pour 2 semaines école",
      description:
        "Une équipe. Une vraie base de code. Des relecteurs plus exigeants que moi.",
      points: [
        "Ce que j’apporte : Java et Spring Boot en production, Docker, GitLab CI, des tests avant la fusion, l’habitude d’être celui qu’on appelle.",
        "Ce que je viens chercher : l’héritage, la dette, et des contraintes que je n’ai pas choisies.",
      ],
    },
  ],

  earlierPath: {
    title: "Avant le développement",
    items: [
      {
        period: "2019 – 2022",
        title: "Hôte de caisse",
        description:
          "50 clients à l’heure. 3 000 à 5 000 € par jour. Sans écart.",
      },
      {
        period: "2014 – 2017",
        title: "Bac Pro EDPI, lycée Jean Perrin",
        description:
          "Mention Assez Bien. J’ai lu des plans techniques avant de lire des stack traces. L’habitude de spécifier d’abord vient de là.",
      },
    ],
  },

  skillGroups: [
    {
      title: "Back-end & tests",
      summary:
        "Modéliser explicitement les données, les permissions et les erreurs. Le prouver en CI.",
      skills: [
        "Java",
        "Spring Boot",
        "API REST",
        "JUnit 5",
        "PostgreSQL",
        "PHP / Laravel",
        "Node.js",
      ],
      proof: "Janus, Episort",
    },
    {
      title: "Front-end",
      summary:
        "Traduire les règles métier en parcours lisibles et accessibles.",
      skills: ["React", "TypeScript", "Vite", "Tailwind", "JavaFX"],
      proof: "La console de Janus, Episort, ce site",
    },
    {
      title: "Exploitation",
      summary:
        "Construire l’environnement. Livrer l’artefact. Le maintenir debout.",
      skills: ["Linux", "Docker", "GitLab CI/CD", "Traefik", "OpenBao"],
      proof: "Tout ce qui, chez moi, tourne en production",
    },
    {
      title: "Méthodes",
      summary:
        "Les habitudes qui rendent le code tenable par quelqu’un d’autre.",
      skills: [
        "Git",
        "Revue de code",
        "Tests en CI",
        "Sécurité applicative",
        "Séparation dev/prod",
      ],
      proof: "12 projets en groupe, et ma propre astreinte",
    },
  ],

  languages: {
    title: "Langues",
    items: [
      { name: "Français", level: "Langue maternelle" },
      { name: "Anglais", level: "Intermédiaire (B2)" },
      { name: "Japonais", level: "Débutant" },
    ],
  },

  interests: {
    title: "En dehors de l’éditeur",
    items: [
      {
        title: "Hardware",
        body: "Montage et réparation. Comprendre la machine avant de blâmer le code.",
      },
      {
        title: "Modélisation 3D",
        body: "Dessin technique, SolidWorks et Catia. C’est là que spécifier avant de construire est devenu une habitude.",
      },
      {
        title: "Speedrun",
        body: "Analyse de patterns et optimisation. Le même réflexe que profiler un endpoint trop lent.",
      },
    ],
  },

  home: {
    metaTitle: "Développeur Java / Spring Boot, alternance septembre 2026",
    viewResume: "Consulter mon CV",
    contactMe: "Me contacter",
    introTitle:
      "Je suis venu au code en réparant ce que d’autres avaient construit.",
    approachTitle: "Quatre décisions que je défendrais en revue.",
    approachLede:
      "Pas des principes. Des arbitrages que j’ai faits, dans des applications livrées et maintenues.",
    principles: [
      {
        title: "Aucune action destructive sans retour arrière",
        body: "Episort ne déplace jamais un fichier de lui-même. Il propose un plan, demande deux fois, journalise l’exécution, et sait tout annuler.",
      },
      {
        title: "Un secret ne voyage pas plus loin que nécessaire",
        body: "Dans Janus, les services appellent des API tierces sans jamais détenir la clé. La rotation vit dans OpenBao. Le journal d’audit enregistre l’accès, pas le secret.",
      },
      {
        title: "Je suis le premier utilisateur de ce que je construis",
        body: "Episort atteint TMDB à travers Janus. Ma passerelle détient la clé, donc Episort est livré sans. Quand Janus limite, Episort ralentit de lui-même.",
      },
      {
        title: "Livrer n’est pas la fin du travail",
        body: "GitLab CI le construit. Traefik le sert. Mon serveur le fait tourner. Les exploiter fait partie de les écrire.",
      },
    ],
    journeyTitle: "Le chemin jusqu’ici, dans l’ordre.",
    fullJourney: "Voir le parcours complet",
    projectsTitle: "Deux applications, livrées et maintenues.",
    projectsLede:
      "Chaque étude de cas s’ouvre sur le problème. Puis les décisions. Puis ce qui n’est pas fini.",
    allProjects: "Voir tous les projets",
    skillsTitle: "Ce qu’on peut me confier aujourd’hui.",
    skillProof: "Éprouvé dans :",
    projectsUnavailable:
      "Les études de cas sont servies par mon propre API, et il ne répond pas pour le moment. Tout le reste de cette page reste valable.",
  },

  about: {
    metaTitle: "Méthode",
    metaDescription:
      "Partir de la panne. Garder chaque choix explicable. Exploiter ce qu’on livre.",
    heroTitle: "Je conçois pour le jour où ça tourne mal.",
    heroBody:
      "Trois ans d’incidents en première ligne. Une application se juge quand quelque chose est déjà cassé. C’est de là que je pars.",
    sectionTitle: "De l’idée au comportement réel.",
    pillars: [
      {
        title: "Produit",
        body: "Trouver d’abord la gêne réelle. Le cas ambigu n’est pas un cas limite. C’est le cas.",
      },
      {
        title: "Frontend",
        body: "Rendre l’état visible. Ce qui va se passer. Ce qui s’est passé. Ce qui peut encore être annulé.",
      },
      {
        title: "Backend",
        body: "Modéliser explicitement les permissions, les erreurs et les transitions. Les couvrir par des tests qui tournent en CI.",
      },
      {
        title: "Exploitation",
        body: "Les environnements, les journaux et le déploiement font partie du produit. J’exploite les miens, donc je sens quand ils sont mal faits.",
      },
    ],
    gapTitle: "Ce que je n’ai pas encore.",
    gapBody:
      "Aucune base de code plus vieille que moi. Aucune prod que je n’ai pas construite. Aucune dette contractée par quelqu’un d’autre. C’est exactement ce que je viens chercher. Je préfère le dire maintenant plutôt que vous le laisser découvrir au deuxième mois.",
  },

  journeyPage: {
    metaTitle: "Parcours",
    metaDescription:
      "De l’assistance technique événementielle au développement Java. Le parcours de Jonathan Blanchard, et ce qu’il recherche.",
    heroTitle: "Une reconversion choisie.",
    heroBody:
      "Je n’ai pas quitté mon métier précédent parce qu’il se passait mal. Je l’ai quitté parce que je préférais construire les outils plutôt que les réparer.",
  },

  projectsPage: {
    metaTitle: "Projets",
    metaDescription:
      "Janus et Episort, deux applications en production, et les projets d’équipe et d’apprentissage qui les précèdent.",
    heroTitle: "Des applications face à des problèmes concrets.",
    heroBody:
      "Les technologies comptent quand elles rendent la solution plus claire, plus sûre, ou plus facile à maintenir debout.",
    otherGrounds: "Projets d’équipe et d’apprentissage",
  },

  contact: {
    metaTitle: "Contact",
    metaDescription:
      "Contacter Jonathan Blanchard pour une alternance de 14 mois dès septembre 2026, à Paris et en Île-de-France.",
    heroTitle: "Le plus rapide, c’est un e-mail.",
    heroBody:
      "Une alternance, un test technique, ou un premier échange. Je réponds vite, et j’arrive préparé.",
    sectionTitle: "Comment me joindre",
    sendEmail: "Envoyer un e-mail",
    labels: {
      email: "E-mail",
      phone: "Téléphone",
      location: "Localisation",
      github: "GitHub",
      linkedin: "LinkedIn",
      resume: "CV",
    },
    location: "Paris, mobile sur toute l’Île-de-France",
    resumeNote: "PDF, une page, rédigé en français.",
    noForm:
      "Aucun formulaire de contact. Aucun traceur. L’adresse arrive directement chez moi.",
    viewResume: "Consulter le CV",
  },

  legal: {
    metaTitle: "Mentions légales",
    heroTitle: "Mentions légales",
    heroBody:
      "Qui publie ce site, où il tourne, et ce qu’il fait de votre visite.",
    publisher: "Éditeur",
    publisherBody:
      "Jonathan Blanchard, éditeur particulier, Paris. Contact : jonathan.blanchard@epitech.eu.",
    hosting: "Hébergement",
    hostingBody:
      "Auto-hébergé sur un serveur Linux dédié administré par l’éditeur. La raison sociale et l’adresse du fournisseur seront indiquées ici avant la mise en ligne du domaine.",
    data: "Données et administration",
    dataBody:
      "Le site public ne dépose aucun cookie de suivi et n’appelle aucun outil d’analyse tiers. Un cookie mémorise votre choix de langue. L’espace d’administration n’est pas public. Il utilise un cookie de session strictement nécessaire et un jeton CSRF.",
  },

  contactPanel: {
    title: "Parlons de septembre 2026.",
    body: "Vous recrutez un alternant pour une équipe Java ? Je suis à un e-mail.",
    write: "M’écrire",
    seeContact: "Voir comment me joindre",
  },

  projects: {
    status: {
      CONCEPT: "Conception",
      IN_PROGRESS: "En développement",
      MAINTAINED: "Maintenu, en production",
      COMPLETED: "Réalisé",
    },
    type: {
      PERSONAL: "Projet personnel",
      TEAM: "Projet d’équipe",
      LEARNING: "Projet d’apprentissage",
    },
    statusLabel: "Statut :",
    stackLabel: "Stack :",
    roleLabel: "Rôle :",
    readCaseStudy: "Lire l’étude de cas",
    caseStudyOf: "Voir l’étude de cas {title}",
    discover: "Découvrir",
    demo: "Démonstration",
  },

  showcase: {
    janus: {
      diagramTitle: "Le trajet d’un appel à travers Janus",
      boundary: "La clé de l’API n’est lisible qu’ici",
      app: "Votre application",
      appNote: "détient une clé d’appelant, jamais celle de l’API",
      toJanus: "la requête",
      janus: "Janus",
      janusNote: "vérifie l’identité, puis l’autorisation, puis le quota",
      vault: "OpenBao",
      vaultNote: "détient la clé de l’API",
      toVault: "lit la clé",
      toApi: "la même requête, clé ajoutée",
      api: "L’API tierce",
      apiNote: "TMDB, et tout ce qui est enregistré",
      back: "la réponse revient expurgée, sous un identifiant de corrélation",
      caption:
        "L’application s’authentifie auprès de Janus, pas auprès de l’API. Rien de ce qui revient ne transporte la clé : ni une réponse, ni un journal, ni un message d’erreur.",
      signal:
        "Je suis passé à Java 25 et Spring Boot 4 quand rien n’était en jeu, pour que la montée de version n’arrive pas plus tard en urgence. Ça tourne sur un serveur que j’administre, et quand ça casse, c’est moi qui lis les logs.",
    },
    episort: {
      diagramTitle: "Six étapes, dont deux à franchir",
      steps: [
        { name: "Scan", note: "lit le dossier" },
        { name: "Analyse", note: "des règles, pas de modèle" },
        { name: "Correspondance", note: "TMDB, à travers" },
        { name: "Revue des identités", note: "une ligne par groupe détecté" },
        { name: "Revue du plan", note: "chaque source et chaque destination" },
        { name: "Application", note: "dans l’espace de travail, journalisée" },
      ],
      gate: "Vous validez",
      writes: "La seule étape qui écrit",
      caption:
        "Le même dossier produit toujours le même plan. Cinq étapes se contentent de lire. La sixième écrit, et une exécution interrompue en cours de route se reprend depuis son journal.",
      signal:
        "Episort appelle TMDB à travers Janus : il se distribue sans aucune clé en amont, et ceux qui l’utilisent n’ont besoin d’aucun compte. Être le premier client de ma propre passerelle y a trouvé des problèmes qu’aucun de mes tests n’avait vus.",
    },
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
    mediaPlaceholderAlt: "Média de {title} à ajouter",
    videoFallback: "Votre navigateur ne peut pas lire cette vidéo.",
  },

  footer: {
    tagline: "Des problèmes, des choix, des applications qui tiennent debout.",
    legal: "Mentions légales",
  },

  errors: {
    csrf: "Impossible d’initialiser la protection de la requête.",
    network: "Le serveur n’a pas pu traiter la demande.",
    notFoundTitle: "Page introuvable",
    notFoundBody: "Cette page n’existe pas ou n’est plus publiée.",
    backHome: "Revenir à l’accueil",
    unexpectedTitle: "Une erreur inattendue est survenue",
    unexpectedBody: "Réessayez. Si le problème persiste, revenez plus tard.",
    retry: "Réessayer",
    loading: "Chargement du contenu…",
  },
};
