package org.iaeste.szakal2.models.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@NamedEntityGraph(name = "FavouriteJourney.full",
        attributeNodes = {@NamedAttributeNode("contactJourney")})
public class FavouriteJourney {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private UUID userId;

    @ManyToOne(fetch = FetchType.LAZY)
    private ContactJourney contactJourney;
}
