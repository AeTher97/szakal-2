package org.iaeste.szakal2.validation;


import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.iaeste.szakal2.models.dto.user.PasswordChangeDTO;

public class PasswordsMatchValidator implements ConstraintValidator<PasswordsMatch, PasswordChangeDTO> {
    @Override
    public void initialize(PasswordsMatch constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(PasswordChangeDTO passwordChangeDTO, ConstraintValidatorContext constraintValidatorContext) {
        return passwordChangeDTO.getPassword().equals(passwordChangeDTO.getRepeatPassword());
    }
}
