package org.iaeste.szakal2.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;
import org.iaeste.szakal2.models.dto.user.UserCreationDTO;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;
    @JsonIgnore
    @Setter
    @NotNull
    private String password;
    @NotNull
    @Setter
    private String email;
    @Setter
    @NotNull
    private String name;
    @Setter
    @NotNull
    private String surname;
    @Setter
    @NotNull
    private LocalDateTime createdAt;
    @Setter
    @NotNull
    private boolean accepted;
    @Setter
    @NotNull
    private boolean active;
    @ManyToMany(fetch = FetchType.EAGER)
    private List<Role> roles;
    @Setter
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user")
    @JsonIgnore
    private List<ContactJourney> contactJourneys;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user")
    @JsonIgnore
    private List<Comment> comments;
    @ManyToMany(fetch = FetchType.EAGER)
    @JsonIgnore
    private List<UserGroup> userGroups;
    @Setter
    private byte[] profilePicture;

    public static User fromCreationDTO(UserCreationDTO userCreationDTO) {
        return User.builder()
                .email(userCreationDTO.getEmail())
                .password(userCreationDTO.getPassword())
                .createdAt(LocalDateTime.now())
                .name(userCreationDTO.getName())
                .surname(userCreationDTO.getSurname())
                .accepted(false)
                .active(true)
                .roles(new ArrayList<>())
                .userGroups(new ArrayList<>())
                .build();
    }

    public String getFullName() {
        return STR."\{name}  \{surname}";
    }

    public Map<UUID, String> availableCampaigns() {
        Map<UUID, String> availableCampaigns = new HashMap<>();
        getUserGroups().forEach(userGroup -> {
            userGroup.getCampaignList().forEach(campaign -> {
                availableCampaigns.put(campaign.getId(), campaign.getName());
            });
        });
        return availableCampaigns;
    }
}
