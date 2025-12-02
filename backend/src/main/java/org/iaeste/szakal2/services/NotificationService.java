package org.iaeste.szakal2.services;

import lombok.extern.log4j.Log4j2;
import org.iaeste.szakal2.exceptions.ResourceNotFoundException;
import org.iaeste.szakal2.models.entities.Comment;
import org.iaeste.szakal2.models.entities.ContactJourney;
import org.iaeste.szakal2.models.entities.Notification;
import org.iaeste.szakal2.models.entities.User;
import org.iaeste.szakal2.repositories.NotificationRepository;
import org.iaeste.szakal2.security.utils.AccessVerificationBean;
import org.iaeste.szakal2.security.utils.SecurityUtils;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Log4j2
public class NotificationService {

    private static final int MAX_NOTIFICATIONS = 30;
    private final NotificationRepository notificationRepository;
    private final UserService userService;
    private final PushNotificationService pushNotificationService;
    private final FavouriteJourneyService favouriteJourneyService;

    public NotificationService(NotificationRepository notificationRepository,
                               UserService userService,
                               PushNotificationService pushNotificationService, FavouriteJourneyService favouriteJourneyService) {
        this.notificationRepository = notificationRepository;
        this.userService = userService;
        this.pushNotificationService = pushNotificationService;
        this.favouriteJourneyService = favouriteJourneyService;
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

    private static boolean isNotJourneyOwner(ContactJourney contactJourney) {
        return !AccessVerificationBean.isUser(contactJourney.getUser().getId());
    }

    private static boolean isCommentOwner(Comment comment) {
        return SecurityUtils.isUser(comment.getUser().getId());
    }

    public void notifyOnJourneyStatusChange(ContactJourney contactJourney) {
        notifyOwner(contactJourney, STR."Status Twojego kontaku z firmą \{contactJourney.getCompany().getName()} w akcji \{contactJourney.getCampaign().getName()} został zmieniony");
        notifyObservers(contactJourney, STR."Status kontaktu z firmą \{contactJourney.getCompany().getName()} w akcji \{contactJourney.getCampaign().getName()} został zmieniony");
    }

    public void notifyOnJourneyContactEvent(ContactJourney contactJourney) {
        notifyOwner(contactJourney, STR."Twój kontakt z firmą \{contactJourney.getCompany().getName()} w akcji \{contactJourney.getCampaign().getName()} ma nowe wydarzenie kontaktowe");
        notifyObservers(contactJourney, STR."Kontakt z firmą \{contactJourney.getCompany().getName()} w akcji \{contactJourney.getCampaign().getName()} ma nowe wydarzenie kontaktowe");
    }

    public void notifyOnJourneyFinished(ContactJourney contactJourney) {
        notifyOwner(contactJourney, STR."Twój kontakt z firmą \{contactJourney.getCompany().getName()} w akcji \{contactJourney.getCampaign().getName()} został zakończony");
        notifyObservers(contactJourney, STR."Kontakt z firmą \{contactJourney.getCompany().getName()} w akcji \{contactJourney.getCampaign().getName()} został zakończony");
    }

    public void notifyOnJourneyReopened(ContactJourney contactJourney) {
        notifyOwner(contactJourney, STR."Twój kontakt z firmą \{contactJourney.getCompany().getName()} w akcji \{contactJourney.getCampaign().getName()} został ponwnie otwarty");
        notifyObservers(contactJourney, STR."Kontakt z firmą \{contactJourney.getCompany().getName()} w akcji \{contactJourney.getCampaign().getName()} został ponwnie otwarty");
    }

    public void notifyOnJourneyComment(ContactJourney contactJourney) {
        notifyOwner(contactJourney, STR."Twój kontakt z firmą \{contactJourney.getCompany().getName()} w akcji \{contactJourney.getCampaign().getName()} ma nowy komentarz");
        notifyObservers(contactJourney, STR."Kontakt z firmą \{contactJourney.getCompany().getName()} w akcji \{contactJourney.getCampaign().getName()} ma nowy komentarz");
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

    private void notifyOwner(ContactJourney contactJourney, String message) {
        if (contactJourney.getUser() != null && isNotJourneyOwner(contactJourney)) {
            notify(contactJourney.getUser(), message, contactJourney.getId());
        }
    }

    private void notifyObservers(ContactJourney contactJourney, String message) {
        Set<User> usersToNotify = getObservingUsersToNotify(contactJourney);

        usersToNotify.forEach(user -> {
            notify(user, message, contactJourney.getId());
        });
    }

    private Set<User> getObservingUsersToNotify(ContactJourney contactJourney) {
        Set<User> usersToNotify = new HashSet<>();

        contactJourney.getComments().forEach(comment -> {
            if (!isCommentOwner(comment) && !comment.getUser().getId().equals(contactJourney.getUser().getId())) {
                usersToNotify.add(comment.getUser());
            }
        });

        favouriteJourneyService.getFavouriteJourneysForJourney(contactJourney.getId())
                .forEach(favouriteJourney -> {
                    if (!SecurityUtils.isUser(favouriteJourney.getUserId())) {
                        usersToNotify.add(userService.getUserById(favouriteJourney.getUserId()));
                    }
                });

        return usersToNotify;
    }

}
