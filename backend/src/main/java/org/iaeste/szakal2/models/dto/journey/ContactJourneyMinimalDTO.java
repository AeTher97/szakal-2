package org.iaeste.szakal2.models.dto.journey;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ContactJourneyMinimalDTO {

    private String campaignName;
    private String status;
}
