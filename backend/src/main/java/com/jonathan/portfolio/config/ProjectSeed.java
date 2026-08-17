package com.jonathan.portfolio.config;

import com.jonathan.portfolio.project.domain.*;
import com.jonathan.portfolio.project.dto.ProjectWriteRequest;
import com.jonathan.portfolio.project.infrastructure.ProjectRepository;
import java.util.List;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Seeds the case studies shipped with a fresh install. Project content is stored once per project,
 * so this text is the site's source language (English); translated case studies would need a
 * per-locale content table.
 *
 * <p>No project carries a demo URL on purpose. The public demo link printed on the resume,
 * {@code kisukesaama.com/janus}, resolves to the case study page itself, so storing it here would
 * make the page link to itself.
 */
@Component @ConditionalOnProperty(name="app.seed.enabled",havingValue="true",matchIfMissing=true)
public class ProjectSeed implements ApplicationRunner {
    private final ProjectRepository projects; public ProjectSeed(ProjectRepository projects){this.projects=projects;}
    @Override @Transactional public void run(ApplicationArguments args){seed(janus());seed(episort());seed(overkill());seed(social());}
    private void seed(ProjectWriteRequest request){if(projects.existsBySlugIgnoreCase(request.slug()))return;var project=new Project(request);project.publish();projects.save(project);}
    private ProjectWriteRequest base(String title,String slug,String shortDescription,String fullDescription,String problem,String context,String solution,String role,String architecture,ProjectStatus status,ProjectType type,FeatureLevel level,int order,List<String> objectives,List<String> technologies,List<String> features,List<String> decisions,List<String> challenges,List<String> learnings,List<String> nextSteps,String githubUrl,String seo){return new ProjectWriteRequest(title,slug,shortDescription,fullDescription,problem,context,solution,role,architecture,status,type,level,level==FeatureLevel.PRIMARY,order,Visibility.PUBLIC,objectives,technologies,features,decisions,challenges,learnings,nextSteps,githubUrl,"",title+" (case study)",seo,"");}

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
        "A self-hosted Spring Boot gateway that keeps API keys out of the applications using them.");}

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
        "A deterministic JavaFX application that sorts a Plex library behind two review gates.");}

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
        "A React and Symfony team project to track job offers in the Paris region.");}

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
        "A full-stack learning project rebuilt across two backends, Laravel and Java.");}
}
