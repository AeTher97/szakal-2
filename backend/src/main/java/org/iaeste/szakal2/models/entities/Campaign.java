package org.iaeste.szakal2.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Table(name = "campaigns")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Campaign {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Setter
    @NotNull
    private String name;
    @Setter
    @NotNull
    private LocalDate startDate;
    @Setter
    private String description;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "campaign", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<ContactJourney> contactJourneys;

}
