package com.jonathan.portfolio.config;

import com.jonathan.portfolio.project.domain.*;
import com.jonathan.portfolio.project.dto.ProjectWriteRequest;
import com.jonathan.portfolio.project.infrastructure.ProjectRepository;
import java.util.List;
import java.util.Map;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Seeds the case studies shipped with a fresh install. The fields on the request are the site's
 * source language, English. Each project also carries a French translation, which the public API
 * overlays when the visitor is on the French site; anything left out of a translation falls back to
 * the English field rather than rendering an empty heading.
 *
 * <p>No project carries a demo URL on purpose. The public demo link printed on the resume,
 * {@code kisukesaama.com/janus}, resolves to the case study page itself, so storing it here would
 * make the page link to itself.
 */
@Component @ConditionalOnProperty(name="app.seed.enabled",havingValue="true",matchIfMissing=true)
public class ProjectSeed implements ApplicationRunner {
    private final ProjectRepository projects; public ProjectSeed(ProjectRepository projects){this.projects=projects;}
    @Override @Transactional public void run(ApplicationArguments args){seed(janus());seed(episort());seed(overkill());seed(social());}
    /**
     * A project that already exists is never rewritten: its prose may have been edited from the
     * administration area since it was seeded. Only missing translations are filled in, so a database
     * created before this column existed picks up the French without losing anything.
     */
    private void seed(ProjectWriteRequest request){
        var existing=projects.findBySlugIgnoreCase(request.slug());
        if(existing.isPresent()){if(existing.get().addTranslationsIfAbsent(request.translations()))projects.save(existing.get());return;}
        var project=new Project(request);project.publish();projects.save(project);
    }
    private ProjectWriteRequest base(String title,String slug,String shortDescription,String fullDescription,String problem,String context,String solution,String role,String architecture,ProjectStatus status,ProjectType type,FeatureLevel level,int order,List<String> objectives,List<String> technologies,List<String> features,List<String> decisions,List<String> challenges,List<String> learnings,List<String> nextSteps,String githubUrl,String seo,Map<String,ProjectTranslation> translations){return new ProjectWriteRequest(title,slug,shortDescription,fullDescription,problem,context,solution,role,architecture,status,type,level,level==FeatureLevel.PRIMARY,order,Visibility.PUBLIC,objectives,technologies,features,decisions,challenges,learnings,nextSteps,githubUrl,"",title+" (case study)",seo,"",translations);}
    /** Positional and long, like {@link #base}, and for the same reason: it is written once each. */
    private Map<String,ProjectTranslation> fr(String title,String shortDescription,String fullDescription,String problem,String context,String solution,String role,String architecture,List<String> objectives,List<String> features,List<String> decisions,List<String> challenges,List<String> learnings,List<String> nextSteps,String seoTitle,String seoDescription){return Map.of("fr",new ProjectTranslation(title,shortDescription,fullDescription,problem,context,solution,role,architecture,objectives,features,decisions,challenges,learnings,nextSteps,seoTitle,seoDescription));}

