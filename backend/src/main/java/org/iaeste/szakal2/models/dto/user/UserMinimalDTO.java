package org.iaeste.szakal2.models.dto.user;

import lombok.Builder;
import lombok.Data;
import org.iaeste.szakal2.models.entities.User;

import java.util.UUID;

@Data
@Builder
public class UserMinimalDTO {

    private UUID id;
    private String name;
    private String surname;
    private String committee;
    private String email;

    public static UserMinimalDTO fromUser(User user) {
        return UserMinimalDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .surname(user.getSurname())
                .committee(user.getCommittee())
                .email(user.getEmail())
                .build();
    }
}
