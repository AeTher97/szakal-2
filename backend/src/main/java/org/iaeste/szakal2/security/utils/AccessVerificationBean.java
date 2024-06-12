package org.iaeste.szakal2.security.utils;

import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.Authentication;
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

    public static boolean hasRole(String role) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(role));
    }

}
