package org.iaeste.szakal2.services;

import lombok.extern.log4j.Log4j2;
import org.iaeste.szakal2.exceptions.ResourceNotFoundException;
import org.iaeste.szakal2.models.entities.Notification;
import org.iaeste.szakal2.models.entities.User;
import org.iaeste.szakal2.repositories.NotificationRepository;
import org.iaeste.szakal2.security.utils.SecurityUtils;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Log4j2
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserService userService;

    public NotificationService(NotificationRepository notificationRepository, UserService userService) {
        this.notificationRepository = notificationRepository;
        this.userService = userService;
    }

    public void notify(User user, String text) {
        notificationRepository.save(Notification.builder()
                .user(user)
                .seen(false)
                .date(LocalDateTime.now())
                .text(text)
                .build());
    }

    public void markSeen(List<UUID> notifications) throws ResourceNotFoundException {
        List<Notification> notificationList = notificationRepository.findAllById(notifications);
        List<RuntimeException> exceptions = new ArrayList<>();
        if (notificationList.size() < notifications.size()) {
            throw new ResourceNotFoundException("Notification with this id doesn't exist");
        } else {
            notificationList.forEach(notification -> {
                if (!notification.getUser().getId().equals(SecurityUtils.getUserId())) {
                    exceptions.add(new BadCredentialsException("Cannot access this notification"));
                }
                notification.setSeen(true);
                notificationRepository.save(notification);
            });
        }
        if (!exceptions.isEmpty()) {
            throw exceptions.get(0);
        }
    }

    public List<Notification> getNotifications() {
        User user = userService.getUserById(SecurityUtils.getUserId());
        List<Notification> notifications = notificationRepository
                .findByUserOrderByDateDesc(user);
        if (notifications.size() > 10) {
            int size = notifications.size();
            for (int i = 10; i < notifications.size(); i++) {
                notificationRepository.delete(notifications.get(i));
            }
            log.info("Deleted " + (size - notifications.size()) + " notifications for user" + SecurityUtils.getUserId());
            return notifications.subList(0, 9);
        } else {
            return notifications;
        }
    }
}
