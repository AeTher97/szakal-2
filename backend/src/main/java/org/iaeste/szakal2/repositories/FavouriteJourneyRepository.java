package org.iaeste.szakal2.repositories;

import org.iaeste.szakal2.models.entities.FavouriteJourney;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FavouriteJourneyRepository extends JpaRepository<FavouriteJourney, UUID> {

    @EntityGraph(value = "FavouriteJourney.full", type = EntityGraph.EntityGraphType.LOAD)
    List<FavouriteJourney> findFavouriteJourneyByUserId(UUID id);

    @EntityGraph(value = "FavouriteJourney.full", type = EntityGraph.EntityGraphType.LOAD)
    List<FavouriteJourney> findFavouriteJourneyByContactJourneyId(UUID journeyId);

    Optional<FavouriteJourney> findFavouriteJourneyById(UUID id);
}
