package org.iaeste.szakal2.models.dto.company;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.iaeste.szakal2.models.entities.Company;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ContactPersonCreationDTO {

    @NotNull
    private String name;
    @NotNull
    private String position;
    @NotNull
    private String email;
    @NotNull
    private String phone;
    private String phone2;
    @NotNull
    private String comment;
}