    private ProjectWriteRequest janus(){return base("Janus","janus",
        "Applications reach third-party APIs without ever holding the key.",
        "A self-hosted credential boundary. Applications authenticate to Janus; only Janus reads the upstream secret from OpenBao and adds it on the way out. A Java 25 and Spring Boot 4 modular monolith, with a React console for identities, connections and grants. It runs in production, and my other application depends on it.",
        "An API key gets copied into a project, committed by accident, and rotated never. Every application holding a key can leak it. And nothing tells you which service called what, or how often.",
        "Each new integration adds a secret, a permission set, and a rotation to forget. Traceability breaks first. A provider's dashboard shows you that the key was used. Not by which of your services, on which route, or at what rate.",
        "An authenticated proxy. The caller proves its identity, Janus checks the grant, applies the quota, reads the secret from OpenBao, and forwards the request. The secret never crosses back: not in a response, not in a log, not in an error message. Every call is audited under a correlation ID.",
        "Sole developer. Threat model, permission model, the Spring Boot service, the React console, and the production deployment.",
        "A modular monolith, layered controller to service to repository. The HTTP class decides nothing, the service owns the transaction and the audit record, and entities enforce their own invariants. Two independent security chains: one for the console, one for the gateway. PostgreSQL holds identities, connections, grants and audits, never a plaintext secret. Proxied calls run on virtual threads, so concurrency is bounded by the database pool rather than by the servlet container.",
        ProjectStatus.MAINTAINED,ProjectType.PERSONAL,FeatureLevel.PRIMARY,1,
        List.of("Keep upstream secrets out of every application that uses them","Make each outbound call attributable to one service","Turn revocation and rotation into an immediate, routine operation","Give a self-hosted deployment the controls a managed gateway sells"),
        List.of("Java 25","Spring Boot 4","Virtual threads","React 19","TypeScript","Vite","Tailwind CSS","PostgreSQL","OpenBao","Maven","Docker Compose","Traefik","nginx","GitLab CI"),
        List.of("Authenticated REST gateway, one slug per registered API","Machine identities with 256-bit keys, shown once, stored as BCrypt hashes","Short-lived opaque bearer tokens, with refresh rotation and family revocation on reuse","Grants scoped to a path prefix and a method set, for upstreams that cannot scope themselves","SSRF filtering re-checked at connection time, closing the DNS rebinding window","Per-address rate limiting applied before authentication, answered with 429 and Retry-After","Credential expiry sweep announcing each stage exactly once, safe across restarts and instances","Response reuse keyed on the credential, never on the caller","Audit stream with correlation IDs, carrying no credential material","React console for identities, connections, grants and audits"),
        List.of("Java 25 and Spring Boot 4, the current LTS. Proven with nothing at stake, before production forces the upgrade.","A modular monolith, not microservices. One artifact to deploy. The need did not justify the complexity.","A grant admits everything under a slug by default. An allowlist would only be a second, staler copy of what the upstream already enforces. Scoping exists for the keys that cannot say no themselves.","Client identity comes from the proxy chain, never from a header the caller sets. Otherwise a caller picks its own throttling identity and buys unlimited guesses.","An unknown application still costs a hash comparison, so response timing does not disclose which identifiers exist.","Rate limit refusals are counted, not audited. A row per rejected call would turn a flood into a second flood against the database."),
        List.of("Deciding client identity behind a reverse proxy. Too narrow a trust list and the proxy becomes the throttled client, locking everyone out. Too wide and a caller is believed about its own address.","Rotating a key without dropping the calls already in flight.","Caching verified keys and passwords without weakening BCrypt, since HTTP Basic repeats the comparison on every single request.","Keeping the audit stream useful without letting it become sensitive itself."),
        List.of("Secret management is a lifecycle problem, not a storage problem.","A control is worth what its cheapest bypass costs. Re-checking the address at connection time mattered more than the check at registration.","78 test classes against 153 production ones, concentrated on authentication and authorization. That is where a regression stays silent."),
        List.of("Publish real screenshots of the console","Document the threat model as a page of its own","Widen coverage on the token exchange paths"),
        "https://github.com/KisukeSaama/janus",
        "A self-hosted Spring Boot gateway that keeps API keys out of the applications using them.",
        fr(null,
            "Les applications appellent des API tierces sans jamais détenir la clé.",
            "Une frontière de secrets auto-hébergée. Les applications s’authentifient auprès de Janus, et Janus seul lit le secret amont dans OpenBao puis l’ajoute au passage. Un monolithe modulaire en Java 25 et Spring Boot 4, avec une console React pour les identités, les connexions et les autorisations. Il tourne en production, et mon autre application en dépend.",
            "Une clé d’API est copiée dans un projet, commitée par accident, et jamais tournée. Toute application qui détient une clé peut la fuiter. Et rien ne dit quel service a appelé quoi, ni à quelle fréquence.",
            "Chaque nouvelle intégration ajoute un secret, un jeu de permissions, et une rotation à oublier. La traçabilité casse en premier. Le tableau de bord d’un fournisseur montre que la clé a servi. Pas par lequel de vos services, sur quelle route, ni à quel rythme.",
            "Un proxy authentifié. L’appelant prouve son identité, Janus vérifie l’autorisation, applique le quota, lit le secret dans OpenBao et transmet la requête. Le secret ne repasse jamais dans l’autre sens : ni dans une réponse, ni dans un log, ni dans un message d’erreur. Chaque appel est audité sous un identifiant de corrélation.",
            "Développeur unique. Modèle de menaces, modèle de permissions, le service Spring Boot, la console React, et le déploiement en production.",
            "Un monolithe modulaire, en couches du contrôleur au service puis au dépôt. La classe HTTP ne décide de rien, le service porte la transaction et l’enregistrement d’audit, et les entités font respecter leurs propres invariants. Deux chaînes de sécurité indépendantes : une pour la console, une pour la passerelle. PostgreSQL contient les identités, les connexions, les autorisations et les audits, jamais un secret en clair. Les appels proxifiés tournent sur des threads virtuels, donc la concurrence est bornée par le pool de la base plutôt que par le conteneur de servlets.",
            List.of("Garder les secrets amont hors de toutes les applications qui les utilisent","Rendre chaque appel sortant attribuable à un service précis","Faire de la révocation et de la rotation une opération immédiate et ordinaire","Donner à un déploiement auto-hébergé les contrôles qu’une passerelle managée facture"),
            List.of("Passerelle REST authentifiée, un slug par API enregistrée","Identités machine à clés de 256 bits, affichées une fois, stockées en empreintes BCrypt","Jetons porteurs opaques de courte durée, avec rotation du rafraîchissement et révocation de la famille en cas de réutilisation","Autorisations limitées à un préfixe de chemin et à un ensemble de méthodes, pour les amonts incapables de se restreindre eux-mêmes","Filtrage SSRF revérifié au moment de la connexion, ce qui ferme la fenêtre de réattribution DNS","Limitation de débit par adresse appliquée avant l’authentification, répondue en 429 avec Retry-After","Balayage d’expiration des identifiants annonçant chaque étape une seule fois, sûr au redémarrage comme entre instances","Réutilisation des réponses indexée sur l’identifiant, jamais sur l’appelant","Flux d’audit à identifiants de corrélation, ne transportant aucune matière secrète","Console React pour les identités, les connexions, les autorisations et les audits"),
            List.of("Java 25 et Spring Boot 4, le LTS courant. Éprouvé sans enjeu, avant que la production n’impose la montée.","Un monolithe modulaire, pas des microservices. Un seul artefact à déployer. Le besoin ne justifiait pas la complexité.","Une autorisation admet par défaut tout ce qui est sous un slug. Une liste blanche ne serait qu’une seconde copie, plus périmée, de ce que l’amont applique déjà. Le cloisonnement existe pour les clés incapables de dire non elles-mêmes.","L’identité du client vient de la chaîne de proxy, jamais d’un en-tête que l’appelant choisit. Sinon un appelant choisit son identité de throttling et s’offre des tentatives illimitées.","Une application inconnue coûte quand même une comparaison d’empreinte, donc le temps de réponse ne révèle pas quels identifiants existent.","Les refus de limitation de débit sont comptés, pas audités. Une ligne par appel rejeté transformerait un flood en un second flood contre la base."),
            List.of("Décider de l’identité du client derrière un reverse proxy. Une liste de confiance trop étroite et le proxy devient le client limité, ce qui bloque tout le monde. Trop large et on croit un appelant sur parole quant à sa propre adresse.","Tourner une clé sans perdre les appels déjà en vol.","Mettre en cache clés et mots de passe vérifiés sans affaiblir BCrypt, puisque HTTP Basic répète la comparaison à chaque requête.","Garder le flux d’audit utile sans le laisser devenir sensible à son tour."),
            List.of("La gestion des secrets est un problème de cycle de vie, pas de stockage.","Un contrôle vaut ce que coûte son contournement le moins cher. Revérifier l’adresse au moment de la connexion comptait plus que la vérification à l’enregistrement.","78 classes de test contre 153 de production, concentrées sur l’authentification et l’autorisation. C’est là qu’une régression reste silencieuse."),
            List.of("Publier de vraies captures de la console","Documenter le modèle de menaces sur une page dédiée","Élargir la couverture sur les chemins d’échange de jetons"),
            "Janus (étude de cas)",
            "Une passerelle Spring Boot auto-hébergée qui garde les clés d’API hors des applications qui s’en servent."));}

