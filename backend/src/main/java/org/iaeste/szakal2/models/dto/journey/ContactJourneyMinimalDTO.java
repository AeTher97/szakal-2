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
public class ContactJourneyMinimalDTO {

    private UUID id;
    private String campaignName;
    private String status;
}
