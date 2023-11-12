package org.iaeste.szakal2.repositories;

import org.iaeste.szakal2.models.AccessRight;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AccessRightRepository extends JpaRepository<AccessRight, UUID> {

    Optional<AccessRight> findAccessRightById(UUID id);
    Optional<AccessRight> findAccessRightByCode(String code);
}
