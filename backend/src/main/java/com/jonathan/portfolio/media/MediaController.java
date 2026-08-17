package com.jonathan.portfolio.media;

import com.jonathan.portfolio.project.dto.MediaResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.io.IOException;
import java.util.UUID;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class MediaController {
    private final MediaService service; public MediaController(MediaService service){this.service=service;}
    @PostMapping(value="/api/v1/admin/media",consumes=org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE) public ResponseEntity<MediaResponse> upload(@RequestParam UUID projectId,@RequestParam com.jonathan.portfolio.media.MediaType type,@RequestParam String alt,@RequestParam(defaultValue="0") int sortOrder,@RequestPart MultipartFile file,Authentication auth,HttpServletRequest request)throws IOException{return ResponseEntity.status(201).body(service.addFile(projectId,type,alt,sortOrder,file,auth,request));}
    @PostMapping("/api/v1/admin/media/external") public ResponseEntity<MediaResponse> external(@Valid @RequestBody ExternalMediaRequest body,Authentication auth,HttpServletRequest request){return ResponseEntity.status(201).body(service.addExternal(body,auth,request));}
    @DeleteMapping("/api/v1/admin/media/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable UUID id,Authentication auth,HttpServletRequest request){service.delete(id,auth,request);}
    @GetMapping("/api/v1/public/media/{id}") public ResponseEntity<byte[]> publicMedia(@PathVariable UUID id){var media=service.publicObject(id);return ResponseEntity.ok().cacheControl(CacheControl.maxAge(java.time.Duration.ofHours(1)).cachePublic()).contentType(org.springframework.http.MediaType.parseMediaType(media.contentType())).header("X-Content-Type-Options","nosniff").body(media.bytes());}
}
