package org.iaeste.szakal2.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
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
public class User{

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Setter
    private String username;

    @JsonIgnore
    @Setter
    private String password;

    @JsonIgnore
    private String email;

    @Setter
    private String name;

    @Setter
    private String surname;

    @Setter
    private LocalDateTime createdAt;

    @Setter
    private boolean accepted;

    @Setter
    private boolean active;

    @OneToMany(fetch = FetchType.EAGER)
    private List<Role> roles;

    public static User fromCreationDTO(UserCreationDTO userCreationDTO){
        return User.builder()
                .email(userCreationDTO.getEmail())
                .username(userCreationDTO.getUsername())
                .password(userCreationDTO.getPassword())
                .createdAt(LocalDateTime.now())
                .name(userCreationDTO.getName())
                .surname(userCreationDTO.getSurname())
                .accepted(false)
                .active(false)
                .build();
    }

}
