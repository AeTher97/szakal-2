package org.iaeste.szakal2.repositories;

import org.iaeste.szakal2.models.entities.ContactEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ContactEventRepository extends JpaRepository<ContactEvent, UUID> {
    List<ContactEvent> findByContactPersonId(UUID contactPersonId);
}