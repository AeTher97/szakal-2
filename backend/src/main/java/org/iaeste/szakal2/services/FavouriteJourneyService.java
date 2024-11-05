package org.iaeste.szakal2.services;

import org.iaeste.szakal2.exceptions.ResourceExistsException;
import org.iaeste.szakal2.models.dto.favourite.journey.FavouriteJourneyDTO;
import org.iaeste.szakal2.models.dto.favourite.journey.FavouriteJourneyListingDTO;
import org.iaeste.szakal2.models.entities.ContactJourney;
import org.iaeste.szakal2.models.entities.FavouriteJourney;
import org.iaeste.szakal2.repositories.FavouriteJourneyRepository;
import org.iaeste.szakal2.security.utils.SecurityUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class FavouriteJourneyService {

    private final FavouriteJourneyRepository favouriteJourneyRepository;
    private final JourneyService journeyService;

    public FavouriteJourneyService(FavouriteJourneyRepository favouriteJourneyRepository, JourneyService journeyService) {
        this.favouriteJourneyRepository = favouriteJourneyRepository;
        this.journeyService = journeyService;
    }

    public List<FavouriteJourneyListingDTO> getFavouriteJourneysListing() {
        return favouriteJourneyRepository.findFavouriteJourneyByUserId(SecurityUtils.getUserId())
                .stream().map(FavouriteJourneyListingDTO::fromFavouriteJourney).toList();
    }


    private List<FavouriteJourney> getFavouriteJourneys() {
        return favouriteJourneyRepository.findFavouriteJourneyByUserId(SecurityUtils.getUserId());
    }

    public FavouriteJourneyListingDTO addFavouriteJourney(FavouriteJourneyDTO favouriteJourneyDTO) {
        ContactJourney contactJourney = journeyService.getJourneyById(favouriteJourneyDTO.getJourneyId());
        List<FavouriteJourney> favouriteJourneys = getFavouriteJourneys();
        if (favouriteJourneys.stream().anyMatch(favouriteJourney -> favouriteJourney.getContactJourney().getId().equals(contactJourney.getId()))) {
            throw new ResourceExistsException("Journey already added to favourites");
        }
        return FavouriteJourneyListingDTO.fromFavouriteJourney(favouriteJourneyRepository.save(FavouriteJourney.builder()
                .userId(SecurityUtils.getUserId())
                .contactJourney(contactJourney)
                .build()));
    }

    public void deleteFavouriteJourney(UUID id) {
        Optional<FavouriteJourney> favouriteJourneyOptional = favouriteJourneyRepository
                .findFavouriteJourneyById(id);

        favouriteJourneyOptional.ifPresent(favouriteJourneyRepository::delete);
    }
}
