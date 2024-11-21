package org.iaeste.szakal2.models.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_groups")
@Setter
public class UserGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToMany(fetch = FetchType.EAGER)
    private List<Campaign> campaignList = new ArrayList<>();

    @NotNull
    private String name;

    @ManyToMany(fetch = FetchType.EAGER)
    private List<User> userList = new ArrayList<>();

    private String entryCode;
}
