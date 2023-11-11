package org.iaeste.szakal2.models.dto.user;

import lombok.Builder;
import lombok.Data;
import org.iaeste.szakal2.models.entities.User;

import java.util.UUID;

@Data
@Builder
public class UserDTO {

    private UUID id;
    private String username;
    private String email;

    public static UserDTO fromUser(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .build();
    }

}
