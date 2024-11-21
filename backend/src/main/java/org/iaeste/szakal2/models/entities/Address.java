package org.iaeste.szakal2.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.util.UUID;

@Entity
@Getter
@Table(name = "addresses")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Setter
    private String city;
    @Setter
    private String street;
    @Setter
    private String postalCode;
    @Setter
    private String streetNumber;
//    @OneToOne(mappedBy = "address")
//    @JsonIgnore
//    private Company company;
}
