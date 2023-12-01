package org.iaeste.szakal2.repositories;

import org.iaeste.szakal2.models.entities.FailedEmail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface FailedEmailRepository extends JpaRepository<FailedEmail, UUID> {

}