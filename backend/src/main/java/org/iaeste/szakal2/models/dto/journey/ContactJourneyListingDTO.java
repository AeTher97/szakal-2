package org.iaeste.szakal2.models.dto.journey;

import lombok.Builder;
import lombok.Data;
import org.iaeste.szakal2.models.dto.company.CompanyMinimalDTO;
import org.iaeste.szakal2.models.dto.user.UserMinimalDTO;
import org.iaeste.szakal2.models.entities.ContactJourney;
import org.iaeste.szakal2.models.entities.ContactStatus;

import java.util.UUID;

@Data
@Builder
public class ContactJourneyListingDTO {

    private UUID id;
    private boolean finished;
    private CompanyMinimalDTO company;
    private UserMinimalDTO user;
    private ContactStatus contactStatus;

    public static ContactJourneyListingDTO fromContactJourney(ContactJourney contactJourney) {
        return ContactJourneyListingDTO.builder()
                .id(contactJourney.getId())
                .finished(contactJourney.isFinished())
                .company(CompanyMinimalDTO.fromCompany(contactJourney.getCompany()))
                .user(contactJourney.getUser() != null ? UserMinimalDTO.fromUser(contactJourney.getUser()) : null)
                .contactStatus(contactJourney.getContactStatus())
                .build();
    }
}
