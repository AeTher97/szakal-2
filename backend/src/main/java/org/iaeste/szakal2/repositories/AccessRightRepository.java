package org.iaeste.szakal2.repositories;

import org.iaeste.szakal2.models.AccessRight;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AccessRightRepository extends JpaRepository<AccessRight, UUID> {

    AccessRight findAccessRightById(UUID id);
}
