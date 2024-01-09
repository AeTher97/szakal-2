package org.iaeste.szakal2.models.dto.campaign;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ContactJourneySearch {

    private UUID campaignId;
    private String companyName;
    private String status;
    private String user;
}
