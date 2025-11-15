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

    private static final int MAX_NOTIFICATIONS = 30;
    private final NotificationRepository notificationRepository;
    private final UserService userService;
    private final PushNotificationService pushNotificationService;

    public NotificationService(NotificationRepository notificationRepository,
                               UserService userService,
                               PushNotificationService pushNotificationService) {
        this.notificationRepository = notificationRepository;
        this.userService = userService;
        this.pushNotificationService = pushNotificationService;
    }

    public void notify(User user, String text) {
        notify(user, text, null);
    }

    public void notify(User user, String text, UUID journeyId) {
        Notification notificationForRepository = Notification.builder()
                .user(user)
                .seen(false)
                .date(LocalDateTime.now())
                .text(journeyId != null ? STR."\{text}, kliknij aby przejść do kontaktu" : text)
                .journeyId(journeyId)
                .build();

        Notification pushNotification = Notification.builder()
                .user(user)
                .seen(false)
                .date(LocalDateTime.now())
                .text(text.replaceAll("\n", " "))
                .journeyId(journeyId)
                .build();

        notificationRepository.save(notificationForRepository);
        pushNotificationService.pushNotification(pushNotification);
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
            throw exceptions.getFirst();
        }
    }

    public List<Notification> getNotifications() {
        User user = userService.getUserById(SecurityUtils.getUserId());
        List<Notification> notifications = notificationRepository
                .findByUserOrderByDateDesc(user);
        if (notifications.size() > MAX_NOTIFICATIONS) {
            int size = notifications.size();
            for (int i = MAX_NOTIFICATIONS; i < notifications.size(); i++) {
                notificationRepository.delete(notifications.get(i));
            }
            log.info("Deleted " + (size - notifications.size()) + " notifications for user" + SecurityUtils.getUserId());
            return notifications.subList(0, MAX_NOTIFICATIONS);
        } else {
            return notifications;
        }
    }
}
