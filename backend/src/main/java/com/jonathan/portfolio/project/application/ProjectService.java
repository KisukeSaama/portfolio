package com.jonathan.portfolio.project.application;

import com.jonathan.portfolio.audit.*;
import com.jonathan.portfolio.common.exception.*;
import com.jonathan.portfolio.project.domain.*;
import com.jonathan.portfolio.project.dto.*;
import com.jonathan.portfolio.project.infrastructure.ProjectRepository;
import com.jonathan.portfolio.security.CurrentAdmin;
import jakarta.servlet.http.HttpServletRequest;
import java.util.*;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProjectService {
    private final ProjectRepository projects; private final AuditService audit; private final CurrentAdmin currentAdmin;
    public ProjectService(ProjectRepository projects,AuditService audit,CurrentAdmin currentAdmin){this.projects=projects;this.audit=audit;this.currentAdmin=currentAdmin;}

    @Transactional(readOnly=true)
    public List<ProjectResponse> publicProjects(){return projects.findAllByPublicationStatusAndVisibilityAndArchivedAtIsNullOrderByDisplayOrderAscUpdatedAtDesc(PublicationStatus.PUBLISHED,Visibility.PUBLIC).stream().map(ProjectResponse::from).toList();}
    @Transactional(readOnly=true)
    public ProjectResponse publicProject(String slug){return ProjectResponse.from(projects.findBySlugAndPublicationStatusAndVisibilityAndArchivedAtIsNull(slug,PublicationStatus.PUBLISHED,Visibility.PUBLIC).orElseThrow(()->new NotFoundException("Projet introuvable.")));}
    @Transactional(readOnly=true)
    public ProjectResponse adminProject(UUID id){return ProjectResponse.from(find(id));}
    @Transactional(readOnly=true)
    public Page<ProjectResponse> adminProjects(String query,PublicationStatus status,Pageable pageable){
        Specification<Project> spec=(root,q,cb)->cb.conjunction();
        if(query!=null&&!query.isBlank()) spec=spec.and((root,q,cb)->cb.or(cb.like(cb.lower(root.get("title")),"%"+query.toLowerCase(Locale.ROOT)+"%"),cb.like(cb.lower(root.get("slug")),"%"+query.toLowerCase(Locale.ROOT)+"%")));
        if(status!=null) spec=spec.and((root,q,cb)->cb.equal(root.get("publicationStatus"),status));
        return projects.findAll(spec,pageable).map(ProjectResponse::from);
    }
    @Transactional(readOnly=true)
    public DashboardResponse dashboard(){
        var all=projects.findAll(Sort.by(Sort.Order.asc("displayOrder")));
        long noCover=all.stream().filter(p->p.getMedia().stream().noneMatch(m->m.getType()==com.jonathan.portfolio.media.MediaType.COVER)).count();
        long incomplete=all.stream().filter(p->p.getFullDescription().length()<80||p.getProblem().length()<40).count();
        var recent=all.stream().sorted(Comparator.comparing(Project::getUpdatedAt).reversed()).limit(6).map(ProjectResponse::from).toList();
        return new DashboardResponse(projects.countByPublicationStatus(PublicationStatus.PUBLISHED),projects.countByPublicationStatus(PublicationStatus.DRAFT),projects.countByPublicationStatus(PublicationStatus.ARCHIVED),noCover,incomplete,recent);
    }
    @Transactional
    public ProjectResponse create(ProjectWriteRequest input,Authentication auth,HttpServletRequest request){
        validateContent(input); if(projects.existsBySlugIgnoreCase(input.slug())) throw new ConflictException("Ce slug est déjà utilisé.");
        var project=projects.save(new Project(input)); audit.record(AuditAction.PROJECT_CREATE,currentAdmin.id(auth),project,"{\"status\":\"DRAFT\"}",request); return ProjectResponse.from(project);
    }
    @Transactional
    public ProjectResponse update(UUID id,ProjectWriteRequest input,Authentication auth,HttpServletRequest request){
        validateContent(input); var project=find(id); if(projects.existsBySlugIgnoreCaseAndIdNot(input.slug(),id)) throw new ConflictException("Ce slug est déjà utilisé.");
        var oldSlug=project.getSlug(); project.apply(input); audit.record(AuditAction.PROJECT_UPDATE,currentAdmin.id(auth),project,null,request);
        if(!oldSlug.equals(project.getSlug())) audit.record(AuditAction.PROJECT_SLUG_CHANGE,currentAdmin.id(auth),project,"{\"from\":\""+escape(oldSlug)+"\",\"to\":\""+escape(project.getSlug())+"\"}",request);
        return ProjectResponse.from(project);
    }
    @Transactional public ProjectResponse publish(UUID id,Authentication auth,HttpServletRequest request){return transition(id,auth,request,AuditAction.PROJECT_PUBLISH,Project::publish);}
    @Transactional public ProjectResponse unpublish(UUID id,Authentication auth,HttpServletRequest request){return transition(id,auth,request,AuditAction.PROJECT_UNPUBLISH,Project::unpublish);}
    @Transactional public ProjectResponse archive(UUID id,Authentication auth,HttpServletRequest request){return transition(id,auth,request,AuditAction.PROJECT_ARCHIVE,Project::archive);}
    @Transactional public ProjectResponse restore(UUID id,Authentication auth,HttpServletRequest request){return transition(id,auth,request,AuditAction.PROJECT_RESTORE,Project::restore);}
    private ProjectResponse transition(UUID id,Authentication auth,HttpServletRequest request,AuditAction action,java.util.function.Consumer<Project> operation){var project=find(id);operation.accept(project);audit.record(action,currentAdmin.id(auth),project,null,request);return ProjectResponse.from(project);}
    @Transactional
    public ProjectResponse duplicate(UUID id,Authentication auth,HttpServletRequest request){
        var source=find(id); var slug=uniqueCopySlug(source.getSlug()); var input=new ProjectWriteRequest(source.getTitle()+" — copie",slug,source.getShortDescription(),source.getFullDescription(),source.getProblem(),source.getContext(),source.getSolution(),source.getRole(),source.getArchitecture(),source.getStatus(),source.getProjectType(),source.getFeatureLevel(),false,source.getDisplayOrder()+1,Visibility.PRIVATE,source.getObjectives(),source.getTechnologies(),source.getFeatures(),source.getDecisions(),source.getChallenges(),source.getLearnings(),source.getNextSteps(),source.getGithubUrl(),source.getDemoUrl(),source.getSeoTitle(),source.getSeoDescription(),source.getOpenGraphImageUrl());
        var copy=projects.save(new Project(input));audit.record(AuditAction.PROJECT_DUPLICATE,currentAdmin.id(auth),copy,"{\"sourceProjectId\":\""+id+"\"}",request);return ProjectResponse.from(copy);
    }
    @Transactional
    public void reorder(ReorderRequest input,Authentication auth,HttpServletRequest request){int order=1;for(UUID id:input.projectIds()){find(id).setDisplayOrder(order++);}audit.record(AuditAction.PROJECT_REORDER,currentAdmin.id(auth),null,"{\"count\":"+input.projectIds().size()+"}",request);}
    @Transactional
    public void delete(UUID id,String confirmation,Authentication auth,HttpServletRequest request){var project=find(id);if(project.getPublicationStatus()!=PublicationStatus.ARCHIVED||!project.getTitle().equals(confirmation))throw new InvalidOperationException("Archivez le projet et saisissez son titre exact avant la suppression définitive.");audit.record(AuditAction.PROJECT_DELETE,currentAdmin.id(auth),project,"{\"title\":\""+escape(project.getTitle())+"\"}",request);projects.delete(project);}
    private Project find(UUID id){return projects.findById(id).orElseThrow(()->new NotFoundException("Projet introuvable."));}
    private String uniqueCopySlug(String source){var base=source+"-copie";var slug=base;var suffix=2;while(projects.existsBySlugIgnoreCase(slug))slug=base+"-"+suffix++;return slug;}
    private void validateContent(ProjectWriteRequest r){var strings=new ArrayList<String>(List.of(r.title(),r.shortDescription(),r.fullDescription(),r.problem(),r.context(),r.solution(),r.role(),r.architecture()));strings.addAll(r.objectives());strings.addAll(r.features());strings.addAll(r.decisions());strings.addAll(r.challenges());strings.addAll(r.learnings());strings.addAll(r.nextSteps());if(strings.stream().anyMatch(v->v.contains("<")||v.contains(">")))throw new InvalidOperationException("Le contenu HTML n’est pas accepté. Utilisez du texte brut.");}
    private static String escape(String value){return value.replace("\\","\\\\").replace("\"","\\\"");}
}
