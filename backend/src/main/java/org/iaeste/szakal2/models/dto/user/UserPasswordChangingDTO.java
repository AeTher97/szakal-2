package org.iaeste.szakal2.models.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.iaeste.szakal2.validation.PasswordsMatch;
import org.iaeste.szakal2.validation.ValidPassword;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@PasswordsMatch
public class UserPasswordChangingDTO extends PasswordChangeDTO {

    private String currentPassword;
    @ValidPassword
    private String password;
    @ValidPassword
    private String repeatPassword;
}
