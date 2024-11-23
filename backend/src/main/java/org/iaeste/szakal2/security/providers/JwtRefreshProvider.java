package org.iaeste.szakal2.security.providers;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import org.iaeste.szakal2.configuration.JwtConfiguration;
import org.iaeste.szakal2.models.entities.User;
import org.iaeste.szakal2.repositories.UsersRepository;
import org.iaeste.szakal2.security.RefreshTokenAuthentication;
import org.iaeste.szakal2.security.TokenFactory;
import org.iaeste.szakal2.security.utils.Fingerprint;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public class JwtRefreshProvider implements AuthenticationProvider {

    private static final String ALGORITHM = "HmacSHA512";
    private final JwtConfiguration jwtConfiguration;
    private final SecretKey key;
    private final UsersRepository usersRepository;

    public JwtRefreshProvider(JwtConfiguration jwtConfiguration, UsersRepository usersRepository) {
        this.jwtConfiguration = jwtConfiguration;
        this.usersRepository = usersRepository;
        key = new SecretKeySpec(jwtConfiguration.getSecret().getBytes(), ALGORITHM);
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        if (authentication instanceof RefreshTokenAuthentication refreshTokenAuthentication) {
            return validateToken(refreshTokenAuthentication.getRefreshToken());
        } else {
            throw new BadCredentialsException("Invalid authentication");
        }
    }

    @Override
    public boolean supports(Class<?> aClass) {
        return aClass.equals(RefreshTokenAuthentication.class);
    }

    private Authentication validateToken(String jwtToken) {

        try {
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .requireIssuer(jwtConfiguration.getIssuer())
                    .build()
                    .parseSignedClaims(jwtToken)
                    .getPayload();

            String type = claims.get("type", String.class);
            if (!type.equals("refresh")) {
                throw new BadCredentialsException("Invalid refresh token");
            }

            Optional<User> userOptional = usersRepository.findUserById(UUID.fromString(claims.getSubject()));
            if (userOptional.isEmpty()) {
                throw new BadCredentialsException("User not found");
            }
            User user = userOptional.get();

            List<GrantedAuthority> authorities = new ArrayList<>();

            user.getRoles().forEach(role -> authorities.add(new SimpleGrantedAuthority(role.getId().toString())));

            String userFingerprint = Fingerprint.generateFingerprint();

            return new RefreshTokenAuthentication(claims.getSubject(),
                    null,
                    TokenFactory.generateAuthToken(user.getId(),
                            authorities.stream().map(GrantedAuthority::getAuthority).toList(),
                            user.getEmail(),
                            user.getName(),
                            user.getSurname(),
                            userFingerprint,
                            jwtConfiguration),
                    userFingerprint,
                    authorities);

        } catch (JwtException | IllegalArgumentException e) {
            throw new BadCredentialsException(e.getMessage(), e);
        } catch (NullPointerException | NoSuchAlgorithmException e) {
            throw new AuthenticationServiceException("Error occurred while trying to authenticate");
        }

    }
}
