package org.iaeste.szakal2.repositories;

import jakarta.persistence.Table;
import org.iaeste.szakal2.models.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

@Table(name = "users")
public interface UsersRepository extends JpaRepository<User, UUID> {

    Optional<User> findUserById(UUID id);

    Optional<User> findUserByUsername(String username);

    Optional<User> findUserByEmail(String email);

}
