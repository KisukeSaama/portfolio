package com.jonathan.portfolio.media;
import com.jonathan.portfolio.project.dto.ProjectWriteRequest;
import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.URL;
// The URL is rendered as an <img src>/<source src> on the public site, so it is restricted to http
// and https for the same reason the project links are. See ProjectWriteRequest.WEB_URL.
public record ExternalMediaRequest(@NotNull java.util.UUID projectId,@NotNull MediaType type,@NotBlank @URL @Pattern(regexp=ProjectWriteRequest.WEB_URL,message="Enter an http or https URL.") @Size(max=2048) String url,@NotBlank @Size(max=300) String alt,@Size(max=500) String caption,@Min(0) int sortOrder) {}
