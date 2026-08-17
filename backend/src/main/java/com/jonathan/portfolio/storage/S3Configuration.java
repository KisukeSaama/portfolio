package com.jonathan.portfolio.storage;

import java.net.URI;
import org.springframework.context.annotation.*;
import software.amazon.awssdk.auth.credentials.*;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.*;

@Configuration
public class S3Configuration {
    @Bean S3Client s3Client(StorageProperties p){return S3Client.builder().endpointOverride(URI.create(p.endpoint())).region(Region.of(p.region())).credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(p.accessKey(),p.secretKey()))).forcePathStyle(true).build();}
}
