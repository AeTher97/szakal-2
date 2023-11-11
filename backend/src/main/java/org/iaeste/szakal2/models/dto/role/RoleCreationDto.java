package org.iaeste.szakal2.models.dto.role;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoleCreationDto {

    @NotNull
    private String name;
    @NotNull
    private String description;
    @NotEmpty
    private List<UUID> accessRights;

}
