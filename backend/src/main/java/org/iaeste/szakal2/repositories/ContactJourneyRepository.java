package org.iaeste.szakal2.repositories;

import org.iaeste.szakal2.models.entities.Campaign;
import org.iaeste.szakal2.models.entities.Company;
import org.iaeste.szakal2.models.entities.ContactJourney;
import org.iaeste.szakal2.models.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ContactJourneyRepository extends JpaRepository<ContactJourney, UUID> {

    Optional<ContactJourney> findContactJourneyById(UUID id);
    Optional<ContactJourney> findContactJourneyByCampaignAndUserAndCompany(Campaign campaign, User user, Company company);
}
