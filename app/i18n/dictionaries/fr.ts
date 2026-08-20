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
    title: "Développeur full-stack. Je pense déjà à demain.",
    tagline:
      "Je donne vie aux idées qui m’entourent en construisant des applications. Je les conçois, les déploie sur mon serveur, puis les fais évoluer au contact des usages réels.",
    availability:
      "Alternance de 14 mois, dès septembre 2026. Six semaines en entreprise, deux à l’école. Paris et Île-de-France.",
    photoAlt: "Portrait de Jonathan Blanchard souriant en extérieur",
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
        value: "Développeur full-stack, fonctionnalités menées de bout en bout",
      },
    ],
  },

  introduction: [
    "Chez Novelty, pendant trois ans, j’ai été confronté à des incidents à résoudre rapidement. Mais c’est souvent en creusant ces problèmes après coup, en testant différentes pistes et en explorant ce qui pouvait être fait autrement que j’ai eu envie de passer de l’autre côté : construire moi-même les outils qui me manquaient.",
    "J’ai choisi de me spécialiser en Java et React, des technologies largement utilisées pour concevoir des applications robustes et durables. Aujourd’hui, mes projets reposent sur ces technologies et sont en production sur le serveur Linux que j’administre moi-même. Je suis ma propre astreinte : lorsqu’un problème survient, j’analyse les logs, j’en identifie la cause, je le corrige et, si nécessaire, je reviens à la version précédente.",
    "À la Web@cadémie, j’ai réalisé 12 projets collectifs, en binôme, en trinôme et jusqu’à une équipe de cinq personnes. J’y ai appris à relire le code des autres, à défendre mes choix techniques et à reprendre un projet que je n’avais pas commencé. Ce qu’il me manque désormais, c’est l’échelle : travailler sur une application plus complexe, au sein d’une équipe expérimentée et avec de véritables contraintes de production.",
    "Au terme de ces quatorze mois d’alternance, je veux être le développeur à qui l’on peut confier une fonctionnalité de bout en bout, de sa conception jusqu’à sa mise en production.",
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
    introTitle: "Mon parcours",
    approachTitle: "Quatre choix que je peux défendre en revue de code.",
    approachLede:
      "Quatre risques concrets : perdre des données, exposer un secret, laisser passer un problème d’intégration ou livrer sans savoir l’exploiter.",
    principles: [
      {
        title: "Prévoir le retour en arrière avant d’écrire",
        body: "Episort présente chaque déplacement avant de toucher aux fichiers. L’utilisateur valide le plan, l’exécution est journalisée et l’opération peut être annulée.",
      },
      {
        title: "Utiliser un secret sans le distribuer",
        body: "Janus récupère la clé dans OpenBao au moment de l’appel. Les services l’utilisent sans la détenir, et le journal d’audit trace l’accès sans enregistrer le secret.",
      },
      {
        title: "Tester une architecture en l’utilisant vraiment",
        body: "Episort appelle TMDB à travers Janus. Quand la passerelle limite les appels, Episort adapte son rythme : l’architecture est éprouvée dans un usage réel, pas seulement dans des tests.",
      },
      {
        title: "Inclure le déploiement dans le travail",
        body: "GitLab CI construit l’application, Traefik la sert et mon serveur l’exécute. Concevoir ce chemin dès le départ rend chaque livraison reproductible et observable.",
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
  },

  journeyPage: {
    metaTitle: "Parcours",
    metaDescription:
      "De l’assistance technique événementielle au développement Java. Le parcours de Jonathan Blanchard, et ce qu’il recherche.",
    heroTitle: "Une reconversion choisie.",
    heroBody:
      "Je n’ai pas quitté mon métier précédent parce qu’il se passait mal. Je l’ai quitté parce que je préférais construire les outils plutôt que les réparer.",
    storyTitle: "Ce que je sais faire. Ce que je viens chercher.",
  },

  projectsPage: {
    metaTitle: "Projets",
    metaDescription:
      "Janus et Episort, deux applications en production, et les projets d’équipe et d’apprentissage qui les précèdent.",
    heroTitle: "Des applications face à des problèmes concrets.",
    heroBody:
      "Les technologies comptent quand elles rendent la solution plus claire, plus sûre, ou plus facile à maintenir debout.",
    personalProjects: "Projets personnels",
    schoolProjects: "Projets d’école",
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
    data: "Données et cookies",
    dataBody:
      "Le site ne dépose aucun cookie de suivi et n’appelle aucun outil d’analyse tiers. Un cookie strictement nécessaire mémorise votre choix de langue.",
  },

  contactPanel: {
    title: "Parlons de septembre 2026.",
    body: "Vous recrutez un alternant full-stack ? Je suis à un e-mail.",
    write: "M’écrire",
    seeContact: "Voir mes coordonnées",
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
    readCaseStudy: "Lire l’étude de cas",
    caseStudyOf: "Voir l’étude de cas {title}",
    startedAt: "Débuté le",
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
    mechanism: "Comment ça marche",
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
    remains: "Ce qui reste",
    currentState: "État actuel",
    currentStateBody:
      "Le projet est {status}.",
    nextSteps: "Prochaines étapes",
    demo: "Démonstration",
    media: "Médias",
    links: "Liens",
    mediaPlaceholderAlt: "Média de {title} à ajouter",
    mediaPlaceholderNote: "Les vrais médias du projet seront ajoutés ici",
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
  },
};
