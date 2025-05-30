package org.iaeste.szakal2.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Entity
@Getter
@Table(name = "contact_persons")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ContactPerson {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
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
    private String position;
    @Setter
    private String email;
    @Setter
    private String phone;
    @Setter
    @Column(length = 4000)
    private String comment;
    @Setter
    private boolean isAlumni;
    @Setter
    private String committee;

}
