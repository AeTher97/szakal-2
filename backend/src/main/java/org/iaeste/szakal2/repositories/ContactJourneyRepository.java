package org.iaeste.szakal2.repositories;

import jakarta.persistence.Table;
import org.iaeste.szakal2.models.entities.Campaign;
import org.iaeste.szakal2.models.entities.Company;
import org.iaeste.szakal2.models.entities.ContactJourney;
import org.iaeste.szakal2.models.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
@Table(name = "contact_journeys")
public interface ContactJourneyRepository extends JpaRepository<ContactJourney, UUID> {

    Optional<ContactJourney> findContactJourneyById(UUID id);
    Optional<ContactJourney> findContactJourneyByCampaignAndUserAndCompany(Campaign campaign, User user, Company company);

    Page<ContactJourney> findAllByCampaign(Campaign campaign, Pageable pageable);

    Page<ContactJourney> findAllByOrderByJourneyStart(Pageable pageable);
    Page<ContactJourney> findAllByUserAndCampaignOrderByJourneyStart(User user, Campaign campaign, Pageable pageable);
}
