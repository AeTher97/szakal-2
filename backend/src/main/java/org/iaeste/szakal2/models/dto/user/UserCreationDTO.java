package org.iaeste.szakal2.models.dto.user;

import jakarta.annotation.Nonnull;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import org.iaeste.szakal2.validation.PasswordsMatch;
import org.iaeste.szakal2.validation.ValidPassword;
import org.springframework.lang.NonNull;

@Data
@Builder
@PasswordsMatch
public class UserCreationDTO {

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

