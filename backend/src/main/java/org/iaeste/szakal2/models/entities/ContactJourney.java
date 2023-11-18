package org.iaeste.szakal2.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Table(name = "contact_journeys")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ContactJourney {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;
    @Setter
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties(value = {"roles", "active", "accepted"})
    private User user;
    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    @JsonIgnoreProperties(value = {"updatedBy", "contactJourneys"})
    @Setter
    private Company company;
    @ManyToOne
    @JoinColumn(name = "campaign_id", nullable = false)
    private Campaign campaign;
    @Setter
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "contactJourney", orphanRemoval = true)
    private List<ContactEvent> contactEvents;
    @Setter
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "contactJourney", orphanRemoval = true)
    private List<Comment> comments;
    @Setter
    @NotNull
    @Enumerated(value = EnumType.STRING)
    private ContactStatus contactStatus;
    @Setter
    @NotNull
    private LocalDateTime journeyStart;
}
