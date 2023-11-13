package org.iaeste.szakal2.repositories;

import jakarta.persistence.Table;
import org.iaeste.szakal2.models.entities.ContactPerson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
@Table(name = "contact_persons")
public interface ContactPersonRepository extends JpaRepository<ContactPerson, UUID> {

    Optional<ContactPerson> findContactPersonById(UUID id);
}
