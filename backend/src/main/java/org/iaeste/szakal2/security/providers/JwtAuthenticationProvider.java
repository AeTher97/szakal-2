package org.iaeste.szakal2.security.providers;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.log4j.Log4j2;
import org.iaeste.szakal2.configuration.JwtConfiguration;
import org.iaeste.szakal2.repositories.RolesRepository;
import org.iaeste.szakal2.security.JwtTokenAuthentication;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import javax.crypto.spec.SecretKeySpec;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Log4j2
public class JwtAuthenticationProvider implements AuthenticationProvider {

    private final JwtConfiguration jwtConfiguration;
    private final RolesRepository rolesRepository;
    private final SecretKeySpec key;

    public JwtAuthenticationProvider(JwtConfiguration jwtConfiguration, RolesRepository rolesRepository) {
        this.jwtConfiguration = jwtConfiguration;
        this.rolesRepository = rolesRepository;
        key = new SecretKeySpec(jwtConfiguration.getSecret().getBytes(), SignatureAlgorithm.HS512.getJcaName());
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        return validateToken(authentication.getCredentials().toString());
    }

    @Override
    public boolean supports(Class<?> aClass) {
        return aClass.equals(JwtTokenAuthentication.class);
    }

    private Authentication validateToken(String jwtToken) {

        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .requireIssuer(jwtConfiguration.getIssuer())
                    .build()
                    .parseClaimsJws(jwtToken).getBody();

            List<UUID> roles = ((List<String>) claims.get("roles"))
                    .stream().map(string -> UUID.fromString(string)).toList();
            Set<SimpleGrantedAuthority> grantedAuthorities = new HashSet<>();

            rolesRepository.findAllByIdIn(roles).forEach(role ->
                    grantedAuthorities.addAll(role.getAccessRights().stream().map(accessRight
                            -> new SimpleGrantedAuthority(accessRight.getCode())).toList()));

            return new JwtTokenAuthentication(claims.getSubject(), jwtToken, grantedAuthorities);

        } catch (ExpiredJwtException | UnsupportedJwtException | MalformedJwtException | SignatureException |
                 IllegalArgumentException e) {
            log.info(e.getMessage());
            throw new BadCredentialsException(e.getMessage(), e);
        }

    }
}
