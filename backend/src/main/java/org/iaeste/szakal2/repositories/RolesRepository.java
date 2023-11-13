package org.iaeste.szakal2.repositories;

import org.iaeste.szakal2.models.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface RolesRepository extends JpaRepository<Role, UUID> {

    Optional<Role> findRoleById(UUID id);
    Optional<Role> findRoleByNameIgnoreCase(String name);
    List<Role> findAllByNameIn(List<String> names);
}
