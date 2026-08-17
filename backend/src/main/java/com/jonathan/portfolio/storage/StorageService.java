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
    /** Enough bytes to cover every signature below, including the ISO base media file type box. */
    private static final int HEADER_BYTES=32;
    private final Path root; private final StorageProperties properties;
    public StorageService(StorageProperties properties){this.properties=properties;this.root=Path.of(properties.directory()).toAbsolutePath().normalize();}
    public UploadResult store(MultipartFile file)throws IOException{
        var mime=Optional.ofNullable(file.getContentType()).orElse("").toLowerCase(Locale.ROOT);var extension=extension(file.getOriginalFilename());var allowed=ALLOWED.get(mime);
        if(allowed==null||!allowed.contains(extension))throw new InvalidOperationException("MIME type or extension not allowed.");
        boolean image=mime.startsWith("image/");long maximum=image?properties.maxImageBytes():properties.maxVideoBytes();if(file.isEmpty()||file.getSize()>maximum)throw new InvalidOperationException("Media size not allowed.");
        // The declared type is the caller's filename and Content-Type header, both free text. The
        // bytes are the only part of an upload the caller cannot lie about, so they decide.
        if(!mime.equals(sniff(header(file))))throw new InvalidOperationException("File content does not match its declared type.");
        int width=0,height=0;if(image&&!mime.equals("image/avif")&&!mime.equals("image/webp")){try(var input=file.getInputStream()){var buffered=ImageIO.read(input);if(buffered==null)throw new InvalidOperationException("Unreadable image.");width=buffered.getWidth();height=buffered.getHeight();}if(width>8000||height>8000)throw new InvalidOperationException("Dimensions too large.");}
        var key="projects/"+UUID.randomUUID()+"."+extension;var target=resolve(key);Files.createDirectories(target.getParent());
        // A fresh UUID cannot collide, so CREATE_NEW turns any surprise into a failure instead of a silent overwrite.
        try(var in=file.getInputStream();var out=Files.newOutputStream(target,StandardOpenOption.CREATE_NEW,StandardOpenOption.WRITE)){in.transferTo(out);}
        return new UploadResult(key,mime,width,height);
    }
    /** Opens the stored file for streaming. Reading it into a byte[] would put a whole video on the heap per request. */
    public StoredObject load(String key){
        var path=resolve(key);
        if(!Files.isRegularFile(path))throw new NotFoundException("Media not found.");
        try{return new StoredObject(path,Files.size(path),MIME_BY_EXTENSION.getOrDefault(extension(key),"application/octet-stream"));}
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
    private static byte[] header(MultipartFile file)throws IOException{try(var in=file.getInputStream()){return in.readNBytes(HEADER_BYTES);}}
    /** Returns the MIME type the bytes actually describe, or {@code null} when nothing matches. */
    static String sniff(byte[] head){
        if(head.length<12)return null;
        if(starts(head,0,0xFF,0xD8,0xFF))return "image/jpeg";
        if(starts(head,0,0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A))return "image/png";
        if(ascii(head,0,"RIFF")&&ascii(head,8,"WEBP"))return "image/webp";
        if(starts(head,0,0x1A,0x45,0xDF,0xA3))return "video/webm";
        // ISO base media: the four bytes after the box size are "ftyp", then the major brand.
        if(ascii(head,4,"ftyp")){
            var brand=new String(head,8,4,java.nio.charset.StandardCharsets.US_ASCII).toLowerCase(Locale.ROOT);
            if(brand.equals("avif")||brand.equals("avis")||brand.equals("mif1")||brand.equals("miaf"))return "image/avif";
            return "video/mp4";
        }
        return null;
    }
    private static boolean starts(byte[] head,int offset,int... signature){
        if(head.length<offset+signature.length)return false;
        for(var i=0;i<signature.length;i++)if((head[offset+i]&0xFF)!=signature[i])return false;
        return true;
    }
    private static boolean ascii(byte[] head,int offset,String text){
        if(head.length<offset+text.length())return false;
        return new String(head,offset,text.length(),java.nio.charset.StandardCharsets.US_ASCII).equals(text);
    }
    private String extension(String name){if(name==null||!name.contains("."))return "";return name.substring(name.lastIndexOf('.')+1).toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]","");}
    public record UploadResult(String key,String mimeType,int width,int height){}
}
