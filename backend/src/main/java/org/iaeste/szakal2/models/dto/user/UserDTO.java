package org.iaeste.szakal2.models.dto.user;

import lombok.Builder;
import lombok.Data;
import org.iaeste.szakal2.models.entities.Role;
import org.iaeste.szakal2.models.entities.User;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Set;
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
    private Set<Role> roles;
    private byte[] profilePicture;
    private Map<UUID, String> campaigns;

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
                .campaigns(user.availableCampaigns())
                .build();
    }

}
