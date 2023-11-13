package org.iaeste.szakal2.models.dto.journey;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.iaeste.szakal2.models.entities.ContactStatus;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ContactJourneyStatusUpdatingDTO {

    @NotNull
    private ContactStatus contactStatus;
}
