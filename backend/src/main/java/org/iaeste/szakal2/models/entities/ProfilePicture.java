package org.iaeste.szakal2.models.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "profile_pictures")
@Entity
public class ProfilePicture {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Setter
    private byte[] data;

    @OneToOne
    private User user;

    public ProfilePicture(User user) {
        this.user = user;
    }
}
