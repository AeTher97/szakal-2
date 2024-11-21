package org.iaeste.szakal2.security.filters;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.iaeste.szakal2.security.handlers.SzakalAuthenticationFailureHandler;
import org.iaeste.szakal2.security.handlers.SzakalAuthenticationSuccessHandler;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Log4j2
public class UsernamePasswordFilter extends UsernamePasswordAuthenticationFilter {

    private UsernamePasswordFilter() {
    }

    public static UsernamePasswordFilter getUsernamePasswordFilter(AuthenticationManager authenticationManager,
                                                                   String path,
                                                                   long authExpirationTime,
                                                                   long refreshExpirationTime) {
        UsernamePasswordFilter usernamePasswordFilter = new UsernamePasswordFilter();
        usernamePasswordFilter.setAuthenticationSuccessHandler(new SzakalAuthenticationSuccessHandler(authExpirationTime, refreshExpirationTime));
        usernamePasswordFilter.setAuthenticationFailureHandler(new SzakalAuthenticationFailureHandler());
        usernamePasswordFilter.setAuthenticationManager(authenticationManager);
        usernamePasswordFilter.setFilterProcessesUrl(path);
        usernamePasswordFilter.setUsernameParameter("username");
        return usernamePasswordFilter;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        String email = request.getParameter(getUsernameParameter());
        String password = request.getParameter(getPasswordParameter());

        if (email.isEmpty()) {
            throw new AuthenticationCredentialsNotFoundException("Username field not found");
        }

        if (password.isEmpty()) {
            throw new AuthenticationCredentialsNotFoundException("Password not found");
        }

        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(email, password);
        return getAuthenticationManager().authenticate(token);
    }

}
