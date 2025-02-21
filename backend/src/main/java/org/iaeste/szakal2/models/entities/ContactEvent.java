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
    @ManyToOne
    @JoinColumn(name = "contact_person_id")
    @JsonIgnoreProperties(value = {"company"})
    @Setter
    private ContactPerson contactPerson;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties(value = {"createdAt", "accepted", "roles", "contactJourneys", "comments"})
    private User user;
    @ManyToOne
    @JoinColumn(name = "contact_journey_id", nullable = false)
    @JsonIgnore
    private ContactJourney contactJourney;
    @NotNull
    @Column(length = 2000)
    private String description;
    @Enumerated(EnumType.STRING)
    private ContactStatus eventType;

    public void setDescription(String description) {
        this.description = description;
    }

    public void setEventType(ContactStatus eventType) {
        this.eventType = eventType;
    }

    public void setContactPerson(ContactPerson contactPerson) {
        this.contactPerson = contactPerson;
    }

}
