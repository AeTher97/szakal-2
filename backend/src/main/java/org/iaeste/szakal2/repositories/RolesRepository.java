package org.iaeste.szakal2.repositories;

import org.iaeste.szakal2.models.entities.Role;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RolesRepository extends JpaRepository<Role, UUID> {

    Optional<Role> findRoleById(UUID id);

    Optional<Role> findRoleByNameIgnoreCase(String name);

    List<Role> findAllByNameIn(List<String> names);

    @EntityGraph(value = "Role.details", type = EntityGraph.EntityGraphType.LOAD)
    List<Role> findAllByIdIn(List<UUID> ids);
}
