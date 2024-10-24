package org.iaeste.szakal2.models.dto.journey;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.iaeste.szakal2.models.entities.ContactStatus;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ContactEventCreationDTO {

    private UUID contactPerson;
    @NotNull
    private UUID user;
    @NotNull
    private UUID contactJourney;
    @NotNull
    private String description;
    @NotNull
    private ContactStatus contactStatus;

}