    private ProjectWriteRequest episort(){return base("Episort","episort",
        "Sort a Plex library of thousands of files, and never lose one.",
        "A Windows-first JavaFX desktop application. It scans a folder, parses names with deterministic rules, resolves titles against TMDB, then shows the exact source to destination plan. Nothing is written until that plan has been read and approved. Shipped as a portable build for Windows and Linux, with the Java runtime embedded.",
        "A download folder holds hundreds of files named by a dozen release groups. Several shows sit in one folder. Aired, DVD and absolute episode orders disagree. Renaming by hand costs a weekend. Automating it blindly destroys the library, and a wrong match does not fail loudly. It quietly moves the wrong file somewhere else.",
        "The task is irreversible on disk. The user sits at a desktop with the file explorer open beside the application. They will not trust a tool that acts first and reports afterwards, and they are right not to.",
        "A fully deterministic pipeline: scan, rule-based parsing, TMDB resolution, identity review, plan review, journaled apply. The same folder always produces the same plan. Two explicit gates, and neither can be skipped. Conflicts, duplicates and unsafe Windows paths block the run before it starts.",
        "Sole developer. Product design, the parsing rules, the JavaFX interface and its design system, the packaging, and the safety strategy for file operations.",
        "Six separate stages, each one inspectable. The interface never touches a file: it approves a plan. Only the apply stage writes, inside the configured workspace, with a journal that lets an interrupted run be recovered. TMDB is reached through Janus, so no TMDB secret exists anywhere in this project.",
        ProjectStatus.MAINTAINED,ProjectType.PERSONAL,FeatureLevel.PRIMARY,2,
        List.of("Show exactly what will happen before anything happens","Make correcting twenty-five files cost the same gesture as correcting one","Never invent a value. An absent one shows a dash.","Ship something a non-developer can install and run"),
        List.of("Java 25","JavaFX 25","Gradle","JUnit 5","TMDB API","Janus gateway","Go 1.26","GitHub Actions"),
        List.of("Scans AVI, MP4 and MKV","Rule-based parsing of SxxExx, NxNN, absolute numbering, date-based episodes and folder-derived names","Mixed folders stay separated: a file name that contradicts its folder keeps its own title","Aired, DVD and absolute episode orders","Identity review, one line per detected group","Exact source to destination plan review","Conflicts, duplicates and unsafe Windows paths block the run","Journaled execution, recoverable after an interruption","Bilingual FR/EN interface, with no hardcoded string","Portable builds for Windows and Linux, runtime embedded"),
        List.of("Deterministic rules, no model. The same folder must always produce the same plan, and every value on screen traces back to a real signal.","The unit of work is the detected group, not the file. Correcting twenty-five files costs one click.","An unavailable action stays visible and disabled, with the reason on screen. Hiding a button to prevent an action tells the user nothing.","The two validation gates are the product, not friction to remove.","TMDB is called through Janus, so this application ships without an upstream secret and end users need no account."),
        List.of("Reading file names written by a dozen release groups, with no convention in common","Reconciling aired, DVD and absolute orders on the same show","Cutting metadata traffic: a 300-show, 1,000-film library went from more than 20,000 requests to roughly 3,000","Pacing requests from the gateway's own quota headers, so a small folder runs at full speed and only a large run slows down","Running JavaFX tests headless in CI, under Xvfb on Linux"),
        List.of("Safe usage comes from how the flow is structured, not from a confirmation dialog.","Automation that cannot declare its own uncertainty should not be trusted with a filesystem.","Performance is a product feature. Rendering at the display's refresh rate removed a 31 ms stutter every second.","Being the first consumer of my own gateway found problems in it that none of my tests had."),
        List.of("Publish real screenshots of the review screens","Broaden the release-naming test corpus","Document the parsing rules for contributors"),
        "https://github.com/KisukeSaama/episort",
        "A deterministic JavaFX application that sorts a Plex library behind two review gates.",
        fr(null,
            "Trier une bibliothèque Plex de milliers de fichiers, sans jamais en perdre un.",
            "Une application de bureau JavaFX pensée d’abord pour Windows. Elle scanne un dossier, analyse les noms avec des règles déterministes, résout les titres via TMDB, puis affiche le plan exact de la source vers la destination. Rien n’est écrit tant que ce plan n’a pas été lu et approuvé. Livrée en build portable pour Windows et Linux, avec le runtime Java embarqué.",
            "Un dossier de téléchargement contient des centaines de fichiers nommés par une douzaine de groupes de release. Plusieurs séries cohabitent dans un même dossier. Les ordres diffusé, DVD et absolu se contredisent. Renommer à la main coûte un week-end. Automatiser à l’aveugle détruit la bibliothèque, et une mauvaise correspondance n’échoue pas bruyamment. Elle déplace discrètement le mauvais fichier ailleurs.",
            "La tâche est irréversible sur le disque. L’utilisateur est devant son bureau, l’explorateur de fichiers ouvert à côté de l’application. Il ne fera pas confiance à un outil qui agit d’abord et rend compte ensuite, et il a raison.",
            "Un pipeline entièrement déterministe : scan, analyse par règles, résolution TMDB, revue des identités, revue du plan, application journalisée. Le même dossier produit toujours le même plan. Deux barrières explicites, et aucune ne peut être sautée. Conflits, doublons et chemins Windows dangereux bloquent l’exécution avant qu’elle ne commence.",
            "Développeur unique. Design produit, règles d’analyse, interface JavaFX et son système de design, packaging, et stratégie de sûreté des opérations de fichiers.",
            "Six étapes distinctes, chacune inspectable. L’interface ne touche jamais un fichier : elle approuve un plan. Seule l’étape d’application écrit, à l’intérieur de l’espace de travail configuré, avec un journal qui permet de reprendre une exécution interrompue. TMDB est atteint via Janus, donc aucun secret TMDB n’existe dans ce projet.",
            List.of("Montrer exactement ce qui va se passer avant que quoi que ce soit ne se passe","Faire que corriger vingt-cinq fichiers coûte le même geste que d’en corriger un","Ne jamais inventer une valeur. Une valeur absente affiche un tiret.","Livrer quelque chose qu’un non-développeur peut installer et lancer"),
            List.of("Scanne les fichiers AVI, MP4 et MKV","Analyse par règles des formats SxxExx, NxNN, numérotation absolue, épisodes datés et noms déduits du dossier","Les dossiers mixtes restent séparés : un nom de fichier qui contredit son dossier garde son propre titre","Ordres diffusé, DVD et absolu","Revue des identités, une ligne par groupe détecté","Revue du plan exact, source vers destination","Conflits, doublons et chemins Windows dangereux bloquent l’exécution","Exécution journalisée, récupérable après une interruption","Interface bilingue FR/EN, sans aucune chaîne codée en dur","Builds portables pour Windows et Linux, runtime embarqué"),
            List.of("Des règles déterministes, pas de modèle. Le même dossier doit toujours produire le même plan, et chaque valeur à l’écran remonte à un signal réel.","L’unité de travail est le groupe détecté, pas le fichier. Corriger vingt-cinq fichiers coûte un clic.","Une action indisponible reste visible et désactivée, avec sa raison à l’écran. Cacher un bouton pour empêcher une action n’apprend rien à l’utilisateur.","Les deux barrières de validation sont le produit, pas une friction à supprimer.","TMDB est appelé via Janus, donc cette application se livre sans secret amont et ses utilisateurs n’ont besoin d’aucun compte."),
            List.of("Lire des noms de fichiers écrits par une douzaine de groupes de release, sans aucune convention commune","Réconcilier les ordres diffusé, DVD et absolu sur une même série","Réduire le trafic de métadonnées : une bibliothèque de 300 séries et 1 000 films est passée de plus de 20 000 requêtes à environ 3 000","Cadencer les requêtes à partir des en-têtes de quota de la passerelle, pour qu’un petit dossier avance à pleine vitesse et que seule une grosse exécution ralentisse","Faire tourner les tests JavaFX en headless dans la CI, sous Xvfb sur Linux"),
            List.of("La sûreté d’usage vient de la structure du parcours, pas d’une boîte de confirmation.","Une automatisation incapable de déclarer sa propre incertitude ne mérite pas qu’on lui confie un système de fichiers.","La performance est une fonctionnalité produit. Rendre au taux de rafraîchissement de l’écran a supprimé un à-coup de 31 ms chaque seconde.","Être le premier consommateur de ma propre passerelle y a trouvé des problèmes qu’aucun de mes tests n’avait vus."),
            List.of("Publier de vraies captures des écrans de revue","Élargir le corpus de test des conventions de nommage","Documenter les règles d’analyse pour les contributeurs"),
            "Episort (étude de cas)",
            "Une application JavaFX déterministe qui trie une bibliothèque Plex derrière deux barrières de revue."));}

