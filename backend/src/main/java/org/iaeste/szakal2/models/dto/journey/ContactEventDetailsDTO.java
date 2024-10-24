package org.iaeste.szakal2.models.dto.journey;

import lombok.Builder;
import lombok.Data;
import org.iaeste.szakal2.models.dto.user.UserDTO;
import org.iaeste.szakal2.models.entities.ContactEvent;
import org.iaeste.szakal2.models.entities.ContactPerson;
import org.iaeste.szakal2.models.entities.ContactStatus;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ContactEventDetailsDTO {

    private UUID id;
    private ContactPerson contactPerson;
    private UserDTO user;
    private String description;
    private ContactStatus eventType;
    private LocalDateTime date;

    public static ContactEventDetailsDTO fromContactEvent(ContactEvent contactEvent) {
        return ContactEventDetailsDTO.builder()
                .id(contactEvent.getId())
                .contactPerson(contactEvent.getContactPerson())
                .user(UserDTO.fromUser(contactEvent.getUser()))
                .description(contactEvent.getDescription())
                .eventType(contactEvent.getEventType())
                .date(contactEvent.getDate())
                .build();
    }
}
