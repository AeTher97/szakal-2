package org.iaeste.szakal2.models.dto.user;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class JoinGroupDTO {

    @NotNull
    private String entryCode;
    
}
