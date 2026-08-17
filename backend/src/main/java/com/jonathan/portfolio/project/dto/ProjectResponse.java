package com.jonathan.portfolio.project.dto;

import com.jonathan.portfolio.project.domain.*;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ProjectResponse(UUID id,String title,String slug,String shortDescription,String fullDescription,String problem,String context,List<String> objectives,String solution,String role,String architecture,ProjectStatus status,ProjectType projectType,FeatureLevel featureLevel,boolean featured,int displayOrder,Visibility visibility,PublicationStatus publicationStatus,List<String> technologies,List<String> features,List<String> decisions,List<String> challenges,List<String> learnings,List<String> nextSteps,String githubUrl,String demoUrl,String seoTitle,String seoDescription,String openGraphImageUrl,Instant createdAt,Instant updatedAt,Instant publishedAt,Instant archivedAt,List<MediaResponse> media) {
    public static ProjectResponse from(Project p){return new ProjectResponse(p.getId(),p.getTitle(),p.getSlug(),p.getShortDescription(),p.getFullDescription(),p.getProblem(),p.getContext(),p.getObjectives(),p.getSolution(),p.getRole(),p.getArchitecture(),p.getStatus(),p.getProjectType(),p.getFeatureLevel(),p.isFeatured(),p.getDisplayOrder(),p.getVisibility(),p.getPublicationStatus(),p.getTechnologies(),p.getFeatures(),p.getDecisions(),p.getChallenges(),p.getLearnings(),p.getNextSteps(),p.getGithubUrl(),p.getDemoUrl(),p.getSeoTitle(),p.getSeoDescription(),p.getOpenGraphImageUrl(),p.getCreatedAt(),p.getUpdatedAt(),p.getPublishedAt(),p.getArchivedAt(),p.getMedia().stream().map(MediaResponse::from).toList());}
}
