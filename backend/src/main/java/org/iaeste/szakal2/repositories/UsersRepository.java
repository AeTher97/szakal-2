package org.iaeste.szakal2.repositories;

import jakarta.persistence.Table;
import org.iaeste.szakal2.models.entities.Role;
import org.iaeste.szakal2.models.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Table(name = "users")
public interface UsersRepository extends JpaRepository<User, UUID>, JpaSpecificationExecutor<User> {

    @EntityGraph(value = "User.roles", type = EntityGraph.EntityGraphType.LOAD)
    Optional<User> findUserById(UUID id);

    @EntityGraph(value = "User.roles", type = EntityGraph.EntityGraphType.LOAD)
    List<User> findAllById(Iterable<UUID> ids);

    @EntityGraph(value = "User.roles", type = EntityGraph.EntityGraphType.LOAD)
    Optional<User> findUserByEmailIgnoreCase(String email);

    List<User> findUserByRolesIn(List<Role> roleList);

    List<User> findUsersByEmailContainingIgnoreCaseOrNameContainingIgnoreCaseOrSurnameContainingIgnoreCase(
            String firstName,
            String lastName, String email);

    Page<User> findAll(Specification<User> userSpecification, Pageable pageable);
}
