package org.iaeste.szakal2.security.providers;


import io.jsonwebtoken.*;
import org.iaeste.szakal2.configuration.JwtConfiguration;
import org.iaeste.szakal2.models.entities.User;
import org.iaeste.szakal2.repositories.UsersRepository;
import org.iaeste.szakal2.security.RefreshTokenAuthentication;
import org.iaeste.szakal2.security.TokenFactory;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public class JwtRefreshProvider implements AuthenticationProvider {

    private final JwtConfiguration jwtConfiguration;
    private final SecretKeySpec key;
    private final UsersRepository usersRepository;

    public JwtRefreshProvider(JwtConfiguration jwtConfiguration, UsersRepository usersRepository) {
        this.jwtConfiguration = jwtConfiguration;
        this.key = new SecretKeySpec(jwtConfiguration.getSecret().getBytes(), SignatureAlgorithm.HS512.getJcaName());
        this.usersRepository = usersRepository;
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

            Optional<User> userOptional = usersRepository.findUserById(UUID.fromString(claims.getSubject()));
            if (userOptional.isEmpty()) {
                throw new BadCredentialsException("User not found");
            }
            User user = userOptional.get();

            List<GrantedAuthority> authorities = new ArrayList<>();

            user.getRoles().forEach(role -> authorities.add(new SimpleGrantedAuthority(role.getName())));

            return new RefreshTokenAuthentication(claims.getSubject(),
                    TokenFactory.generateAuthToken(user.getId(),
                            authorities.stream().map(GrantedAuthority::getAuthority).toList(),
                            user.getEmail(),
                            jwtConfiguration), authorities);

        } catch (ExpiredJwtException | UnsupportedJwtException | MalformedJwtException | IllegalArgumentException e) {
            throw new BadCredentialsException(e.getMessage(), e);
        } catch (IOException | NullPointerException e) {
            throw new AuthenticationServiceException("Error occurred while trying to authenticate");
        }

    }
}
