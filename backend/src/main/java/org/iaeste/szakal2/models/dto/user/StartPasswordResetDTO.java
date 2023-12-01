package org.iaeste.szakal2.models.dto.user;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StartPasswordResetDTO {

    @NotEmpty
    private String email;
}
