package org.iaeste.szakal2.security.handlers;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.iaeste.szakal2.security.RefreshTokenAuthentication;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import java.io.IOException;

public class SzakalRefreshSuccessHandler extends SessionCookieSuccessHandler implements AuthenticationSuccessHandler {

    private final ObjectMapper objectMapper;

    public SzakalRefreshSuccessHandler(int jwtExpirationTime) {
        super(jwtExpirationTime);
        this.objectMapper = new ObjectMapper();
    }


    @Override
    public void onAuthenticationSuccess(HttpServletRequest httpServletRequest,
                                        HttpServletResponse httpServletResponse,
                                        Authentication authentication) throws IOException {
        if (authentication instanceof RefreshTokenAuthentication refreshTokenAuthentication) {
            httpServletResponse.getWriter().write(objectMapper.writeValueAsString(
                    new SuccessMessage(refreshTokenAuthentication.getAuthToken())));
            httpServletResponse.addCookie(getSessionCookie(refreshTokenAuthentication.getUserFingerprint()));
        } else {
            throw new IOException("Credentials are wrong class");
        }
        httpServletResponse.setContentType(MediaType.APPLICATION_JSON_VALUE);
    }

    @Data
    @AllArgsConstructor
    private static class SuccessMessage {
        private String authToken;

    }
}
