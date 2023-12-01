package org.iaeste.szakal2.models.dto.user;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.iaeste.szakal2.validation.PasswordsMatch;
import org.iaeste.szakal2.validation.ValidPassword;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@PasswordsMatch
public class PasswordResetDTO extends PasswordChangeDTO{

    @NotEmpty
    private String code;
    @ValidPassword
    private String password;
    @ValidPassword
    private String repeatPassword;
}
