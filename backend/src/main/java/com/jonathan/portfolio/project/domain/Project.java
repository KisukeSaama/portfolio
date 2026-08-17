package com.jonathan.portfolio.project.domain;

import com.jonathan.portfolio.media.ProjectMedia;
import com.jonathan.portfolio.project.dto.ProjectWriteRequest;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "project")
public class Project {
    @Id @UuidGenerator private UUID id;
    @Column(nullable = false, length = 120) private String title;
    @Column(nullable = false, unique = true, length = 120) private String slug;
    @Column(name = "short_description", nullable = false, length = 280) private String shortDescription;
    @Column(name = "full_description", nullable = false, columnDefinition = "text") private String fullDescription;
    @Column(nullable = false, columnDefinition = "text") private String problem;
    @Column(nullable = false, columnDefinition = "text") private String context = "";
    @Column(nullable = false, columnDefinition = "text") private String solution;
    @Column(name = "role_description", nullable = false, columnDefinition = "text") private String role;
    @Column(nullable = false, columnDefinition = "text") private String architecture = "";
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 32) private ProjectStatus status;
    @Enumerated(EnumType.STRING) @Column(name = "project_type", nullable = false, length = 32) private ProjectType projectType;
    @Enumerated(EnumType.STRING) @Column(name = "feature_level", nullable = false, length = 32) private FeatureLevel featureLevel;
    @Column(nullable = false) private boolean featured;
    @Column(name = "display_order", nullable = false) private int displayOrder;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 32) private Visibility visibility;
    @Enumerated(EnumType.STRING) @Column(name = "publication_status", nullable = false, length = 32) private PublicationStatus publicationStatus;
    @Column(name = "github_url", length = 2048) private String githubUrl;
    @Column(name = "demo_url", length = 2048) private String demoUrl;
    @Column(name = "seo_title", length = 70) private String seoTitle;
    @Column(name = "seo_description", length = 170) private String seoDescription;
    @Column(name = "open_graph_image_url", length = 2048) private String openGraphImageUrl;
    @Column(name = "created_at", nullable = false) private Instant createdAt = Instant.now();
    @Column(name = "updated_at", nullable = false) private Instant updatedAt = Instant.now();
    @Column(name = "published_at") private Instant publishedAt;
    @Column(name = "archived_at") private Instant archivedAt;
    @Version private long version;

    @ElementCollection @CollectionTable(name = "project_objective", joinColumns = @JoinColumn(name = "project_id")) @OrderColumn(name = "sort_order") @Column(name = "value") private List<String> objectives = new ArrayList<>();
    @ElementCollection @CollectionTable(name = "project_technology", joinColumns = @JoinColumn(name = "project_id")) @OrderColumn(name = "sort_order") @Column(name = "value") private List<String> technologies = new ArrayList<>();
    @ElementCollection @CollectionTable(name = "project_feature", joinColumns = @JoinColumn(name = "project_id")) @OrderColumn(name = "sort_order") @Column(name = "value") private List<String> features = new ArrayList<>();
    @ElementCollection @CollectionTable(name = "project_decision", joinColumns = @JoinColumn(name = "project_id")) @OrderColumn(name = "sort_order") @Column(name = "value") private List<String> decisions = new ArrayList<>();
    @ElementCollection @CollectionTable(name = "project_challenge", joinColumns = @JoinColumn(name = "project_id")) @OrderColumn(name = "sort_order") @Column(name = "value") private List<String> challenges = new ArrayList<>();
    @ElementCollection @CollectionTable(name = "project_learning", joinColumns = @JoinColumn(name = "project_id")) @OrderColumn(name = "sort_order") @Column(name = "value") private List<String> learnings = new ArrayList<>();
    @ElementCollection @CollectionTable(name = "project_next_step", joinColumns = @JoinColumn(name = "project_id")) @OrderColumn(name = "sort_order") @Column(name = "value") private List<String> nextSteps = new ArrayList<>();
    /**
     * The same prose in other locales, keyed by language tag. The columns above are the source
     * language; this is stored as one JSONB document rather than a parallel set of join tables,
     * because a translation is only ever read and written whole, alongside the project it belongs to.
     */
    @JdbcTypeCode(SqlTypes.JSON) @Column(nullable = false, columnDefinition = "jsonb") private Map<String, ProjectTranslation> translations = new LinkedHashMap<>();
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true) @OrderBy("sortOrder ASC") private List<ProjectMedia> media = new ArrayList<>();

    protected Project() {}
    public Project(ProjectWriteRequest request) { apply(request); }
    public void apply(ProjectWriteRequest r) {
        title=r.title().trim(); slug=r.slug().trim(); shortDescription=r.shortDescription().trim(); fullDescription=r.fullDescription().trim();
        problem=r.problem().trim(); context=r.context().trim(); solution=r.solution().trim(); role=r.role().trim(); architecture=r.architecture().trim();
        status=r.status(); projectType=r.projectType(); featureLevel=r.featureLevel(); featured=r.featured(); displayOrder=r.displayOrder(); visibility=r.visibility();
        githubUrl=blankToNull(r.githubUrl()); demoUrl=blankToNull(r.demoUrl()); seoTitle=blankToNull(r.seoTitle()); seoDescription=blankToNull(r.seoDescription()); openGraphImageUrl=blankToNull(r.openGraphImageUrl());
        replace(objectives,r.objectives()); replace(technologies,r.technologies()); replace(features,r.features()); replace(decisions,r.decisions()); replace(challenges,r.challenges()); replace(learnings,r.learnings()); replace(nextSteps,r.nextSteps()); replaceTranslations(r.translations()); updatedAt=Instant.now();
        if (publicationStatus == null) { publicationStatus=PublicationStatus.DRAFT; visibility=Visibility.PRIVATE; }
    }
    private static String blankToNull(String value) { return value == null || value.isBlank() ? null : value.trim(); }
    private static void replace(List<String> target, List<String> source) { target.clear(); source.stream().map(String::trim).filter(s -> !s.isBlank()).forEach(target::add); }
    /** A null map means "the caller sent no translations", which is not the same as "delete them". */
    /**
     * Adds translations only for locales the project does not already have one for, and reports
     * whether anything changed. This is how the seed backfills a database that was created before
     * translations existed, without overwriting prose an operator has since edited by hand.
     */
    public boolean addTranslationsIfAbsent(Map<String, ProjectTranslation> source) {
        if (source == null) return false;
        boolean changed = false;
        for (var entry : source.entrySet()) {
            var locale = entry.getKey().trim().toLowerCase(java.util.Locale.ROOT);
            if (entry.getValue() == null || translations.containsKey(locale)) continue;
            translations.put(locale, entry.getValue());
            changed = true;
        }
        if (changed) updatedAt = Instant.now();
        return changed;
    }
    private void replaceTranslations(Map<String, ProjectTranslation> source) { if (source == null) return; translations.clear(); source.forEach((locale, value) -> { if (locale != null && !locale.isBlank() && value != null) translations.put(locale.trim().toLowerCase(java.util.Locale.ROOT), value); }); }
    public void publish() { publicationStatus=PublicationStatus.PUBLISHED; visibility=Visibility.PUBLIC; archivedAt=null; if(publishedAt==null) publishedAt=Instant.now(); updatedAt=Instant.now(); }
    public void unpublish() { publicationStatus=PublicationStatus.DRAFT; publishedAt=null; updatedAt=Instant.now(); }
    public void archive() { publicationStatus=PublicationStatus.ARCHIVED; visibility=Visibility.PRIVATE; archivedAt=Instant.now(); publishedAt=null; updatedAt=Instant.now(); }
    public void restore() { publicationStatus=PublicationStatus.DRAFT; visibility=Visibility.PRIVATE; archivedAt=null; updatedAt=Instant.now(); }
    public void setDisplayOrder(int displayOrder) { this.displayOrder=displayOrder; this.updatedAt=Instant.now(); }
    public void prepareDuplicate(String newSlug) { id=null; slug=newSlug; title=title+" (copy)"; publicationStatus=PublicationStatus.DRAFT; visibility=Visibility.PRIVATE; featured=false; publishedAt=null; archivedAt=null; createdAt=Instant.now(); updatedAt=createdAt; media=new ArrayList<>(); version=0; }
    public void addMedia(ProjectMedia item) { media.add(item); updatedAt=Instant.now(); }
    public void removeMedia(ProjectMedia item) { media.remove(item); updatedAt=Instant.now(); }
    public UUID getId(){return id;} public String getTitle(){return title;} public String getSlug(){return slug;} public String getShortDescription(){return shortDescription;} public String getFullDescription(){return fullDescription;} public String getProblem(){return problem;} public String getContext(){return context;} public String getSolution(){return solution;} public String getRole(){return role;} public String getArchitecture(){return architecture;} public ProjectStatus getStatus(){return status;} public ProjectType getProjectType(){return projectType;} public FeatureLevel getFeatureLevel(){return featureLevel;} public boolean isFeatured(){return featured;} public int getDisplayOrder(){return displayOrder;} public Visibility getVisibility(){return visibility;} public PublicationStatus getPublicationStatus(){return publicationStatus;} public String getGithubUrl(){return githubUrl;} public String getDemoUrl(){return demoUrl;} public String getSeoTitle(){return seoTitle;} public String getSeoDescription(){return seoDescription;} public String getOpenGraphImageUrl(){return openGraphImageUrl;} public Instant getCreatedAt(){return createdAt;} public Instant getUpdatedAt(){return updatedAt;} public Instant getPublishedAt(){return publishedAt;} public Instant getArchivedAt(){return archivedAt;} public List<String> getObjectives(){return List.copyOf(objectives);} public List<String> getTechnologies(){return List.copyOf(technologies);} public List<String> getFeatures(){return List.copyOf(features);} public List<String> getDecisions(){return List.copyOf(decisions);} public List<String> getChallenges(){return List.copyOf(challenges);} public List<String> getLearnings(){return List.copyOf(learnings);} public List<String> getNextSteps(){return List.copyOf(nextSteps);} public List<ProjectMedia> getMedia(){return List.copyOf(media);} public Map<String,ProjectTranslation> getTranslations(){return Map.copyOf(translations);}
}
