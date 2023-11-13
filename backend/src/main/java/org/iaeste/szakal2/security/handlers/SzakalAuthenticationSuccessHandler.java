package org.iaeste.szakal2.security.handlers;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.iaeste.szakal2.security.providers.TokenHolder;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import java.io.IOException;

public class SzakalAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final ObjectMapper objectMapper;

    public SzakalAuthenticationSuccessHandler() {
        this.objectMapper = new ObjectMapper();
    }


    @Override
    public void onAuthenticationSuccess(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Authentication authentication) throws IOException {
        httpServletResponse.addHeader("Authorization", authentication.getCredentials().toString());
        if (authentication.getCredentials() instanceof TokenHolder) {
            httpServletResponse.getWriter().write(objectMapper.writeValueAsString(
                    authentication.getCredentials()));
            httpServletResponse.setContentType(MediaType.APPLICATION_JSON_VALUE);
        } else {
            throw new IOException("Credentials are wrong class");
        }

    }


}
