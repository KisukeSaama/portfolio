package com.jonathan.portfolio.project.api;

import com.jonathan.portfolio.project.application.ProjectService;
import com.jonathan.portfolio.project.dto.ProjectResponse;
import io.swagger.v3.oas.annotations.Operation;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/v1/public/projects")
public class PublicProjectController {
    private final ProjectService service; public PublicProjectController(ProjectService service){this.service=service;}
    @GetMapping @Operation(summary="Liste des projets publiés et visibles") public List<ProjectResponse> list(){return service.publicProjects();}
    @GetMapping("/{slug}") @Operation(summary="Étude de cas publique par slug") public ProjectResponse detail(@PathVariable String slug){return service.publicProject(slug);}
}
