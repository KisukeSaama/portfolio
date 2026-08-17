package com.jonathan.portfolio.project.domain;

import jakarta.validation.constraints.Size;
import java.util.List;

/**
 * One locale's version of everything on a project that is prose.
 *
 * <p>A project row holds the site's source language, English. This record holds the same fields
 * again for another locale, and a project keeps a map of them keyed by language tag. Nothing here is
 * required: a field left blank falls back to the English one, so a half-finished translation shows
 * the parts that exist rather than blocking publication or printing empty headings.
 *
 * <p>Two fields are deliberately absent. The slug is an address, not prose, and translating it would
 * give the same case study two URLs. Technologies are proper nouns; "Spring Boot" is "Spring Boot".
 */
public record ProjectTranslation(
    @Size(max = 120) String title,
    @Size(max = 280) String shortDescription,
    @Size(max = 10000) String fullDescription,
    @Size(max = 5000) String problem,
    @Size(max = 5000) String context,
    @Size(max = 5000) String solution,
    @Size(max = 2000) String role,
    @Size(max = 5000) String architecture,
    @Size(max = 20) List<@Size(max = 500) String> objectives,
    @Size(max = 40) List<@Size(max = 500) String> features,
    @Size(max = 30) List<@Size(max = 800) String> decisions,
    @Size(max = 30) List<@Size(max = 800) String> challenges,
    @Size(max = 30) List<@Size(max = 800) String> learnings,
    @Size(max = 30) List<@Size(max = 800) String> nextSteps,
    @Size(max = 70) String seoTitle,
    @Size(max = 170) String seoDescription) {

    /** Jackson omits absent keys, so every list arrives possibly null and is normalized once here. */
    public ProjectTranslation {
        objectives = copy(objectives);
        features = copy(features);
        decisions = copy(decisions);
        challenges = copy(challenges);
        learnings = copy(learnings);
        nextSteps = copy(nextSteps);
    }

    private static List<String> copy(List<String> values) {
        return values == null
                ? List.of()
                : values.stream().filter(v -> v != null && !v.isBlank()).map(String::trim).toList();
    }

    /** The overlay used when a project has no entry for the requested locale at all. */
    public static ProjectTranslation empty() {
        return new ProjectTranslation(
                null, null, null, null, null, null, null, null, null, null, null, null, null, null,
                null, null);
    }

    /** A blank translation is not a translation: the caller falls back to the source language. */
    public static String pick(String translated, String source) {
        return translated == null || translated.isBlank() ? source : translated;
    }

    public static List<String> pick(List<String> translated, List<String> source) {
        return translated == null || translated.isEmpty() ? source : translated;
    }
}
