package org.iaeste.szakal2.models.dto.user;

import lombok.*;
import org.iaeste.szakal2.validation.PasswordsMatch;
import org.iaeste.szakal2.validation.ValidPassword;

@EqualsAndHashCode(callSuper = true)
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
