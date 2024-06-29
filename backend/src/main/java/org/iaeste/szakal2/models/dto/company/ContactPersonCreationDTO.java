package org.iaeste.szakal2.models.dto.company;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private boolean isAlumni;
    private String committee;
}
