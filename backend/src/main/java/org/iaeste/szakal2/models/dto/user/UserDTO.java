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
    private String email;
    private boolean accepted;
    private boolean active;
    private String name;
    private String surname;
    private LocalDateTime createdAt;
    private List<Role> roles;
    private byte[] profilePicture;

    public static UserDTO fromUser(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .accepted(user.isAccepted())
                .active(user.isActive())
                .name(user.getName())
                .surname(user.getSurname())
                .createdAt(user.getCreatedAt())
                .roles(user.getRoles())
                .profilePicture(user.getProfilePicture())
                .build();
    }

}
