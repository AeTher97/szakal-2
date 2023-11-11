package org.iaeste.szakal2.repositories;

import org.iaeste.szakal2.models.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RolesRepository extends JpaRepository<Role, UUID> {

    Optional<Role> findRoleById(UUID id);
    Optional<Role> findRoleByName(String name);
}
