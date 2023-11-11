package org.iaeste.szakal2.security.providers;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.log4j.Log4j2;
import org.iaeste.szakal2.configuration.JwtConfiguration;
import org.iaeste.szakal2.models.AccessRight;
import org.iaeste.szakal2.security.JwtTokenAuthentication;
import org.iaeste.szakal2.services.RoleService;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import javax.crypto.spec.SecretKeySpec;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Log4j2
public class JwtAuthenticationProvider implements AuthenticationProvider {

    private final JwtConfiguration jwtConfiguration;
    private final RoleService roleService;
    private final SecretKeySpec key;

    public JwtAuthenticationProvider(JwtConfiguration jwtConfiguration, RoleService roleService) {
        this.jwtConfiguration = jwtConfiguration;
        this.roleService = roleService;
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

            List<String> roles = (List<String>) claims.get("access_rights");
            List<SimpleGrantedAuthority> simpleGrantedAuthorities
                    = roles.stream().map(SimpleGrantedAuthority::new).toList();

            return new JwtTokenAuthentication(claims.getSubject(), jwtToken, simpleGrantedAuthorities);

        } catch (ExpiredJwtException | UnsupportedJwtException | MalformedJwtException | SignatureException |
                 IllegalArgumentException e) {
            log.info(e.getMessage());
            throw new BadCredentialsException(e.getMessage(), e);
        }

    }
}
