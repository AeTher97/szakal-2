package org.iaeste.szakal2.repositories;

import org.iaeste.szakal2.models.entities.RegisterToken;
import org.iaeste.szakal2.models.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RegisterTokenRepository extends JpaRepository<RegisterToken, UUID> {

    Optional<RegisterToken> findRegisterTokenByToken(String token);

    void deleteAllRegisterTokensByUser(User user);

}
