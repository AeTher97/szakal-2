package org.iaeste.szakal2.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;
import org.iaeste.szakal2.models.dto.user.UserCreationDTO;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

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
    @Setter
    @NotNull
    private String username;
    @JsonIgnore
    @Setter
    @NotNull
    private String password;
    @JsonIgnore
    @NotNull
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

    public static User fromCreationDTO(UserCreationDTO userCreationDTO) {
        return User.builder()
                .email(userCreationDTO.getEmail())
                .username(userCreationDTO.getUsername())
                .password(userCreationDTO.getPassword())
                .createdAt(LocalDateTime.now())
                .name(userCreationDTO.getName())
                .surname(userCreationDTO.getSurname())
                .accepted(false)
                .active(false)
                .roles(new ArrayList<>())
                .build();
    }


}
