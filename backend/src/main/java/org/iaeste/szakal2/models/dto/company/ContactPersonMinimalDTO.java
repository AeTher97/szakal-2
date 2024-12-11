package org.iaeste.szakal2.models.dto.company;

import lombok.Builder;
import lombok.Data;
import org.iaeste.szakal2.models.entities.ContactPerson;

import java.util.UUID;

@Builder
@Data
public class ContactPersonMinimalDTO {

    private UUID id;
    private String name;

    public static ContactPersonMinimalDTO from(ContactPerson contactPerson) {
        return builder().id(contactPerson.getId()).name(contactPerson.getName()).build();
    }
}
