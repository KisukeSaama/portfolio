package com.jonathan.portfolio.project.dto;
import com.jonathan.portfolio.media.*;
import java.util.UUID;
public record MediaResponse(UUID id, MediaType type, String url, String alt, String caption, String mimeType, Integer width, Integer height, Integer durationSeconds, int sortOrder) {
    public static MediaResponse from(ProjectMedia media){return new MediaResponse(media.getId(),media.getType(),media.getExternalUrl()!=null?media.getExternalUrl():"/api/v1/public/media/"+media.getId(),media.getAltText(),media.getCaption(),media.getMimeType(),media.getWidth(),media.getHeight(),media.getDurationSeconds(),media.getSortOrder());}
}
