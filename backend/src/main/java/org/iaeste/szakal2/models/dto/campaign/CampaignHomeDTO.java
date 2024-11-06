package org.iaeste.szakal2.models.dto.campaign;

import lombok.Builder;
import lombok.Data;
import org.iaeste.szakal2.models.entities.Campaign;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class CampaignHomeDTO {

    private UUID id;
    private String name;
    private String description;
    private LocalDate startDate;
    private int journeyCount;

    public static CampaignHomeDTO fromCampaign(Campaign campaign, int journeyCount) {
        return builder()
                .id(campaign.getId())
                .journeyCount(journeyCount)
                .name(campaign.getName())
                .description(campaign.getDescription())
                .startDate(campaign.getStartDate())
                .build();
    }
}
