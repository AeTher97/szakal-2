package org.iaeste.szakal2.security.filters;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.iaeste.szakal2.security.RefreshTokenAuthentication;
import org.iaeste.szakal2.security.handlers.SzakalAuthenticationFailureHandler;
import org.iaeste.szakal2.security.handlers.SzakalRefreshSuccessHandler;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.util.StringUtils;


public class JwtRefreshFilter extends UsernamePasswordAuthenticationFilter {

    private JwtRefreshFilter(){

    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        String refreshToken = request.getParameter(getPasswordParameter());

        if(StringUtils.isEmpty(refreshToken)){
            throw new AuthenticationCredentialsNotFoundException("Refresh token not found");
        }

        RefreshTokenAuthentication authenticationToken = new RefreshTokenAuthentication(null,refreshToken,null);
        return getAuthenticationManager().authenticate(authenticationToken);
    }

    public static JwtRefreshFilter getJwtRefreshFilter(AuthenticationManager authenticationManager, String path){
        JwtRefreshFilter jwtRefreshFilter = new JwtRefreshFilter();
        jwtRefreshFilter.setAuthenticationSuccessHandler(new SzakalRefreshSuccessHandler());
        jwtRefreshFilter.setAuthenticationFailureHandler(new SzakalAuthenticationFailureHandler());
        jwtRefreshFilter.setAuthenticationManager(authenticationManager);
        jwtRefreshFilter.setFilterProcessesUrl(path);
        jwtRefreshFilter.setPasswordParameter("refreshToken");
        return jwtRefreshFilter;
    }
}
