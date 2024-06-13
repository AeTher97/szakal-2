package org.iaeste.szakal2.models.dto.user;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Data
public class PictureUploadDTO {

    private UUID id;
    private MultipartFile file;
}
