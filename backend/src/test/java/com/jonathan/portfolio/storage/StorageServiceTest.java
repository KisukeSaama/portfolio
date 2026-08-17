package com.jonathan.portfolio.storage;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import com.jonathan.portfolio.common.exception.InvalidOperationException;
import java.nio.file.*;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;

class StorageServiceTest {
    private StorageService service(Path root){return new StorageService(new StorageProperties(root.toString(),1024*1024,2048*1024));}

    @Test void rejectsExecutableEvenWhenUploadedAsMultipart(@TempDir Path root){
        var file=new MockMultipartFile("file","payload.exe","application/octet-stream",new byte[]{1,2,3});
        assertThatThrownBy(()->service(root).store(file)).isInstanceOf(InvalidOperationException.class).hasMessageContaining("not allowed");
    }

    @Test void storesAndReadsBackAnImage(@TempDir Path root)throws Exception{
        var service=service(root);
        var stored=service.store(new MockMultipartFile("file","cover.png","image/png",pngBytes()));
        assertThat(Files.exists(root.resolve(stored.key()))).isTrue();
        assertThat(service.load(stored.key()).contentType()).isEqualTo("image/png");
        service.delete(stored.key());
        assertThat(Files.exists(root.resolve(stored.key()))).isFalse();
    }

    @Test void rejectsKeysEscapingTheStorageRoot(@TempDir Path root){
        assertThatThrownBy(()->service(root).load("../../etc/passwd")).isInstanceOf(InvalidOperationException.class);
    }

    private static byte[] pngBytes()throws Exception{
        var out=new ByteArrayOutputStream();
        ImageIO.write(new BufferedImage(4,4,BufferedImage.TYPE_INT_RGB),"png",out);
        return out.toByteArray();
    }
}