    private ProjectWriteRequest overkill(){return base("Overkill","overkill",
        "Aggregate and track job offers across the Paris region.",
        "A team project bringing scattered job offers together, making them easier to compare, and keeping a clear record of applications.",
        "Offers are spread across several platforms. Searching, comparing and following them up costs more time than applying.",
        "A React frontend and a Symfony backend around a shared model of offers and application tracking. Built and delivered as a group.",
        "A web application pairing a search and tracking interface with an API and a PostgreSQL database.",
        "Full-stack contributor within a team project, on both the API and the interface.",
        "React and Vite on the front, a Symfony API, PostgreSQL, and a Docker environment shared by the team.",
        ProjectStatus.COMPLETED,ProjectType.TEAM,FeatureLevel.SECONDARY,3,
        List.of("Bring scattered offers together","Speed up comparison","Centralize application tracking"),
        List.of("React","Vite","Tailwind CSS","Symfony","PostgreSQL","Docker"),
        List.of("Offer aggregation","Search","Comparison","Application tracking"),
        List.of("Agree the API contract before writing either side","Scope the work to what a team can actually carry"),
        List.of("Coordinating contributions without stepping on each other","Unifying data from several sources"),
        List.of("A clear API contract is what lets people work in parallel.","Reading someone else's code is a skill in itself, and it is trainable."),
        List.of("Publish real screenshots"),
        "",
        "A React and Symfony team project to track job offers in the Paris region.",
        fr(null,
            "Agréger et suivre les offres d’emploi en Île-de-France.",
            "Un projet d’équipe qui rassemble des offres dispersées, les rend plus faciles à comparer, et garde une trace claire des candidatures.",
            "Les offres sont réparties sur plusieurs plateformes. Chercher, comparer et relancer coûte plus de temps que de candidater.",
            "Un frontend React et un backend Symfony autour d’un modèle partagé d’offres et de suivi de candidatures. Conçu et livré en groupe.",
            "Une application web qui associe une interface de recherche et de suivi à une API et une base PostgreSQL.",
            "Contributeur full-stack au sein d’un projet d’équipe, sur l’API comme sur l’interface.",
            "React et Vite côté front, une API Symfony, PostgreSQL, et un environnement Docker partagé par l’équipe.",
            List.of("Rassembler des offres dispersées","Accélérer la comparaison","Centraliser le suivi des candidatures"),
            List.of("Agrégation d’offres","Recherche","Comparaison","Suivi des candidatures"),
            List.of("Fixer le contrat d’API avant d’écrire l’un ou l’autre côté","Cadrer le travail sur ce qu’une équipe peut réellement porter"),
            List.of("Coordonner les contributions sans se marcher dessus","Unifier des données venues de plusieurs sources"),
            List.of("Un contrat d’API clair est ce qui permet de travailler en parallèle.","Lire le code de quelqu’un d’autre est une compétence à part entière, et elle se travaille."),
            List.of("Publier de vraies captures"),
            "Overkill (étude de cas)",
            "Un projet d’équipe React et Symfony pour suivre les offres d’emploi en Île-de-France."));}

