package org.iaeste.szakal2.repositories;

import org.iaeste.szakal2.models.entities.ScheduledContact;
import org.iaeste.szakal2.models.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface ScheduledContactRepository extends JpaRepository<ScheduledContact, UUID> {

    List<ScheduledContact> getScheduledContactByUser(User user);
    List<ScheduledContact> findScheduledContactsByReminderDateBetween(LocalDateTime from, LocalDateTime to);
}
