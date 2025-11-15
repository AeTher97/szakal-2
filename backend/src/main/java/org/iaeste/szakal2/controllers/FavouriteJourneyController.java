package org.iaeste.szakal2.controllers;

import jakarta.validation.Valid;
import org.iaeste.szakal2.models.dto.favourite.journey.FavouriteJourneyDTO;
import org.iaeste.szakal2.models.dto.favourite.journey.FavouriteJourneyListingDTO;
import org.iaeste.szakal2.services.FavouriteJourneyService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/favouriteJourneys")
public class FavouriteJourneyController {

    private final FavouriteJourneyService favouriteJourneyService;

    public FavouriteJourneyController(FavouriteJourneyService favouriteJourneyService) {
        this.favouriteJourneyService = favouriteJourneyService;
    }

    @GetMapping
    public List<FavouriteJourneyListingDTO> getFavouriteJourneys() {
        return favouriteJourneyService.getFavouriteJourneysListingForCurrentUser();
    }

    @PostMapping
    public FavouriteJourneyListingDTO addFavouriteJourney(@RequestBody @Valid FavouriteJourneyDTO favouriteJourneyDTO) {
        return favouriteJourneyService.addFavouriteJourney(favouriteJourneyDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteFavouriteJourney(@PathVariable UUID id) {
        favouriteJourneyService.deleteFavouriteJourney(id);
    }
}
