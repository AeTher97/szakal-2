package org.iaeste.szakal2.models.dto.user;

import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import org.iaeste.szakal2.validation.PasswordsMatch;
import org.iaeste.szakal2.validation.ValidPassword;

@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@PasswordsMatch
public class PasswordResetDTO extends PasswordChangeDTO {

    @NotEmpty
    private String code;
    @ValidPassword
    private String password;
    @ValidPassword
    private String repeatPassword;
}
