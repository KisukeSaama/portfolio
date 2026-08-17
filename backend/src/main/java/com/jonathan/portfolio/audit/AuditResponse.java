package com.jonathan.portfolio.audit;
import java.time.Instant;
import java.util.UUID;
public record AuditResponse(UUID id,AuditAction action,String actorEmail,UUID projectId,String projectTitle,String details,String correlationId,Instant createdAt){static AuditResponse from(AuditLog log){return new AuditResponse(log.getId(),log.getAction(),log.getActor()==null?null:log.getActor().getEmail(),log.getProject()==null?null:log.getProject().getId(),log.getProject()==null?null:log.getProject().getTitle(),log.getDetails(),log.getCorrelationId(),log.getCreatedAt());}}
