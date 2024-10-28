package org.iaeste.szakal2.models.dto.journey;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.iaeste.szakal2.models.dto.user.UserDTO;
import org.iaeste.szakal2.models.entities.ContactJourney;
import org.iaeste.szakal2.models.entities.ContactStatus;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ContactJourneyMinimalDTO {

    private UUID id;
    private String campaignName;
    private ContactStatus status;
    private LocalDateTime journeyStart;
    private UserDTO user;

    public static ContactJourneyMinimalDTO fromContactJourney(ContactJourney contactJourney) {
        return ContactJourneyMinimalDTO.builder()
                .id(contactJourney.getId())
                .campaignName(contactJourney.getCampaign().getName())
                .status(contactJourney.getContactStatus())
                .journeyStart(contactJourney.getJourneyStart())
                .user(contactJourney.getUser() != null ? UserDTO.fromUser(contactJourney.getUser()) : null)
                .build();
    }
}
