package org.iaeste.szakal2.security.providers;


import io.jsonwebtoken.*;
import org.iaeste.szakal2.configuration.JwtConfiguration;
import org.iaeste.szakal2.models.entities.Role;
import org.iaeste.szakal2.models.entities.User;
import org.iaeste.szakal2.security.RefreshTokenAuthentication;
import org.iaeste.szakal2.security.TokenFactory;
import org.iaeste.szakal2.services.UserService;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.util.*;

public class JwtRefreshProvider implements AuthenticationProvider {

    private final JwtConfiguration jwtConfiguration;
    private final SecretKeySpec key;
    private final UserService userService;

    public JwtRefreshProvider(JwtConfiguration jwtConfiguration, UserService userService) {
        this.jwtConfiguration = jwtConfiguration;
        this.userService = userService;
        this.key = new SecretKeySpec(jwtConfiguration.getSecret().getBytes(), SignatureAlgorithm.HS512.getJcaName());
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        return validateToken(authentication.getCredentials().toString());
    }

    @Override
    public boolean supports(Class<?> aClass) {
        return aClass.equals(RefreshTokenAuthentication.class);
    }

    private Authentication validateToken(String jwtToken) {

        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .requireIssuer(jwtConfiguration.getIssuer())
                    .build()
                    .parseClaimsJws(jwtToken).getBody();

            Optional<User> userOptional = userService.getUserById(UUID.fromString(claims.getSubject()));

            if (userOptional.isPresent()) {
                User user = userOptional.get();
                List<GrantedAuthority> authorities = new ArrayList<>();
                List<String> authoritiesStrings = new ArrayList<>();

                user.getRoles().forEach(role ->
                    role.getAccessRights().forEach(accessRight -> {
                            authorities.add(new SimpleGrantedAuthority(accessRight.getCode()));
                            authoritiesStrings.add(accessRight.getCode());
                }));

                return new RefreshTokenAuthentication(claims.getSubject(),
                        TokenFactory.generateAuthToken(user.getId(),
                                authoritiesStrings,
                                user.getEmail(),
                                jwtConfiguration), authorities);
            } else {
                throw new UsernameNotFoundException("User with this id doesn't exist");
            }
        } catch (ExpiredJwtException | UnsupportedJwtException | MalformedJwtException | IllegalArgumentException e) {
            throw new BadCredentialsException(e.getMessage(), e);
        } catch (IOException | NullPointerException e) {
            throw new AuthenticationServiceException("Error occurred while trying to authenticate");
        }

    }
}
