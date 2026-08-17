package com.jonathan.portfolio.storage;

import com.jonathan.portfolio.common.exception.InvalidOperationException;
import com.jonathan.portfolio.common.exception.NotFoundException;
import java.io.*;
import java.nio.file.*;
import java.util.*;
import javax.imageio.ImageIO;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * Stores uploaded media on the local filesystem. The host directory behind {@code app.storage.directory}
 * is the only writable path the backend needs; it is mounted as a Docker volume so the container itself
 * stays read-only.
 */
@Service
public class StorageService {
    private static final Map<String,Set<String>> ALLOWED=Map.of("image/jpeg",Set.of("jpg","jpeg"),"image/png",Set.of("png"),"image/webp",Set.of("webp"),"image/avif",Set.of("avif"),"video/mp4",Set.of("mp4"),"video/webm",Set.of("webm"));
    private static final Map<String,String> MIME_BY_EXTENSION=ALLOWED.entrySet().stream().flatMap(e->e.getValue().stream().map(ext->Map.entry(ext,e.getKey()))).collect(java.util.stream.Collectors.toUnmodifiableMap(Map.Entry::getKey,Map.Entry::getValue));
    private final Path root; private final StorageProperties properties;
    public StorageService(StorageProperties properties){this.properties=properties;this.root=Path.of(properties.directory()).toAbsolutePath().normalize();}
    public UploadResult store(MultipartFile file)throws IOException{
        var mime=Optional.ofNullable(file.getContentType()).orElse("").toLowerCase();var extension=extension(file.getOriginalFilename());var allowed=ALLOWED.get(mime);
        if(allowed==null||!allowed.contains(extension))throw new InvalidOperationException("MIME type or extension not allowed.");
        boolean image=mime.startsWith("image/");long maximum=image?properties.maxImageBytes():properties.maxVideoBytes();if(file.isEmpty()||file.getSize()>maximum)throw new InvalidOperationException("Media size not allowed.");
        int width=0,height=0;if(image&&!mime.equals("image/avif")&&!mime.equals("image/webp")){var buffered=ImageIO.read(file.getInputStream());if(buffered==null)throw new InvalidOperationException("Unreadable image.");width=buffered.getWidth();height=buffered.getHeight();if(width>8000||height>8000)throw new InvalidOperationException("Dimensions too large.");}
        var key="projects/"+UUID.randomUUID()+"."+extension;var target=resolve(key);Files.createDirectories(target.getParent());
        // A fresh UUID cannot collide, so CREATE_NEW turns any surprise into a failure instead of a silent overwrite.
        try(var out=Files.newOutputStream(target,StandardOpenOption.CREATE_NEW,StandardOpenOption.WRITE)){out.write(file.getBytes());}
        return new UploadResult(key,mime,width,height);
    }
    public StoredObject load(String key){
        var path=resolve(key);
        if(!Files.isRegularFile(path))throw new NotFoundException("Media not found.");
        try{return new StoredObject(Files.readAllBytes(path),MIME_BY_EXTENSION.getOrDefault(extension(key),"application/octet-stream"));}
        catch(IOException e){throw new UncheckedIOException(e);}
    }
    public void delete(String key){try{Files.deleteIfExists(resolve(key));}catch(IOException e){throw new UncheckedIOException(e);}}
    /** Resolves a stored key under the storage root, rejecting anything that escapes it. */
    private Path resolve(String key){
        if(key==null||key.isBlank())throw new InvalidOperationException("Invalid media key.");
        var path=root.resolve(key).normalize();
        if(!path.startsWith(root))throw new InvalidOperationException("Invalid media key.");
        return path;
    }
    private String extension(String name){if(name==null||!name.contains("."))return "";return name.substring(name.lastIndexOf('.')+1).toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]","");}
    public record UploadResult(String key,String mimeType,int width,int height){}
}
