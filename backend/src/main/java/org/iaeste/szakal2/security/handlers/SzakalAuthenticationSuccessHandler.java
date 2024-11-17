package org.iaeste.szakal2.security.handlers;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.iaeste.szakal2.security.providers.AuthTokenHolder;
import org.iaeste.szakal2.security.providers.RefreshTokenHolder;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import java.io.IOException;

public class SzakalAuthenticationSuccessHandler extends SessionCookieSuccessHandler implements AuthenticationSuccessHandler {

    private final ObjectMapper objectMapper;
    private static final String REFRESH_COOKIE_NAME = "JWT_REFRESH";
    private static final String AUTHENTICATED_COOKIE_NAME = "AUTHENTICATED";

    public SzakalAuthenticationSuccessHandler(int jwtExpirationTime) {
        super(jwtExpirationTime);
        this.objectMapper = new ObjectMapper();
    }


    @Override
    public void onAuthenticationSuccess(HttpServletRequest httpServletRequest,
                                        HttpServletResponse httpServletResponse,
                                        Authentication authentication) throws IOException {
        if (authentication.getCredentials() instanceof RefreshTokenHolder refreshTokenHolder) {
            httpServletResponse.getWriter().write(objectMapper.writeValueAsString(
                    new AuthTokenHolder(refreshTokenHolder.getAuthToken(), refreshTokenHolder.isAccepted())));
            httpServletResponse.addCookie(getRefreshCookie(refreshTokenHolder.getRefreshToken()));
            httpServletResponse.addCookie(getSessionCookie(refreshTokenHolder.getUserFingerprint()));
            httpServletResponse.addCookie(getAuthenticatedCookie());
            httpServletResponse.setContentType(MediaType.APPLICATION_JSON_VALUE);
        } else {
            throw new IOException("Credentials are wrong class");
        }

    }

    private Cookie getRefreshCookie(String token) {
        Cookie cookie = new Cookie(REFRESH_COOKIE_NAME, token);
        cookie.setMaxAge(8640000);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setAttribute("SameSite", "Strict");
        return cookie;
    }

    private Cookie getAuthenticatedCookie() {
        Cookie cookie = new Cookie(AUTHENTICATED_COOKIE_NAME, "true");
        cookie.setMaxAge(8640000);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setAttribute("SameSite", "Strict");
        return cookie;
    }


}
