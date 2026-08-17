package com.jonathan.portfolio.project.dto;

import static com.jonathan.portfolio.project.domain.ProjectTranslation.pick;

import com.jonathan.portfolio.project.domain.*;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * A project as the API returns it, already resolved to one language. The public site asks for a
 * locale and gets a flat object, so no page has to know that a translation is an overlay or which
 * fields came from which layer. The administration area asks for none and gets the source language,
 * which is what it edits.
 */
public record ProjectResponse(UUID id,String title,String slug,String shortDescription,String fullDescription,String problem,String context,List<String> objectives,String solution,String role,String architecture,ProjectStatus status,ProjectType projectType,FeatureLevel featureLevel,boolean featured,int displayOrder,Visibility visibility,PublicationStatus publicationStatus,List<String> technologies,List<String> features,List<String> decisions,List<String> challenges,List<String> learnings,List<String> nextSteps,String githubUrl,String demoUrl,String seoTitle,String seoDescription,String openGraphImageUrl,Instant createdAt,Instant updatedAt,Instant publishedAt,Instant archivedAt,List<MediaResponse> media,java.util.Map<String,ProjectTranslation> translations) {

    /** The source language, with every translation attached. What the administration area edits. */
    public static ProjectResponse from(Project p){return build(p,ProjectTranslation.empty(),p.getTranslations());}

    /**
     * Resolved for one locale, with the translations dropped from the payload. A visitor reading the
     * French site has no use for the English source, and shipping it would double every response.
     */
    public static ProjectResponse from(Project p,String locale){
        var translation=locale==null?null:p.getTranslations().get(locale.toLowerCase(java.util.Locale.ROOT));
        return build(p,translation==null?ProjectTranslation.empty():translation,java.util.Map.of());
    }

    private static ProjectResponse build(Project p,ProjectTranslation t,java.util.Map<String,ProjectTranslation> translations){
        return new ProjectResponse(p.getId(),pick(t.title(),p.getTitle()),p.getSlug(),pick(t.shortDescription(),p.getShortDescription()),pick(t.fullDescription(),p.getFullDescription()),pick(t.problem(),p.getProblem()),pick(t.context(),p.getContext()),pick(t.objectives(),p.getObjectives()),pick(t.solution(),p.getSolution()),pick(t.role(),p.getRole()),pick(t.architecture(),p.getArchitecture()),p.getStatus(),p.getProjectType(),p.getFeatureLevel(),p.isFeatured(),p.getDisplayOrder(),p.getVisibility(),p.getPublicationStatus(),p.getTechnologies(),pick(t.features(),p.getFeatures()),pick(t.decisions(),p.getDecisions()),pick(t.challenges(),p.getChallenges()),pick(t.learnings(),p.getLearnings()),pick(t.nextSteps(),p.getNextSteps()),p.getGithubUrl(),p.getDemoUrl(),pick(t.seoTitle(),p.getSeoTitle()),pick(t.seoDescription(),p.getSeoDescription()),p.getOpenGraphImageUrl(),p.getCreatedAt(),p.getUpdatedAt(),p.getPublishedAt(),p.getArchivedAt(),p.getMedia().stream().map(MediaResponse::from).toList(),translations);
    }
}
