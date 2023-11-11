package org.iaeste.szakal2.security.handlers;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import java.io.IOException;

public class SzakalRefreshSuccessHandler implements AuthenticationSuccessHandler {

    private final ObjectMapper objectMapper;

    public SzakalRefreshSuccessHandler() {
        this.objectMapper = new ObjectMapper();
    }


    @Override
    public void onAuthenticationSuccess(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Authentication authentication) throws IOException {
        httpServletResponse.addHeader("Authorization", authentication.getCredentials().toString());
        httpServletResponse.getWriter().write(objectMapper.writeValueAsString(new SuccessMessage(authentication.getCredentials().toString())));
        httpServletResponse.setContentType(MediaType.APPLICATION_JSON_VALUE);

    }

    @Data
    @AllArgsConstructor
    private static class SuccessMessage {
        private String authToken;

    }
}
