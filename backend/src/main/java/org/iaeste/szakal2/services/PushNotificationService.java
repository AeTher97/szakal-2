package org.iaeste.szakal2.services;

import org.iaeste.szakal2.models.entities.Notification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PushNotificationService {

    public void pushNotification(Notification notification) {
        List<String> pushNotificationTokens = notification.getUser().getPushNotificationTokens();
        pushNotificationTokens.forEach(this::pushToDevice);
    }

    private void pushToDevice(String pushNotificationToken) {

    }
}
