package org.iaeste.szakal2.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

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
    @JsonIgnoreProperties(value = {"updatedBy"})
    private Company company;
    @ManyToOne
    @JoinColumn(name = "campaign_id", nullable = false)
    private Campaign campaign;
    @Setter
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "contactJourney", fetch = FetchType.EAGER)
    private List<ContactEvent> contactEvents;
    @Setter
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "contactJourney", fetch = FetchType.EAGER)
    private List<Comment> comments;
    @Setter
    private ContactStatus contactStatus;
}
