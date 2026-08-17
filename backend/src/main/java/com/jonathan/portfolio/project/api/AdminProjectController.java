package com.jonathan.portfolio.project.api;

import com.jonathan.portfolio.project.application.ProjectService;
import com.jonathan.portfolio.project.domain.PublicationStatus;
import com.jonathan.portfolio.project.dto.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/v1/admin/projects")
public class AdminProjectController {
    private final ProjectService service; public AdminProjectController(ProjectService service){this.service=service;}
    @GetMapping public Page<ProjectResponse> list(@RequestParam(defaultValue="") String query,@RequestParam(required=false) PublicationStatus status,@PageableDefault(size=20,sort="displayOrder") Pageable pageable){return service.adminProjects(query,status,pageable);}
    @GetMapping("/{id}") public ProjectResponse detail(@PathVariable UUID id){return service.adminProject(id);}
    @GetMapping("/{id}/preview") public ProjectResponse preview(@PathVariable UUID id){return service.adminProject(id);}
    @GetMapping("/dashboard") public DashboardResponse dashboard(){return service.dashboard();}
    @PostMapping public ResponseEntity<ProjectResponse> create(@Valid @RequestBody ProjectWriteRequest body,Authentication auth,HttpServletRequest request){return ResponseEntity.status(HttpStatus.CREATED).body(service.create(body,auth,request));}
    @PutMapping("/{id}") public ProjectResponse update(@PathVariable UUID id,@Valid @RequestBody ProjectWriteRequest body,Authentication auth,HttpServletRequest request){return service.update(id,body,auth,request);}
    @PostMapping("/{id}/publish") public ProjectResponse publish(@PathVariable UUID id,Authentication auth,HttpServletRequest request){return service.publish(id,auth,request);}
    @PostMapping("/{id}/unpublish") public ProjectResponse unpublish(@PathVariable UUID id,Authentication auth,HttpServletRequest request){return service.unpublish(id,auth,request);}
    @PostMapping("/{id}/archive") public ProjectResponse archive(@PathVariable UUID id,Authentication auth,HttpServletRequest request){return service.archive(id,auth,request);}
    @PostMapping("/{id}/restore") public ProjectResponse restore(@PathVariable UUID id,Authentication auth,HttpServletRequest request){return service.restore(id,auth,request);}
    @PostMapping("/{id}/duplicate") public ResponseEntity<ProjectResponse> duplicate(@PathVariable UUID id,Authentication auth,HttpServletRequest request){return ResponseEntity.status(HttpStatus.CREATED).body(service.duplicate(id,auth,request));}
    @PutMapping("/reorder") @ResponseStatus(HttpStatus.NO_CONTENT) public void reorder(@Valid @RequestBody ReorderRequest body,Authentication auth,HttpServletRequest request){service.reorder(body,auth,request);}
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable UUID id,@RequestHeader("X-Confirm-Project-Title") String confirmation,Authentication auth,HttpServletRequest request){service.delete(id,confirmation,auth,request);}
}
