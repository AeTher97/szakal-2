package org.iaeste.szakal2.models.dto.journey;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ContactJourneyCreationDTO {

    private UUID user;
    private UUID company;
    private UUID campaign;
}
