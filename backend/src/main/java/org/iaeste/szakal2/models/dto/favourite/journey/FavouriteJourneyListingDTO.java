package org.iaeste.szakal2.models.dto.favourite.journey;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.iaeste.szakal2.models.dto.journey.ContactJourneyFavouritesDTO;
import org.iaeste.szakal2.models.entities.FavouriteJourney;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FavouriteJourneyListingDTO {

    private UUID id;
    private ContactJourneyFavouritesDTO contactJourney;

    public static FavouriteJourneyListingDTO fromFavouriteJourney(FavouriteJourney favouriteJourney) {
        return builder()
                .id(favouriteJourney.getId())
                .contactJourney(ContactJourneyFavouritesDTO.fromContactJourney(favouriteJourney.getContactJourney()))
                .build();
    }
}
