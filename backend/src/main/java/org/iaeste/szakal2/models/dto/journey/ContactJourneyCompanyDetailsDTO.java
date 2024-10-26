package org.iaeste.szakal2.models.dto.journey;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Builder;
import lombok.Data;
import org.iaeste.szakal2.models.dto.user.UserDTO;
import org.iaeste.szakal2.models.entities.ContactJourney;
import org.iaeste.szakal2.models.entities.ContactStatus;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@Builder
public class ContactJourneyCompanyDetailsDTO {

    private UUID id;
    private ContactJourneyDetailsDTO.CampaignDTO campaign;
    @JsonIgnoreProperties(value = {"accessRights", "campaigns", "roles"})
    private UserDTO user;
    private Set<ContactEventDetailsDTO> contactEvents;
    private Set<CommentDetailsDTO> comments;
    private LocalDateTime journeyStart;
    private ContactStatus contactStatus;
    private boolean finished;

    public static ContactJourneyCompanyDetailsDTO fromContactJourney(ContactJourney contactJourney) {
        return ContactJourneyCompanyDetailsDTO.builder()
                .id(contactJourney.getId())
                .contactStatus(contactJourney.getContactStatus())
                .journeyStart(contactJourney.getJourneyStart())
                .campaign(ContactJourneyDetailsDTO.CampaignDTO.fromCampaign(contactJourney.getCampaign()))
                .contactEvents(contactJourney.getContactEvents().stream().map(ContactEventDetailsDTO::fromContactEvent)
                        .collect(Collectors.toSet()))
                .user(contactJourney.getUser() != null ? UserDTO.fromUser(contactJourney.getUser()) : null)
                .finished(contactJourney.isFinished())
                .comments(contactJourney.getComments().stream().map(CommentDetailsDTO::fromComment).collect(Collectors.toSet()))
                .build();
    }

}
