package com.jonathan.portfolio.audit;

import com.jonathan.portfolio.project.domain.Project;
import com.jonathan.portfolio.user.AdminUser;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.type.SqlTypes;

@Entity @Table(name="audit_log")
public class AuditLog {
    @Id @UuidGenerator private UUID id;
    @Enumerated(EnumType.STRING) @Column(nullable=false,length=64) private AuditAction action;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="actor_id") private AdminUser actor;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="project_id") private Project project;
    @JdbcTypeCode(SqlTypes.JSON) @Column(columnDefinition="jsonb") private String details;
    @Column(name="correlation_id",length=64) private String correlationId;
    @Column(name="created_at",nullable=false) private Instant createdAt=Instant.now();
    protected AuditLog() {}
    public AuditLog(AuditAction action, AdminUser actor, Project project, String details, String correlationId){this.action=action;this.actor=actor;this.project=project;this.details=details;this.correlationId=correlationId;}
    public UUID getId(){return id;} public AuditAction getAction(){return action;} public AdminUser getActor(){return actor;} public Project getProject(){return project;} public String getDetails(){return details;} public String getCorrelationId(){return correlationId;} public Instant getCreatedAt(){return createdAt;}
}
