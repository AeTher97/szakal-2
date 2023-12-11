package org.iaeste.szakal2.models.dto.journey;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommentCreationDTO {

    @NotNull
    private String comment;
    @NotNull
    private UUID user;
}
