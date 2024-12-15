package org.iaeste.szakal2.models.dto.company;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Builder;
import lombok.Data;
import org.iaeste.szakal2.models.dto.journey.CommentDetailsDTO;
import org.iaeste.szakal2.models.dto.journey.ContactEventDetailsDTO;
import org.iaeste.szakal2.models.dto.user.UserDTO;
import org.iaeste.szakal2.models.entities.Campaign;
import org.iaeste.szakal2.models.entities.ContactJourney;
import org.iaeste.szakal2.models.entities.ContactStatus;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@Builder
public class CompanyContactJourneyDetailsDTO {

    private UUID id;
    private CampaignDTO campaign;
    @JsonIgnoreProperties(value = {"accessRights", "campaigns", "roles"})
    private UserDTO user;
    private Set<ContactEventDetailsDTO> contactEvents;
    private Set<CommentDetailsDTO> comments;
    private LocalDateTime journeyStart;
    private ContactStatus contactStatus;
    private boolean finished;

    public static CompanyContactJourneyDetailsDTO fromContactJourney(ContactJourney contactJourney) {
        return CompanyContactJourneyDetailsDTO.builder()
                .id(contactJourney.getId())
                .contactStatus(contactJourney.getContactStatus())
                .journeyStart(contactJourney.getJourneyStart())
                .campaign(CampaignDTO.fromCampaign(contactJourney.getCampaign()))
                .contactEvents(contactJourney.getContactEvents().stream().map(ContactEventDetailsDTO::fromContactEvent)
                        .collect(Collectors.toSet()))
                .user(contactJourney.getUser() != null ? UserDTO.fromUser(contactJourney.getUser()) : null)
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
