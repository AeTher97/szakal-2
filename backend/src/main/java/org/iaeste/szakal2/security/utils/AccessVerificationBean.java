package org.iaeste.szakal2.security.utils;

import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@Log4j2
public class AccessVerificationBean {


    public AccessVerificationBean() {

    }

    public static boolean isUser(String id) {
        try {
            return UUID.fromString(SecurityContextHolder.getContext()
                    .getAuthentication().getPrincipal().toString()).equals(UUID.fromString(id));
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    public boolean hasAccessToUser(String id) {
        return SecurityUtils.getUserId().equals(UUID.fromString(id));
    }

}
