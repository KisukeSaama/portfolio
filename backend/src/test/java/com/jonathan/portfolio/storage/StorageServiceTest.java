package com.jonathan.portfolio.storage;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import com.jonathan.portfolio.common.exception.InvalidOperationException;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;
import software.amazon.awssdk.services.s3.S3Client;

class StorageServiceTest {
    @Test void rejectsExecutableEvenWhenUploadedAsMultipart(){var properties=new StorageProperties("bucket","eu-west-3","http://localhost","key","secret","http://localhost",1024,2048);var service=new StorageService(mock(S3Client.class),properties);var file=new MockMultipartFile("file","payload.exe","application/octet-stream",new byte[]{1,2,3});assertThatThrownBy(()->service.store(file)).isInstanceOf(InvalidOperationException.class).hasMessageContaining("non autorisé");}
}
