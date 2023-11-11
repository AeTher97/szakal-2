package org.iaeste.szakal2.models.dto.role;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class RoleUpdateDTO {

    private UUID id;
    private String name;
    private String description;
    private List<UUID> accessRights;
}
