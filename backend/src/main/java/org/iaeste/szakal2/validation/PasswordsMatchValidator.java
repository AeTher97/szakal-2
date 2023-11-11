package org.iaeste.szakal2.validation;


import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.iaeste.szakal2.models.dto.user.UserCreationDTO;

public class PasswordsMatchValidator implements ConstraintValidator<PasswordsMatch, UserCreationDTO> {
    @Override
    public void initialize(PasswordsMatch constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(UserCreationDTO userCreationDTO, ConstraintValidatorContext constraintValidatorContext) {
         return userCreationDTO.getPassword().equals(userCreationDTO.getRepeatPassword());
    }
}
