package org.iaeste.szakal2.repositories;

import org.iaeste.szakal2.models.entities.PasswordResetToken;
import org.iaeste.szakal2.models.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PasswordTokenRepository extends JpaRepository<PasswordResetToken, UUID> {

    Optional<PasswordResetToken> findPasswordResetTokenByToken(String token);

    void deleteAllPasswordResetTokensByUser(User user);

}