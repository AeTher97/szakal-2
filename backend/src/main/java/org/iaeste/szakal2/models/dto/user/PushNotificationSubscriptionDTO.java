package org.iaeste.szakal2.models.dto.user;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class PushNotificationSubscriptionDTO {

    @NotEmpty
    private String p256dh;
    @NotEmpty
    private String auth;
    @NotEmpty
    private String endpoint;

}
