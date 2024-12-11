package org.iaeste.szakal2.models.dto.journey;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Builder;
import lombok.Data;
import org.iaeste.szakal2.models.dto.company.ContactPersonMinimalDTO;
import org.iaeste.szakal2.models.entities.ContactEvent;
import org.iaeste.szakal2.models.entities.ContactStatus;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ContactEventDetailsDTO {

    private UUID id;
    private ContactPersonMinimalDTO contactPerson;
    @JsonIgnoreProperties(value = {"campaigns", "roles"})
    private ContactJourneyUserDTO user;
    private String description;
    private ContactStatus eventType;
    private LocalDateTime date;

    public static ContactEventDetailsDTO fromContactEvent(ContactEvent contactEvent) {
        return ContactEventDetailsDTO.builder()
                .id(contactEvent.getId())
                .contactPerson(contactEvent.getContactPerson() == null ? null :
                        ContactPersonMinimalDTO.from(contactEvent.getContactPerson()))
                .user(ContactJourneyUserDTO.fromUser(contactEvent.getUser()))
                .description(contactEvent.getDescription())
                .eventType(contactEvent.getEventType())
                .date(contactEvent.getDate())
                .build();
    }
}
