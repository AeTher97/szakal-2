package org.iaeste.szakal2.repositories;

import jakarta.persistence.Table;
import org.iaeste.szakal2.models.entities.Campaign;
import org.iaeste.szakal2.models.entities.Company;
import org.iaeste.szakal2.models.entities.ContactJourney;
import org.iaeste.szakal2.models.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@Table(name = "contact_journeys")
public interface ContactJourneyRepository extends JpaRepository<ContactJourney, UUID>, JpaSpecificationExecutor<ContactJourney> {

    Page<ContactJourney> findAll(Specification<ContactJourney> journeySpecification, Pageable pageable);

    @EntityGraph(value = "Journey.listing", type = EntityGraph.EntityGraphType.LOAD)
    List<ContactJourney> findAllById(Iterable<UUID> ids);

    @EntityGraph(value = "Journey.detail", type = EntityGraph.EntityGraphType.LOAD)
    Optional<ContactJourney> findContactJourneyById(UUID id);

    Optional<ContactJourney> findContactJourneyByCampaignAndUserAndCompany(Campaign campaign, User user, Company company);

    @EntityGraph(value = "Journey.detail", type = EntityGraph.EntityGraphType.LOAD)
    Optional<ContactJourney> findContactJourneyByCampaignAndCompany(Campaign campaign, Company company);

    Page<ContactJourney> findAllByOrderByJourneyStart(Pageable pageable);

    Page<ContactJourney> findAllByUserAndCampaignOrderByJourneyStart(User user, Campaign campaign, Pageable pageable);

    List<ContactJourney> findAllByCampaign(Campaign campaign);
}
