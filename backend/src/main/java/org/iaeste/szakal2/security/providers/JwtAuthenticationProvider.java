package org.iaeste.szakal2.security.providers;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import lombok.extern.log4j.Log4j2;
import org.iaeste.szakal2.configuration.JwtConfiguration;
import org.iaeste.szakal2.repositories.RolesRepository;
import org.iaeste.szakal2.security.JwtTokenAuthentication;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Log4j2
public class JwtAuthenticationProvider extends FingerprintAuthenticationProvider implements AuthenticationProvider {

    private static final String ALGORITHM = "HmacSHA512";
    private final JwtConfiguration jwtConfiguration;
    private final RolesRepository rolesRepository;
    private final SecretKey key;

    public JwtAuthenticationProvider(JwtConfiguration jwtConfiguration, RolesRepository rolesRepository) {
        this.jwtConfiguration = jwtConfiguration;
        this.rolesRepository = rolesRepository;
        key = new SecretKeySpec(jwtConfiguration.getSecret().getBytes(), ALGORITHM);
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        if (authentication instanceof JwtTokenAuthentication jwtTokenAuthentication) {
            validateFingerprint(jwtTokenAuthentication.getUserFingerprint(),
                    jwtTokenAuthentication.getAuthToken(),
                    key,
                    jwtConfiguration.getIssuer());
            return validateToken(jwtTokenAuthentication.getAuthToken());
        } else {
            throw new BadCredentialsException("Invalid authentication");
        }
    }

    @Override
    public boolean supports(Class<?> aClass) {
        return aClass.equals(JwtTokenAuthentication.class);
    }

    private Authentication validateToken(String jwtToken) {

        try {
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .requireIssuer(jwtConfiguration.getIssuer())
                    .build()
                    .parseSignedClaims(jwtToken)
                    .getPayload();

            boolean isAccepted = claims.get("accepted", Boolean.class);
            if (!isAccepted) {
                throw new BadCredentialsException("User is not accepted");
            }

            List<UUID> roles = ((List<String>) claims.get("roles", List.class))
                    .stream().map(UUID::fromString).toList();
            Set<SimpleGrantedAuthority> grantedAuthorities = new HashSet<>();

            rolesRepository.findAllByIdIn(roles).forEach(role ->
                    grantedAuthorities.addAll(role.getAccessRights().stream().map(accessRight
                            -> new SimpleGrantedAuthority(accessRight.getCode())).toList()));

            return new JwtTokenAuthentication(claims.getSubject(), jwtToken, null, grantedAuthorities);

        } catch (JwtException | NullPointerException | IllegalArgumentException e) {
            log.info(e.getMessage());
            throw new BadCredentialsException("Jwt token invalid");
        }

    }
}
