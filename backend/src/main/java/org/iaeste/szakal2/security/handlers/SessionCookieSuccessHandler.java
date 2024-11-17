package org.iaeste.szakal2.security.handlers;

import jakarta.servlet.http.Cookie;

public class SessionCookieSuccessHandler {

    private static final String FGP_COOKIE_NAME = "FGP_COOKIE";
    private final int jwtExpirationTime;

    public SessionCookieSuccessHandler(int jwtExpirationTime) {
        this.jwtExpirationTime = jwtExpirationTime;
    }

    protected Cookie getSessionCookie(String userFingerprint) {
        String fingerprintCookie = "__Secure-Fgp=" + userFingerprint;
        Cookie cookie = new Cookie(FGP_COOKIE_NAME, fingerprintCookie);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        //Millis to seconds
        cookie.setMaxAge(jwtExpirationTime / 1000);
        cookie.setAttribute("SameSite", "Strict");
        return cookie;
    }

}
