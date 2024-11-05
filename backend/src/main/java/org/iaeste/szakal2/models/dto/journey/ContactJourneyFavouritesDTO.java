package org.iaeste.szakal2.models.dto.journey;

import lombok.Builder;
import lombok.Data;
import org.iaeste.szakal2.models.dto.company.CompanyMinimalDTO;
import org.iaeste.szakal2.models.dto.user.UserMinimalDTO;
import org.iaeste.szakal2.models.entities.ContactJourney;
import org.iaeste.szakal2.models.entities.ContactStatus;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ContactJourneyFavouritesDTO {

    private UUID id;
    private boolean finished;
    private CompanyMinimalDTO company;
    private ContactJourneyDetailsDTO.CampaignDTO campaign;
    private UserMinimalDTO user;
    private ContactStatus contactStatus;
    private LocalDateTime journeyStart;
    private LocalDateTime lastInteraction;

    public static ContactJourneyFavouritesDTO fromContactJourney(ContactJourney contactJourney) {
        return ContactJourneyFavouritesDTO.builder()
                .id(contactJourney.getId())
                .finished(contactJourney.isFinished())
                .company(CompanyMinimalDTO.fromCompany(contactJourney.getCompany()))
                .user(contactJourney.getUser() != null ? UserMinimalDTO.fromUser(contactJourney.getUser()) : null)
                .contactStatus(contactJourney.getContactStatus())
                .journeyStart(contactJourney.getJourneyStart())
                .lastInteraction(contactJourney.getLastInteraction())
                .campaign(ContactJourneyDetailsDTO.CampaignDTO.fromCampaign(contactJourney.getCampaign()))
                .build();
    }
}
