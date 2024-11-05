package org.iaeste.szakal2.models.dto.favourite.journey;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FavouriteJourneyDTO {

    @NotNull
    private UUID journeyId;
}
