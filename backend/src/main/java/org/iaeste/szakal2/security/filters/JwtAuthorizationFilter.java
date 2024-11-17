package org.iaeste.szakal2.security.filters;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.iaeste.szakal2.security.JwtTokenAuthentication;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Optional;

@Log4j2
public class JwtAuthorizationFilter extends OncePerRequestFilter {

    private final AuthenticationManager authenticationManager;
    private static final String SESSION_COOKIE = "SESSION_COOKIE";

    public JwtAuthorizationFilter(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = httpServletRequest.getHeader("Authorization");
        Cookie[] cookies = httpServletRequest.getCookies();
        if (cookies == null || authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.trace("Authorization cookies or token missing, anonymous");
            filterChain.doFilter(httpServletRequest, httpServletResponse);
            return;
        }

        Optional<Cookie> sessionCookie = Arrays.stream(cookies)
                .filter(cookie -> SESSION_COOKIE.equals(cookie.getName()))
                .findAny();

        if (sessionCookie.isEmpty()) {
            log.trace("Session cookie missing, anonymous");
            filterChain.doFilter(httpServletRequest, httpServletResponse);
            return;
        }

        try {
            JwtTokenAuthentication authentication =
                    new JwtTokenAuthentication(
                            null,
                            stripBearer(authHeader),
                            stripFgp(sessionCookie.get().getValue()),
                            null);
            Authentication authResult = authenticationManager.authenticate(authentication);

            SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
            securityContext.setAuthentication(authResult);

            SecurityContextHolder.setContext(securityContext);
            filterChain.doFilter(httpServletRequest, httpServletResponse);

        } catch (AuthenticationException e) {
            SecurityContextHolder.clearContext();
            httpServletResponse.sendError(HttpStatus.UNAUTHORIZED.value(), HttpStatus.UNAUTHORIZED.getReasonPhrase());
        }
    }

    private String stripBearer(String tokenWithBearer) {
        return tokenWithBearer.replace("Bearer",
                "").trim();
    }

    private String stripFgp(String tokenWithBearer) {
        return tokenWithBearer.replace("__Secure-Fgp=",
                "").trim();
    }
}
