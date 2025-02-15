package org.iaeste.szakal2.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Entity
@Getter
@Table(name = "companies")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@NamedEntityGraph(name = "Company.listing",
        attributeNodes = {
                @NamedAttributeNode("address"),
                @NamedAttributeNode("categories"),
                @NamedAttributeNode(value = "contactJourneys", subgraph = "journey-subgraph"),
        },
        subgraphs = {
                @NamedSubgraph(
                        name = "journey-subgraph",
                        attributeNodes = {
                                @NamedAttributeNode("campaign")
                        })
        })
@NamedEntityGraph(name = "Company.address",
        attributeNodes = {
                @NamedAttributeNode("address"),
        })
@NamedEntityGraph(name = "Company.detail",
        attributeNodes = {
                @NamedAttributeNode("address"),
                @NamedAttributeNode("categories"),
                @NamedAttributeNode("updatedBy"),
                @NamedAttributeNode(value = "contactJourneys", subgraph = "journey-subgraph"),
        },
        subgraphs = {
                @NamedSubgraph(
                        name = "journey-subgraph",
                        attributeNodes = {
                                @NamedAttributeNode("campaign")
                        })
        })
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Setter
    @NotNull
    @NotEmpty
    private String name;
    @Setter
    @JoinColumn(name = "address_id", referencedColumnName = "id")
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Address address;
    @Setter
    private String phone;
    @Setter
    private String fax;
    @Setter
    private String www;
    @Setter
    private String email;
    @Setter
    @NotNull
    private LocalDateTime insertDate;
    @Setter
    @NotNull
    private LocalDateTime updateDate;
    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @NotNull
    @JsonIgnoreProperties(value = {"roles"})
    private User updatedBy;
    @Setter
    @NotNull
    private boolean deleted;
    @Setter
    private LocalDateTime deletedDate;
    @Setter
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "categories_companies",
            joinColumns = @JoinColumn(name = "company_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<CompanyCategory> categories;
    @Setter
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "company", orphanRemoval = true)
    private Set<ContactPerson> contactPeople;
    @Setter
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "company")
    @JsonIgnoreProperties(value = {"company"})
    private Set<ContactJourney> contactJourneys;

}
