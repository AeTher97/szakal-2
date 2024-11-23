package org.iaeste.szakal2.security.utils;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.UUID;

public class SecurityUtils {

    private SecurityUtils() {
    }

    public static UUID getUserId() {
        return UUID.fromString(SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString());
    }

    public static Authentication getAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

}
