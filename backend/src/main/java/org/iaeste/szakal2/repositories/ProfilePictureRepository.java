package org.iaeste.szakal2.repositories;

import org.iaeste.szakal2.models.entities.ProfilePicture;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ProfilePictureRepository extends JpaRepository<ProfilePicture, UUID> {

    Optional<ProfilePicture> findProfilePictureByUserId(UUID uuid);
}
