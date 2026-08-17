package com.jonathan.portfolio.storage;
import org.springframework.boot.context.properties.ConfigurationProperties;
/** Local filesystem storage. {@code directory} is a host path mounted into the container as a volume. */
@ConfigurationProperties("app.storage")
public record StorageProperties(String directory,long maxImageBytes,long maxVideoBytes) {}
