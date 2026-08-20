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
    title: "Full-stack developer. I am already thinking about tomorrow.",
    tagline:
      "I turn the ideas around me into applications. I design them, deploy them on my own server, then evolve them as real needs emerge.",
    availability:
      "14-month apprenticeship, from September 2026. Six weeks in the company, two at school. Paris and Île-de-France.",
    photoAlt: "Portrait of Jonathan Blanchard smiling outdoors",
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
        value: "Full-stack developer, features owned end to end",
      },
    ],
  },

  introduction: [
    "For three years at Novelty, I dealt with incidents that had to be resolved quickly. But it was often afterward—digging into what had happened, testing different approaches and exploring what could have been done differently—that I wanted to move to the other side: building the tools I had been missing.",
    "I chose to specialize in Java and React, technologies widely used to build robust, durable applications. Today, my projects rely on them and run in production on the Linux server I administer myself. I am my own on-call: when a problem occurs, I analyze the logs, identify the cause, fix it and, when necessary, roll back to the previous version.",
    "At the Web@cadémie, I completed 12 team projects, working in pairs, groups of three and teams of up to five. I learned to review other people’s code, defend my technical decisions and take over a project I had not started. What I need now is scale: working on a more complex application, alongside an experienced team and under real production constraints.",
    "By the end of this fourteen-month apprenticeship, I want to be the developer trusted to own a feature end to end, from its design through to production.",
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
    introTitle: "My journey",
    approachTitle: "Four choices I can defend in code review.",
    approachLede:
      "Four concrete risks: losing data, exposing a secret, missing an integration problem, or shipping without knowing how to operate it.",
    principles: [
      {
        title: "Plan the way back before writing",
        body: "Episort shows every move before touching a file. The user approves the plan, the run is journalled, and the operation can be undone.",
      },
      {
        title: "Use a secret without distributing it",
        body: "Janus retrieves the key from OpenBao when the call is made. Services use it without holding it, and the audit log records the access without recording the secret.",
      },
      {
        title: "Test an architecture by actually using it",
        body: "Episort calls TMDB through Janus. When the gateway throttles calls, Episort paces itself: the architecture is tested in real use, not only in isolated tests.",
      },
      {
        title: "Make deployment part of the work",
        body: "GitLab CI builds the application, Traefik serves it, and my server runs it. Designing that path from the start makes every release reproducible and observable.",
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
  },

  journeyPage: {
    metaTitle: "Journey",
    metaDescription:
      "From event-technology incident response to Java development. Jonathan Blanchard's path, and what he is looking for.",
    heroTitle: "A career change I chose.",
    heroBody:
      "I did not leave my previous job because it went badly. I left because I preferred building the tools to repairing them.",
    storyTitle: "What I can do. What I am here to learn.",
  },

  projectsPage: {
    metaTitle: "Projects",
    metaDescription:
      "Janus and Episort, two applications in production, plus the team and learning projects behind them.",
    heroTitle: "Applications facing concrete problems.",
    heroBody:
      "Technologies matter when they make the solution clearer, safer, or easier to keep up.",
    personalProjects: "Personal projects",
    schoolProjects: "School projects",
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
    data: "Data and cookies",
    dataBody:
      "The site sets no tracking cookie and calls no third-party analytics. One strictly necessary cookie records your language choice.",
  },

  contactPanel: {
    title: "Let's talk about September 2026.",
    body: "Hiring a full-stack apprentice? I am one email away.",
    write: "Write to me",
    seeContact: "View my contact details",
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
    readCaseStudy: "Read the case study",
    caseStudyOf: "Read the {title} case study",
    startedAt: "Started",
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
    mechanism: "How it works",
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
      "The project is {status}.",
    nextSteps: "Next steps",
    demo: "Demo",
    media: "Media",
    links: "Links",
    mediaPlaceholderAlt: "Media for {title} still to be added",
    mediaPlaceholderNote: "Real project media will be added here",
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
  },
};

/** The English dictionary is the contract: every other locale must provide the same shape. */
export type Dictionary = typeof en;
