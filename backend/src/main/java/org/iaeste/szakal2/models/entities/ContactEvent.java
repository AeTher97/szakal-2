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
@Table(name = "contact_events")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ContactEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private LocalDateTime date;
    @Setter
    @ManyToOne
    @JoinColumn(name = "contact_person_id")
    @JsonIgnoreProperties(value = {"company"})
    private ContactPerson contactPerson;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties(value = {"createdAt", "accepted", "roles", "contactJourneys", "comments"})
    private User user;
    @ManyToOne
    @JoinColumn(name = "contact_journey_id", nullable = false)
    @JsonIgnore
    private ContactJourney contactJourney;
    @Setter
    @NotNull
    @Column(length = 2000)
    private String description;
    @Setter
    @Enumerated(EnumType.STRING)
    private ContactStatus eventType;
}
