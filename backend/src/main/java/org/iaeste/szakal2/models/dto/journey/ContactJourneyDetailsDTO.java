package org.iaeste.szakal2.models.dto.journey;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Builder;
import lombok.Data;
import org.iaeste.szakal2.models.entities.Campaign;
import org.iaeste.szakal2.models.entities.ContactJourney;
import org.iaeste.szakal2.models.entities.ContactStatus;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@Builder
public class ContactJourneyDetailsDTO {

    private UUID id;
    private ContactJourneyCompanyDTO company;
    private CampaignDTO campaign;
    @JsonIgnoreProperties(value = {"accessRights", "campaigns", "roles"})
    private ContactJourneyUserDTO user;
    private Set<ContactEventDetailsDTO> contactEvents;
    private Set<CommentDetailsDTO> comments;
    private LocalDateTime journeyStart;
    private ContactStatus contactStatus;
    private boolean finished;

    public static ContactJourneyDetailsDTO fromContactJourney(ContactJourney contactJourney) {
        return ContactJourneyDetailsDTO.builder()
                .id(contactJourney.getId())
                .contactStatus(contactJourney.getContactStatus())
                .journeyStart(contactJourney.getJourneyStart())
                .company(ContactJourneyCompanyDTO.fromCompany(contactJourney.getCompany()))
                .campaign(CampaignDTO.fromCampaign(contactJourney.getCampaign()))
                .contactEvents(contactJourney.getContactEvents().stream().map(ContactEventDetailsDTO::fromContactEvent)
                        .collect(Collectors.toSet()))
                .user(contactJourney.getUser() != null ? ContactJourneyUserDTO.fromUser(contactJourney.getUser()) : null)
                .finished(contactJourney.isFinished())
                .comments(contactJourney.getComments().stream().map(CommentDetailsDTO::fromComment).collect(Collectors.toSet()))
                .build();
    }

    @Data
    @Builder
    static class CampaignDTO {
        private String name;
        private UUID id;

        static CampaignDTO fromCampaign(Campaign campaign) {
            return CampaignDTO
                    .builder()
                    .name(campaign.getName())
                    .id(campaign.getId())
                    .build();
        }
    }
}
