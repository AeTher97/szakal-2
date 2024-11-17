package org.iaeste.szakal2.security.handlers;

import jakarta.servlet.http.Cookie;

public class SessionCookieSuccessHandler {

    private static final String SESSION_COOKIE_NAME = "SESSION_COOKIE";

    protected Cookie getSessionCookie(String userFingerprint) {
        String fingerprintCookie = "__Secure-Fgp=" + userFingerprint;
        Cookie cookie = new Cookie(SESSION_COOKIE_NAME, fingerprintCookie);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setAttribute("SameSite", "Strict");
        return cookie;
    }

}
