package com.jonathan.portfolio.project.api;

import com.jonathan.portfolio.project.application.ProjectService;
import com.jonathan.portfolio.project.dto.ProjectResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/v1/public/projects")
public class PublicProjectController {
    private final ProjectService service; public PublicProjectController(ProjectService service){this.service=service;}

    /**
     * The locale is a query parameter rather than an {@code Accept-Language} header on purpose. The
     * site decides the language from the URL the visitor is on, and a caching proxy in front of this
     * API keys on the URL; taking it from a header would serve the French page's content to the
     * English one as soon as anything cached.
     */
    private static final String LOCALE_DOC="Language tag for the returned prose. Anything untranslated falls back to English.";

    @GetMapping @Operation(summary="List published and visible projects")
    public List<ProjectResponse> list(@RequestParam(required=false) @Parameter(description=LOCALE_DOC) String locale){return service.publicProjects(locale);}

    @GetMapping("/{slug}") @Operation(summary="Public case study by slug")
    public ProjectResponse detail(@PathVariable String slug,@RequestParam(required=false) @Parameter(description=LOCALE_DOC) String locale){return service.publicProject(slug,locale);}
}
