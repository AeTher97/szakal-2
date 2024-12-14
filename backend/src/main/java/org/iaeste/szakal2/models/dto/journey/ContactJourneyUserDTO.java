package org.iaeste.szakal2.models.dto.journey;

import lombok.Builder;
import lombok.Data;
import org.iaeste.szakal2.models.entities.User;

import java.util.UUID;

@Data
@Builder
public class ContactJourneyUserDTO {

    private UUID id;
    private String email;
    private String name;
    private String surname;

    public static ContactJourneyUserDTO fromUser(User user) {
        return ContactJourneyUserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .surname(user.getSurname())
                .build();
    }

}