    private ProjectWriteRequest social(){return base("Mini social network","mini-social-network",
        "The same application, rebuilt to compare two backends.",
        "A learning application built in several versions, around authentication, profiles, posts and social relationships. The backend moved from Laravel to Java along the way.",
        "Understanding a full-stack system means connecting authentication, data, API and interactions inside one coherent application.",
        "A deliberate testing ground. It documents a progression and an architecture change rather than a finished product.",
        "A small social network, kept small on purpose, rebuilt to compare framework and modeling choices on the same domain.",
        "Sole developer, with learning as the goal.",
        "One domain, several backend iterations. Laravel first, then Java.",
        ProjectStatus.COMPLETED,ProjectType.LEARNING,FeatureLevel.SECONDARY,4,
        List.of("Practice a complete full-stack flow","Compare two backends on the same domain","Understand relationships between users and content"),
        List.of("Laravel","PHP","Java","REST API"),
        List.of("Authentication","Profiles","Posts","Comments","Interactions","Social relationships"),
        List.of("Reuse the same domain, so the comparison means something","Keep the scope small, so the rewrite stays affordable"),
        List.of("Evolving the model across versions","Comparing backend trade-offs honestly"),
        List.of("A rewrite only pays off when you can say what you are comparing."),
        List.of("Document the differences between versions"),
        "",
        "A full-stack learning project rebuilt across two backends, Laravel and Java.",
        fr("Mini réseau social",
            "La même application, reconstruite pour comparer deux backends.",
            "Une application d’apprentissage construite en plusieurs versions, autour de l’authentification, des profils, des publications et des relations sociales. Le backend est passé de Laravel à Java en cours de route.",
            "Comprendre un système full-stack, c’est relier l’authentification, les données, l’API et les interactions dans une seule application cohérente.",
            "Un terrain d’essai assumé. Il documente une progression et un changement d’architecture plutôt qu’un produit fini.",
            "Un petit réseau social, gardé petit exprès, reconstruit pour comparer des choix de framework et de modélisation sur le même domaine.",
            "Développeur unique, avec l’apprentissage pour objectif.",
            "Un seul domaine, plusieurs itérations de backend. Laravel d’abord, puis Java.",
            List.of("Pratiquer un parcours full-stack complet","Comparer deux backends sur le même domaine","Comprendre les relations entre utilisateurs et contenus"),
            List.of("Authentification","Profils","Publications","Commentaires","Interactions","Relations sociales"),
            List.of("Réutiliser le même domaine, pour que la comparaison veuille dire quelque chose","Garder un périmètre réduit, pour que la réécriture reste abordable"),
            List.of("Faire évoluer le modèle d’une version à l’autre","Comparer honnêtement les compromis de chaque backend"),
            List.of("Une réécriture ne paie que si l’on sait dire ce que l’on compare."),
            List.of("Documenter les différences entre versions"),
            "Mini réseau social (étude de cas)",
            "Un projet d’apprentissage full-stack reconstruit sur deux backends, Laravel et Java."));}
}
