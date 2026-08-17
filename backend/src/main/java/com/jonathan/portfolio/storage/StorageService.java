package com.jonathan.portfolio.storage;

import com.jonathan.portfolio.common.exception.InvalidOperationException;
import java.io.*;
import java.util.*;
import javax.imageio.ImageIO;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

@Service
public class StorageService {
    private static final Map<String,Set<String>> ALLOWED=Map.of("image/jpeg",Set.of("jpg","jpeg"),"image/png",Set.of("png"),"image/webp",Set.of("webp"),"image/avif",Set.of("avif"),"video/mp4",Set.of("mp4"),"video/webm",Set.of("webm"));
    private final S3Client s3; private final StorageProperties properties;
    public StorageService(S3Client s3,StorageProperties properties){this.s3=s3;this.properties=properties;}
    public UploadResult store(MultipartFile file)throws IOException{
        var mime=Optional.ofNullable(file.getContentType()).orElse("").toLowerCase();var extension=extension(file.getOriginalFilename());var allowed=ALLOWED.get(mime);
        if(allowed==null||!allowed.contains(extension))throw new InvalidOperationException("Type MIME ou extension non autorisé.");
        boolean image=mime.startsWith("image/");long maximum=image?properties.maxImageBytes():properties.maxVideoBytes();if(file.isEmpty()||file.getSize()>maximum)throw new InvalidOperationException("Taille de média non autorisée.");
        int width=0,height=0;if(image&&!mime.equals("image/avif")&&!mime.equals("image/webp")){var buffered=ImageIO.read(file.getInputStream());if(buffered==null)throw new InvalidOperationException("Image illisible.");width=buffered.getWidth();height=buffered.getHeight();if(width>8000||height>8000)throw new InvalidOperationException("Dimensions trop importantes.");}
        var key="projects/"+UUID.randomUUID()+"."+extension;s3.putObject(PutObjectRequest.builder().bucket(properties.bucket()).key(key).contentType(mime).contentDisposition("inline").metadata(Map.of("uploaded-by","portfolio-admin")).build(),RequestBody.fromBytes(file.getBytes()));return new UploadResult(key,mime,width,height);
    }
    public StoredObject load(String key){var response=s3.getObjectAsBytes(GetObjectRequest.builder().bucket(properties.bucket()).key(key).build());return new StoredObject(response.asByteArray(),response.response().contentType());}
    public void delete(String key){s3.deleteObject(DeleteObjectRequest.builder().bucket(properties.bucket()).key(key).build());}
    private String extension(String name){if(name==null||!name.contains("."))return "";return name.substring(name.lastIndexOf('.')+1).toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]","");}
    public record UploadResult(String key,String mimeType,int width,int height){}
}
