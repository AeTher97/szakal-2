package org.iaeste.szakal2.repositories;

import org.iaeste.szakal2.models.entities.Notification;
import org.iaeste.szakal2.models.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    List<Notification> findByUserOrderByDateDesc(User user);
}
