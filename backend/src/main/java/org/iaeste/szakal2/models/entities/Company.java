package org.iaeste.szakal2.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Table(name = "companies")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Company {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;
    @Setter
    @NotNull
    private String name;
    @Setter
    @OneToOne(cascade = CascadeType.ALL)
    private Address address;
    @Setter
    @NotNull
    private String phone;
    @Setter
    private String fax;
    @Setter
    @NotNull
    private String www;
    @Setter
    @NotNull
    private String email;
    @Setter
    @NotNull
    private LocalDateTime insertDate;
    @Setter
    @NotNull
    private LocalDateTime updateDate;
    @Setter
    @ManyToOne
    @NotNull
    @JsonIgnoreProperties(value = {"roles"})
    private User updatedBy;
    @Setter
    @NotNull
    private boolean deleted;
    @Setter
    private LocalDateTime deletedDate;
    @Setter
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "categories_companies",
            joinColumns = @JoinColumn(name = "company_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private List<CompanyCategory> categories;
    @Setter
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "company")
    private List<ContactPerson> contactPeople;
    @Setter
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "company")
    private List<ContactJourney> contactJourneys;

    @JsonProperty("contactJourneys")
    public List<UUID> contactJourneys() {
        if (contactJourneys == null) {
            return List.of();
        }
        return contactJourneys.stream().map(ContactJourney::getId).toList();
    }


}
