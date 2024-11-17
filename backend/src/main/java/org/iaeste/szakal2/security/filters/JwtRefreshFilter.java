package org.iaeste.szakal2.security.filters;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.iaeste.szakal2.security.RefreshTokenAuthentication;
import org.iaeste.szakal2.security.handlers.SzakalAuthenticationFailureHandler;
import org.iaeste.szakal2.security.handlers.SzakalRefreshSuccessHandler;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.Arrays;
import java.util.Optional;

@Slf4j
public class JwtRefreshFilter extends UsernamePasswordAuthenticationFilter {

    private static final String REFRESH_COOKIE = "JWT_REFRESH";

    public static JwtRefreshFilter getJwtRefreshFilter(AuthenticationManager authenticationManager,
                                                       String path,
                                                       int jwtExpirationTime) {
        JwtRefreshFilter jwtRefreshFilter = new JwtRefreshFilter();
        jwtRefreshFilter.setAuthenticationSuccessHandler(new SzakalRefreshSuccessHandler(jwtExpirationTime));
        jwtRefreshFilter.setAuthenticationFailureHandler(new SzakalAuthenticationFailureHandler());
        jwtRefreshFilter.setAuthenticationManager(authenticationManager);
        jwtRefreshFilter.setFilterProcessesUrl(path);
        jwtRefreshFilter.setPasswordParameter("refreshToken");
        return jwtRefreshFilter;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            log.trace("Authorization cookies");
            throw new AuthenticationCredentialsNotFoundException("Refresh cookies not found");
        }

        Optional<Cookie> refreshCookie = Arrays.stream(cookies)
                .filter(cookie -> REFRESH_COOKIE.equals(cookie.getName()))
                .findAny();

        if (refreshCookie.isEmpty()) {
            log.trace("Refresh cookie missing, anonymous");
            throw new AuthenticationCredentialsNotFoundException("Refresh cookies not found");
        }

        RefreshTokenAuthentication refreshTokenAuthentication
                = new RefreshTokenAuthentication(null,
                refreshCookie.get().getValue(),
                null,
                null,
                null);
        return getAuthenticationManager().authenticate(refreshTokenAuthentication);
    }
}
