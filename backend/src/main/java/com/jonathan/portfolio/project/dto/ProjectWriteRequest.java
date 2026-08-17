package com.jonathan.portfolio.project.dto;

import com.jonathan.portfolio.project.domain.*;
import jakarta.validation.constraints.*;
import java.util.List;
import org.hibernate.validator.constraints.URL;

public record ProjectWriteRequest(
    @NotBlank @Size(max=120) @Pattern(regexp="^[^<>]+$",message="Title contains characters that are not allowed.") String title,
    @NotBlank @Size(max=120) @Pattern(regexp="^[a-z0-9]+(?:-[a-z0-9]+)*$",message="Slug must use lowercase letters, digits and hyphens.") String slug,
    @NotBlank @Size(min=20,max=280) String shortDescription,
    @NotBlank @Size(min=40,max=10000) String fullDescription,
    @NotBlank @Size(min=20,max=5000) String problem,
    @NotNull @Size(max=5000) String context,
    @NotBlank @Size(min=20,max=5000) String solution,
    @NotBlank @Size(min=10,max=2000) String role,
    @NotNull @Size(max=5000) String architecture,
    @NotNull ProjectStatus status,
    @NotNull ProjectType projectType,
    @NotNull FeatureLevel featureLevel,
    boolean featured,
    @Min(0) @Max(9999) int displayOrder,
    @NotNull Visibility visibility,
    @NotNull @Size(max=20) List<@NotBlank @Size(max=500) String> objectives,
    @NotNull @Size(max=30) List<@NotBlank @Size(max=100) String> technologies,
    @NotNull @Size(max=40) List<@NotBlank @Size(max=500) String> features,
    @NotNull @Size(max=30) List<@NotBlank @Size(max=800) String> decisions,
    @NotNull @Size(max=30) List<@NotBlank @Size(max=800) String> challenges,
    @NotNull @Size(max=30) List<@NotBlank @Size(max=800) String> learnings,
    @NotNull @Size(max=30) List<@NotBlank @Size(max=800) String> nextSteps,
    @URL @Pattern(regexp=WEB_URL,message=WEB_URL_MESSAGE) @Size(max=2048) String githubUrl,
    @URL @Pattern(regexp=WEB_URL,message=WEB_URL_MESSAGE) @Size(max=2048) String demoUrl,
    @Size(max=70) String seoTitle,
    @Size(max=170) String seoDescription,
    @URL @Pattern(regexp=WEB_URL,message=WEB_URL_MESSAGE) @Size(max=2048) String openGraphImageUrl
) {
    /**
     * These end up in {@code href} and {@code src} attributes on the public site. Hibernate's
     * {@code @URL} accepts every scheme the JDK has a handler for, so on its own it lets through
     * {@code file:} and {@code jar:} URLs; the site only ever needs http and https.
     */
    public static final String WEB_URL = "^(?:https?://[^\\s<>\"']+)?$";
    static final String WEB_URL_MESSAGE = "Enter an http or https URL.";
}
