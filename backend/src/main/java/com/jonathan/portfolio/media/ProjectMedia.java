package com.jonathan.portfolio.media;

import com.jonathan.portfolio.project.domain.Project;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "project_media")
public class ProjectMedia {
    @Id @UuidGenerator private UUID id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "project_id") private Project project;
    @Enumerated(EnumType.STRING) @Column(name = "media_type", nullable = false, length = 32) private MediaType type;
    @Column(name = "object_key", length = 512) private String objectKey;
    @Column(name = "external_url", length = 2048) private String externalUrl;
    @Column(name = "alt_text", nullable = false, length = 300) private String altText;
    @Column(length = 500) private String caption;
    @Column(name = "mime_type", length = 100) private String mimeType;
    private Integer width;
    private Integer height;
    @Column(name = "duration_seconds") private Integer durationSeconds;
    @Column(name = "sort_order", nullable = false) private int sortOrder;
    @Column(name = "created_at", nullable = false) private Instant createdAt = Instant.now();

    protected ProjectMedia() {}
    public static ProjectMedia external(Project project, MediaType type, String url, String altText, String caption, int sortOrder) {
        var media = new ProjectMedia(); media.project = project; media.type = type; media.externalUrl = url; media.altText = altText; media.caption = caption; media.sortOrder = sortOrder; return media;
    }
    public static ProjectMedia stored(Project project, MediaType type, String objectKey, String altText, String mimeType, int width, int height, int sortOrder) {
        var media = new ProjectMedia(); media.project = project; media.type = type; media.objectKey = objectKey; media.altText = altText; media.mimeType = mimeType; media.width = width > 0 ? width : null; media.height = height > 0 ? height : null; media.sortOrder = sortOrder; return media;
    }
    public UUID getId() { return id; }
    public MediaType getType() { return type; }
    public String getObjectKey() { return objectKey; }
    public String getExternalUrl() { return externalUrl; }
    public String getAltText() { return altText; }
    public String getCaption() { return caption; }
    public String getMimeType() { return mimeType; }
    public Integer getWidth() { return width; }
    public Integer getHeight() { return height; }
    public Integer getDurationSeconds() { return durationSeconds; }
    public int getSortOrder() { return sortOrder; }
}
