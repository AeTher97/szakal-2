package org.iaeste.szakal2.models.dto.user;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.iaeste.szakal2.validation.PasswordsMatch;
import org.iaeste.szakal2.validation.ValidPassword;

@EqualsAndHashCode(callSuper = true)
@Data
@Builder
@PasswordsMatch
public class UserCreationDTO extends PasswordChangeDTO {

    @ValidPassword
    private String password;
    @ValidPassword
    private String repeatPassword;
    @NotNull
    private String name;
    @NotNull
    private String surname;
    @NotNull
    private String email;
}

