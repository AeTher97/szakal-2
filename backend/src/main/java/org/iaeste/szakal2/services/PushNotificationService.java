package org.iaeste.szakal2.services;

import lombok.extern.slf4j.Slf4j;
import nl.martijndwars.webpush.Encoding;
import nl.martijndwars.webpush.PushService;
import nl.martijndwars.webpush.Subscription;
import org.apache.http.HttpResponse;
import org.apache.http.util.EntityUtils;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.iaeste.szakal2.configuration.JwtConfiguration;
import org.iaeste.szakal2.models.dto.user.PushNotificationSubscriptionDTO;
import org.iaeste.szakal2.models.entities.Notification;
import org.springframework.stereotype.Service;

import java.security.GeneralSecurityException;
import java.security.Security;
import java.util.List;

@Slf4j
@Service
public class PushNotificationService {

    private final PushService pushService;
    private final UserService userService;

    public PushNotificationService(JwtConfiguration jwtConfiguration, UserService userService) throws GeneralSecurityException {
        this.userService = userService;
        Security.addProvider(new BouncyCastleProvider());
        pushService = new PushService();
        pushService.setPrivateKey(jwtConfiguration.getPushPrivateKey());
        pushService.setPublicKey(jwtConfiguration.getPushPublicKey());
        pushService.setSubject(STR."mailto:\{System.getenv("EMAIL_USERNAME")}");
    }

    public void pushNotification(Notification notification) {
        List<PushNotificationSubscriptionDTO> pushNotificationTokens = notification.getUser().getPushNotificationTokens();
        pushNotificationTokens.forEach(token -> pushToDevice(notification, token));
    }

    private void pushToDevice(Notification szakalNotification, PushNotificationSubscriptionDTO pushNotificationSubscriptionDTO) {
        try {
            nl.martijndwars.webpush.Notification notification =
                    new nl.martijndwars.webpush.Notification(
                            new Subscription(pushNotificationSubscriptionDTO.getEndpoint(),
                                    new Subscription.Keys(pushNotificationSubscriptionDTO.getP256dh(),
                                            pushNotificationSubscriptionDTO.getAuth())),
                            STR."{\"message\": \"\{szakalNotification.getText()}\"}");
            HttpResponse response = pushService.send(notification, Encoding.AES128GCM);
            if (response.getStatusLine().getStatusCode() != 201) {
                String body = EntityUtils.toString(response.getEntity());
                log.error("Push notification failed {} {}", response.getStatusLine().getStatusCode(), body);
                if (response.getStatusLine().getStatusCode() == 410) {
                    log.info("Removing push notification credentials");
                    userService.removePushNotificationToken(szakalNotification.getUser().getId(), pushNotificationSubscriptionDTO);
                }
            } else {
                log.info("Push notification successful");
            }
        } catch (Exception e) {
            log.error("Failed to send push notification", e);
        }
    }
}
