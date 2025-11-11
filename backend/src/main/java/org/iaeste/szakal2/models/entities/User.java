package org.iaeste.szakal2.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.lang.Strings;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.iaeste.szakal2.models.dto.user.PushNotificationSubscriptionDTO;
import org.iaeste.szakal2.models.dto.user.UserCreationDTO;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
@NamedEntityGraph(name = "User.roles",
        attributeNodes = {
                @NamedAttributeNode(value = "roles", subgraph = "roles-subgraph")
        },
        subgraphs = {
                @NamedSubgraph(
                        name = "roles-subgraph",
                        attributeNodes = {
                                @NamedAttributeNode("accessRights")
                        })
        }
)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
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
    private String committee;
    @Setter
    @NotNull
    private LocalDateTime createdAt;
    @Setter
    @NotNull
    private boolean accepted;
    @Setter
    @NotNull
    private boolean active;
    @ManyToMany(fetch = FetchType.LAZY)
    @Singular
    private Set<Role> roles;
    @Setter
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnore
    @Singular
    private Set<ContactJourney> contactJourneys;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnore
    @Singular
    private Set<Comment> comments;
    @ManyToMany(fetch = FetchType.LAZY)
    @JsonIgnore
    @Singular
    private Set<UserGroup> userGroups;
    @JsonIgnore
    @Column(length = 15000)
    private String pushNotificationTokens;

    public static User fromCreationDTO(UserCreationDTO userCreationDTO) {
        return User.builder()
                .email(userCreationDTO.getEmail())
                .password(userCreationDTO.getPassword())
                .createdAt(LocalDateTime.now())
                .name(userCreationDTO.getName())
                .surname(userCreationDTO.getSurname())
                .accepted(false)
                .active(false)
                .roles(new HashSet<>())
                .userGroups(new HashSet<>())
                .build();
    }

    public String getFullName() {
        return STR."\{name} \{surname}";
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

    public List<PushNotificationSubscriptionDTO> getPushNotificationTokens() {
        return processMergedTokenString(pushNotificationTokens != null ? pushNotificationTokens : Strings.EMPTY);
    }

    public void setPushNotificationTokens(List<PushNotificationSubscriptionDTO> pushNotificationTokens) {
        this.pushNotificationTokens = getMergedTokenString(pushNotificationTokens);
    }

    public void removeToken(String auth) {
        List<PushNotificationSubscriptionDTO> tokens = getPushNotificationTokens();
        tokens = tokens.stream().filter(token -> !token.getAuth().equals(auth)).toList();
        setPushNotificationTokens(tokens);
    }

    private static List<PushNotificationSubscriptionDTO> processMergedTokenString(String mergedTokenString) {
        if (mergedTokenString.isBlank()) {
            return new ArrayList<>();
        }
        return new ArrayList<>(Arrays.stream(mergedTokenString.split("},"))
                .map(string -> {
                    try {
                        return new ObjectMapper().readValue(string + "}", PushNotificationSubscriptionDTO.class);
                    } catch (JsonProcessingException e) {
                        throw new RuntimeException(e);
                    }
                })
                .toList());
    }

    private static String getMergedTokenString(List<PushNotificationSubscriptionDTO> tokens) {
        return tokens.stream().map(token -> {
            try {
                return new ObjectMapper().writeValueAsString(token);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        }).collect(Collectors.joining(","));
    }

}
