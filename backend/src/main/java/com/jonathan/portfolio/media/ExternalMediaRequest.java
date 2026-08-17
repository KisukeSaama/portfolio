package com.jonathan.portfolio.media;
import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.URL;
public record ExternalMediaRequest(@NotNull java.util.UUID projectId,@NotNull MediaType type,@NotBlank @URL @Size(max=2048) String url,@NotBlank @Size(max=300) String alt,@Size(max=500) String caption,@Min(0) int sortOrder) {}
