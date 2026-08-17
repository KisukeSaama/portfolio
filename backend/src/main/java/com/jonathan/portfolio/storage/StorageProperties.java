package com.jonathan.portfolio.storage;
import org.springframework.boot.context.properties.ConfigurationProperties;
@ConfigurationProperties("app.storage")
public record StorageProperties(String bucket,String region,String endpoint,String accessKey,String secretKey,String publicBaseUrl,long maxImageBytes,long maxVideoBytes) {}
