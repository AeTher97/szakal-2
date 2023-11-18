package org.iaeste.szakal2.models.dto.user;

import lombok.Builder;
import lombok.Data;
import org.iaeste.szakal2.models.entities.Role;
import org.iaeste.szakal2.models.entities.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class UserDTO {

    private UUID id;
    private String username;
    private String email;
    private boolean accepted;
    private String name;
    private String surname;
    private LocalDateTime createdAt;
    private List<Role> roles;

    public static UserDTO fromUser(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .accepted(user.isAccepted())
                .name(user.getName())
                .surname(user.getSurname())
                .createdAt(user.getCreatedAt())
                .roles(user.getRoles())
                .build();
    }

}
