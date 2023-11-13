package org.iaeste.szakal2.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

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
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;
    private LocalDateTime date;
    @ManyToOne
    @JoinColumn(name = "contact_person_id", nullable = false)
    @JsonIgnore
    private ContactPerson contactPerson;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;
    @ManyToOne
    @JoinColumn(name = "contact_journey_id", nullable = false)
    @JsonIgnore
    private ContactJourney contactJourney;
    @NotNull
    private String subject;
    @NotNull
    private String description;
    @Enumerated(EnumType.STRING)
    private ContactEventType eventType;

    @JsonProperty("contactPerson")
    public UUID contactPerson() {
        return contactPerson.getId();
    }
}
