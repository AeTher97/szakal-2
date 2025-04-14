package org.iaeste.szakal2.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Table(name = "comments")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Setter
    @NotNull
    @Column(length = 1000, name = "comment")
    private String commentValue;
    @NotNull
    private LocalDateTime date;
    @NotNull
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties(value = {"roles"})
    private User user;
    @ManyToOne
    @JoinColumn(name = "contact_journey_id", nullable = false)
    @JsonIgnore
    private ContactJourney contactJourney;
}
