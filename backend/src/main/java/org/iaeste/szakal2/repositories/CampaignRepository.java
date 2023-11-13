package org.iaeste.szakal2.repositories;

import org.iaeste.szakal2.models.entities.Campaign;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CampaignRepository extends JpaRepository<Campaign, UUID> {

    Optional<Campaign> findCampaignById(UUID id);
}
