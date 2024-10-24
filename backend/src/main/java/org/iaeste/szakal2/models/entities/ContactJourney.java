package org.iaeste.szakal2.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Entity
@Getter
@Table(name = "contact_journeys")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@NamedEntityGraph(name = "Journey.listing", attributeNodes = {
        @NamedAttributeNode(value = "campaign"),
        @NamedAttributeNode(value = "user"),
        @NamedAttributeNode(value = "company")}
)
@NamedEntityGraph(name = "Journey.detail", attributeNodes = {
        @NamedAttributeNode(value = "campaign"),
        @NamedAttributeNode(value = "user", subgraph = "user-subgraph"),
        @NamedAttributeNode(value = "company", subgraph = "company-subgraph")},
        subgraphs = {
                @NamedSubgraph(name = "company-subgraph", attributeNodes = {
                        @NamedAttributeNode("address"),
                        @NamedAttributeNode("categories")
                }),
                @NamedSubgraph(name = "user-subgraph", attributeNodes = {
                })
        }
)
public class ContactJourney {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true)
    @JsonIgnoreProperties(value = {"roles", "active", "accepted"})
    private User user;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    @JsonIgnoreProperties(value = {"updatedBy", "contactJourneys"})
    @Setter
    private Company company;
    @Column(name = "campaign_id", nullable = false, insertable = false, updatable = false)
    private UUID campaignId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id")
    private Campaign campaign;
    @Setter
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "contactJourney", orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<ContactEvent> contactEvents;
    @Setter
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "contactJourney", orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<Comment> comments;
    @Setter
    @NotNull
    @Enumerated(value = EnumType.STRING)
    private ContactStatus contactStatus;
    @Setter
    @NotNull
    private LocalDateTime journeyStart;
    @Setter
    @NotNull
    private boolean finished;
}
