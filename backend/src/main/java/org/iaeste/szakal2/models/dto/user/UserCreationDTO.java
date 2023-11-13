package org.iaeste.szakal2.models.dto.user;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import org.iaeste.szakal2.validation.PasswordsMatch;
import org.iaeste.szakal2.validation.ValidPassword;

@Data
@Builder
@PasswordsMatch
public class UserCreationDTO extends PasswordChangeDTO {

    @ValidPassword
    private String password;
    @ValidPassword
    private String repeatPassword;
    @NotNull
    private String username;
    @NotNull
    private String name;
    @NotNull
    private String surname;
    @NotNull
    private String email;
}

