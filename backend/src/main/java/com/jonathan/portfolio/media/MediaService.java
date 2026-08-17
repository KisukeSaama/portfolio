package com.jonathan.portfolio.media;

import com.jonathan.portfolio.audit.*;
import com.jonathan.portfolio.common.exception.NotFoundException;
import com.jonathan.portfolio.project.dto.MediaResponse;
import com.jonathan.portfolio.project.infrastructure.ProjectRepository;
import com.jonathan.portfolio.security.CurrentAdmin;
import com.jonathan.portfolio.storage.StorageService;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.UUID;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class MediaService {
    private final ProjectRepository projects;private final ProjectMediaRepository media;private final StorageService storage;private final AuditService audit;private final CurrentAdmin currentAdmin;
    public MediaService(ProjectRepository projects,ProjectMediaRepository media,StorageService storage,AuditService audit,CurrentAdmin currentAdmin){this.projects=projects;this.media=media;this.storage=storage;this.audit=audit;this.currentAdmin=currentAdmin;}
    @Transactional public MediaResponse addFile(UUID projectId,MediaType type,String alt,int sortOrder,MultipartFile file,Authentication auth,HttpServletRequest request)throws IOException{var project=projects.findById(projectId).orElseThrow(()->new NotFoundException("Project not found."));var stored=storage.store(file);var item=ProjectMedia.stored(project,type,stored.key(),alt,stored.mimeType(),stored.width(),stored.height(),sortOrder);project.addMedia(item);media.save(item);audit.record(AuditAction.MEDIA_ADD,currentAdmin.id(auth),project,"{\"type\":\""+type+"\"}",request);return MediaResponse.from(item);}
    @Transactional public MediaResponse addExternal(ExternalMediaRequest input,Authentication auth,HttpServletRequest request){var project=projects.findById(input.projectId()).orElseThrow(()->new NotFoundException("Project not found."));var item=ProjectMedia.external(project,input.type(),input.url(),input.alt(),input.caption(),input.sortOrder());project.addMedia(item);media.save(item);audit.record(AuditAction.MEDIA_ADD,currentAdmin.id(auth),project,"{\"type\":\""+input.type()+"\",\"source\":\"external\"}",request);return MediaResponse.from(item);}
    @Transactional public void delete(UUID id,Authentication auth,HttpServletRequest request){var item=media.findById(id).orElseThrow(()->new NotFoundException("Media not found."));var projectId=item.getId();if(item.getObjectKey()!=null)storage.delete(item.getObjectKey());media.delete(item);audit.record(AuditAction.MEDIA_DELETE,currentAdmin.id(auth),null,"{\"mediaId\":\""+projectId+"\"}",request);}
    @Transactional(readOnly=true) public com.jonathan.portfolio.storage.StoredObject publicObject(UUID id){var item=media.findPublicById(id).orElseThrow(()->new NotFoundException("Media not found."));if(item.getObjectKey()==null)throw new NotFoundException("Media not found.");return storage.load(item.getObjectKey());}
}
