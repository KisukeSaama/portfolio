export const en = {
  htmlLang: "en",
  ogLocale: "en_US",

  site: {
    titleDefault: "Jonathan Blanchard | Java and Spring Boot developer",
    titleTemplate: "%s | Jonathan Blanchard",
    applicationName: "Jonathan Blanchard's portfolio",
    ogDescription:
      "Two applications shipped and maintained, one of them in production on a server I operate myself. Looking for a 14-month apprenticeship from September 2026.",
    skipToContent: "Skip to content",
    jobTitle: "Full-stack developer, Java and Spring Boot",
  },

  nav: {
    home: "Home",
    about: "Method",
    journey: "Journey",
    projects: "Projects",
    contact: "Contact",
    resume: "Resume",
    viewResume: "View my resume",
    homeAriaLabel: "Jonathan Blanchard, home",
    primary: "Main navigation",
    mobile: "Mobile navigation",
    openMenu: "Open the menu",
    theme: "Theme",
    language: "Language",
  },

  language: {
    change: "Change language",
    title: "Language",
    close: "Close",
  },

  theme: {
    toLight: "Switch to the light theme",
    toDark: "Switch to the dark theme",
  },

  profile: {
    title: "Full-stack developer. Java and Spring Boot first.",
    tagline:
      "I build applications, then keep them running. Janus is in production on a Linux server I operate myself. When it breaks, I am the one reading the logs.",
    availability:
      "14-month apprenticeship, from September 2026. Six weeks in the company, two at school. Paris and Île-de-France.",
    photoAlt:
      "Abstract placeholder standing in for Jonathan Blanchard's portrait, which is not published yet",
    portraitNote: "Portrait not published yet",
  },

  availability: {
    title: "What I am looking for",
    lede: "The practical details first.",
    facts: [
      { label: "Contract", value: "Apprenticeship, 14 months" },
      { label: "Start", value: "September 2026" },
      { label: "Rhythm", value: "6 weeks company, 2 weeks school" },
      { label: "School", value: "Web@cadémie by EPITECH, Paris" },
      { label: "Location", value: "Paris, mobile across Île-de-France" },
      {
        label: "Target role",
        value: "Java back-end, features owned end to end",
      },
    ],
  },

  introduction: [
    "An application broke on a Sunday evening. I was the one who put it back up. Three years at Novelty, with no room for error. I learned that I would rather build the tools than repair them.",
    "So I chose Java and React. That is what runs inside companies. Janus runs in production on a Linux server I operate myself, and Episort depends on it. I am my own on-call. It breaks, I read the logs, I fix, I roll back.",
    "Twelve group projects at the Web@cadémie. Pairs, threes, one team of five. Peer review, and other people's code to take over. What I am missing is scale.",
    "In fourteen months I want to be the Java back-end developer you hand a feature to, end to end.",
  ],

  aiNote: {
    title: "Where AI sits in my work",
    body: "Codex (GPT 5.6 Sol) for framing and generation. I review and test what comes out, every time. Without it I move slower, not somewhere else. The design and the trade-offs stay mine.",
  },

  journey: [
    {
      period: "2022 – 2025",
      title: "IT lead",
      org: "Novelty, event-technology provider, Île-de-France",
      description:
        "Hardware, software and network incidents. Around a hundred events a month. A multi-site fleet of more than a hundred machines.",
      points: [
        "Windows, macOS and stage networks prepared under deadline. Up to 8 workstations ready in an hour.",
        "The call in an emergency. Qualify with someone who is panicking. Arbitrate. Say no. Explain without jargon.",
        "Three years watching systems fall taught me what production costs. It is why my code can roll back.",
      ],
    },
    {
      period: "2025 – 2027",
      title: "Web developer",
      org: "Web@cadémie by EPITECH, Paris",
      description:
        "100% project-based. No lecture to hide behind. Twelve projects delivered in groups: 9 pairs, 2 threes, one team of five.",
      points: [
        "Peer review by default. Other people's code to pick up and finish.",
        "In parallel, I build and operate my own applications.",
      ],
    },
    {
      period: "From September 2026",
      title: "The apprenticeship I am looking for",
      org: "14 months, 6 weeks company for 2 weeks school",
      description:
        "A team. A real codebase. Reviewers harder to satisfy than I am.",
      points: [
        "What I bring: Java and Spring Boot in production, Docker, GitLab CI, tests before merge, the habit of being paged.",
        "What I come for: legacy, debt, and constraints I did not choose.",
      ],
    },
  ],

  earlierPath: {
    title: "Before development",
    items: [
      {
        period: "2019 – 2022",
        title: "Checkout host",
        description:
          "50 customers an hour. 3,000 to 5,000 euros a day. No discrepancy.",
      },
      {
        period: "2014 – 2017",
        title:
          "Vocational baccalaureate in industrial design, Lycée Jean Perrin",
        description:
          "Passed with honors. I read technical drawings before I read stack traces. The habit of specifying first comes from there.",
      },
    ],
  },

  skillGroups: [
    {
      title: "Back-end & tests",
      summary: "Model data, permissions and errors explicitly. Prove it in CI.",
      skills: [
        "Java",
        "Spring Boot",
        "REST API",
        "JUnit 5",
        "PostgreSQL",
        "PHP / Laravel",
        "Node.js",
      ],
      proof: "Janus, Episort",
    },
    {
      title: "Front-end",
      summary: "Turn business rules into readable, accessible flows.",
      skills: ["React", "TypeScript", "Vite", "Tailwind", "JavaFX"],
      proof: "The Janus console, Episort, this site",
    },
    {
      title: "Operations",
      summary: "Build the environment. Ship the artifact. Keep it up.",
      skills: ["Linux", "Docker", "GitLab CI/CD", "Traefik", "OpenBao"],
      proof: "Everything of mine that runs in production",
    },
    {
      title: "Methods",
      summary: "The habits that make code survivable by someone else.",
      skills: [
        "Git",
        "Code review",
        "Tests in CI",
        "Application security",
        "dev/prod separation",
      ],
      proof: "12 group projects, and my own on-call",
    },
  ],

  languages: {
    title: "Languages",
    items: [
      { name: "French", level: "Native" },
      { name: "English", level: "Intermediate (B2)" },
      { name: "Japanese", level: "Beginner" },
    ],
  },

  interests: {
    title: "Outside the editor",
    items: [
      {
        title: "Hardware",
        body: "Building and repairing machines. Understand the metal before blaming the code.",
      },
      {
        title: "3D modeling",
        body: "Technical drawing, SolidWorks and Catia. Where specifying before building became a habit.",
      },
      {
        title: "Speedrunning",
        body: "Pattern analysis and optimization. The same reflex as profiling a slow endpoint.",
      },
    ],
  },

  home: {
    metaTitle: "Java and Spring Boot developer, apprenticeship September 2026",
    viewResume: "View my resume",
    contactMe: "Get in touch",
    introTitle: "I came to code by repairing what others had built.",
    approachTitle: "Four decisions I would defend in review.",
    approachLede:
      "Not principles. Calls I made, in applications that are shipped and maintained.",
    principles: [
      {
        title: "No destructive action without a way back",
        body: "Episort never moves a file on its own. It proposes a plan, asks twice, journals the run, and can undo it all.",
      },
      {
        title: "A secret travels no further than it must",
        body: "In Janus, services call third-party APIs without ever holding the key. Rotation lives in OpenBao. The audit log records the access, not the secret.",
      },
      {
        title: "I am the first user of what I build",
        body: "Episort reaches TMDB through Janus. My gateway holds the key, so Episort ships without one. When Janus throttles, Episort paces itself.",
      },
      {
        title: "Shipping is not the end of the job",
        body: "GitLab CI builds it. Traefik serves it. My server runs it. Operating them is part of writing them.",
      },
    ],
    journeyTitle: "The path here, in order.",
    fullJourney: "See the full journey",
    projectsTitle: "Two applications, shipped and maintained.",
    projectsLede:
      "Each case study opens on the problem. Then the decisions. Then what is still unfinished.",
    allProjects: "See all projects",
    skillsTitle: "What I can be trusted with today.",
    skillProof: "Proven in:",
    projectsUnavailable:
      "The case studies are served by my own API, and it is not answering right now. Everything else on this page still applies.",
  },

  about: {
    metaTitle: "Method",
    metaDescription:
      "Start from the failure. Keep every choice explainable. Operate what you ship.",
    heroTitle: "I design for the day it goes wrong.",
    heroBody:
      "Three years of front-line incidents. An application is judged once something is already broken. That is where I start.",
    sectionTitle: "From the idea to real behavior.",
    pillars: [
      {
        title: "Product",
        body: "Find the real friction first. The ambiguous case is not an edge case. It is the case.",
      },
      {
        title: "Frontend",
        body: "Make the state visible. What will happen. What happened. What can still be undone.",
      },
      {
        title: "Backend",
        body: "Model permissions, errors and transitions explicitly. Cover them with tests that run in CI.",
      },
      {
        title: "Operations",
        body: "Environments, logs and deployment are the product. I run mine, so I feel it when they are wrong.",
      },
    ],
    gapTitle: "What I do not have yet.",
    gapBody:
      "No codebase older than I am. No production I did not build. No debt someone else contracted. That is exactly what I am coming for. I would rather say it now than let you find out in month two.",
  },

  journeyPage: {
    metaTitle: "Journey",
    metaDescription:
      "From event-technology incident response to Java development. Jonathan Blanchard's path, and what he is looking for.",
    heroTitle: "A career change I chose.",
    heroBody:
      "I did not leave my previous job because it went badly. I left because I preferred building the tools to repairing them.",
  },

  projectsPage: {
    metaTitle: "Projects",
    metaDescription:
      "Janus and Episort, two applications in production, plus the team and learning projects behind them.",
    heroTitle: "Applications facing concrete problems.",
    heroBody:
      "Technologies matter when they make the solution clearer, safer, or easier to keep up.",
    otherGrounds: "Team and learning projects",
  },

  contact: {
    metaTitle: "Contact",
    metaDescription:
      "Reach Jonathan Blanchard about a 14-month apprenticeship from September 2026, in Paris and Île-de-France.",
    heroTitle: "The fastest way is email.",
    heroBody:
      "An apprenticeship, a technical test, or a first conversation. I answer fast, and I come prepared.",
    sectionTitle: "How to reach me",
    sendEmail: "Send an email",
    labels: {
      email: "Email",
      phone: "Phone",
      location: "Location",
      github: "GitHub",
      linkedin: "LinkedIn",
      resume: "Resume",
    },
    location: "Paris, mobile across Île-de-France",
    resumeNote: "PDF, one page, written in French.",
    noForm: "No contact form. No tracking. The address goes straight to me.",
    viewResume: "View the resume",
  },

  legal: {
    metaTitle: "Legal notice",
    heroTitle: "Legal notice",
    heroBody:
      "Who publishes this site, where it runs, and what it does with your visit.",
    publisher: "Publisher",
    publisherBody:
      "Jonathan Blanchard, individual publisher, Paris. Contact: jonathan.blanchard@epitech.eu.",
    hosting: "Hosting",
    hostingBody:
      "Self-hosted on a dedicated Linux server administered by the publisher. The provider's legal name and address will be listed here before the domain goes live.",
    data: "Data and administration",
    dataBody:
      "The public site sets no tracking cookie and calls no third-party analytics. One cookie records your language choice. The administration area is not public. It uses a strictly necessary session cookie and a CSRF token.",
  },

  contactPanel: {
    title: "Let's talk about September 2026.",
    body: "Hiring an apprentice for a Java team? I am one email away.",
    write: "Write to me",
    seeContact: "See how to reach me",
  },

  projects: {
    status: {
      CONCEPT: "Concept",
      IN_PROGRESS: "In development",
      MAINTAINED: "Maintained, in production",
      COMPLETED: "Completed",
    },
    type: {
      PERSONAL: "Personal project",
      TEAM: "Team project",
      LEARNING: "Learning project",
    },
    statusLabel: "Status:",
    stackLabel: "Stack:",
    roleLabel: "Role:",
    readCaseStudy: "Read the case study",
    caseStudyOf: "Read the {title} case study",
    discover: "Discover",
    demo: "Demo",
  },

  /**
   * The two flagship projects. Their prose stays in the database, in one language, like every other
   * project. What lives here is the part the database cannot hold: the labels of a diagram drawn in
   * code, and one line about how I work that only makes sense beside it. A project with no entry
   * here still renders, without the diagram.
   */
  showcase: {
    janus: {
      diagramTitle: "How one call travels through Janus",
      boundary: "The API's own key is readable only here",
      app: "Your application",
      appNote: "holds a caller key, never the API's",
      toJanus: "the request",
      janus: "Janus",
      janusNote: "checks identity, then the grant, then the quota",
      vault: "OpenBao",
      vaultNote: "holds the API's key",
      toVault: "reads the key",
      toApi: "the same request, with the key added",
      api: "The third-party API",
      apiNote: "TMDB, and whatever else is registered",
      back: "the response comes back scrubbed, under a correlation ID",
      caption:
        "The application authenticates to Janus, not to the API. Nothing that crosses back carries the key: not a response, not a log, not an error message.",
      signal:
        "I moved to Java 25 and Spring Boot 4 while nothing was at stake, so the upgrade would not arrive later as an emergency. It runs on a server I administer, and when it breaks I am the one reading the logs.",
    },
    episort: {
      diagramTitle: "Six stages, and the two you have to pass",
      steps: [
        { name: "Scan", note: "reads the folder" },
        { name: "Parse", note: "rules, no model" },
        { name: "Match", note: "TMDB, through" },
        { name: "Identity review", note: "one line per detected group" },
        { name: "Plan review", note: "every source and destination" },
        { name: "Apply", note: "inside the workspace, journalled" },
      ],
      gate: "You approve",
      writes: "The only stage that writes",
      caption:
        "The same folder always produces the same plan. Five stages only read. The sixth writes, and a run interrupted halfway can be resumed from its journal.",
      signal:
        "Episort calls TMDB through Janus, so it ships with no upstream key and the people using it need no account. Being the first consumer of my own gateway found problems in it that none of my tests had.",
    },
  },

  caseStudy: {
    allProjects: "All projects",
    status: "Status",
    type: "Type",
    role: "Role",
    problem: "The initial problem",
    context: "Context",
    objectives: "Objectives",
    solution: "The solution",
    features: "Features",
    architecture: "Architecture",
    technologies: "Technologies",
    decisions: "Key decisions",
    challenges: "Challenges",
    learnings: "Learnings",
    currentState: "Current state",
    currentStateBody:
      "The project is currently: {status}. This reflects the state set in the administration area.",
    nextSteps: "Next steps",
    demo: "Demo",
    media: "Media",
    links: "Links",
    mediaPlaceholderAlt: "Media for {title} still to be added",
    videoFallback: "Your browser cannot play this video.",
  },

  footer: {
    tagline: "Problems, decisions, applications that stay up.",
    legal: "Legal notice",
  },

  errors: {
    csrf: "Could not initialize the request protection.",
    network: "The server could not process the request.",
    notFoundTitle: "Page not found",
    notFoundBody: "This page does not exist or is no longer published.",
    backHome: "Back to home",
    unexpectedTitle: "An unexpected error occurred",
    unexpectedBody: "Try again. If the problem persists, come back later.",
    retry: "Try again",
    loading: "Loading content…",
  },
};

/** The English dictionary is the contract: every other locale must provide the same shape. */
export type Dictionary = typeof en;
