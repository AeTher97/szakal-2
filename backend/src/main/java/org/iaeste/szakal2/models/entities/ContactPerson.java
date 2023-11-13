package org.iaeste.szakal2.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.util.UUID;

@Entity
@Getter
@Table(name = "contact_persons")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ContactPerson {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;
    @Setter
    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    @JsonIgnore
    @NotNull
    private Company company;
    @Setter
    @NotNull
    private String name;
    @Setter
    @NotNull
    private String position;
    @Setter
    @NotNull
    private String email;
    @Setter
    @NotNull
    private String phone;
    @Setter
    private String phone2;
    @Setter
    @NotNull
    private String comment;

    public UUID company() {
        return company.getId();
    }

}
