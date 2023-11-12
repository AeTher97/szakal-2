package org.iaeste.szakal2.security.providers;


import org.iaeste.szakal2.configuration.JwtConfiguration;
import org.iaeste.szakal2.models.entities.User;
import org.iaeste.szakal2.security.TokenFactory;
import org.iaeste.szakal2.services.UserService;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class UsernamePasswordProvider implements AuthenticationProvider {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtConfiguration jwtConfiguration;

    public UsernamePasswordProvider(UserService userService, PasswordEncoder passwordEncoder, JwtConfiguration jwtConfiguration) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtConfiguration = jwtConfiguration;
        userService.setUsernamePasswordProvider(this);
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        User user = userService.getUserByEmail(authentication.getPrincipal().toString());

        List<GrantedAuthority> authorities = new ArrayList<>();

        user.getRoles().forEach(role ->
                role.getAccessRights().forEach(accessRight -> {
                    authorities.add(new SimpleGrantedAuthority(accessRight.getCode()));
                }));
        if (passwordEncoder.matches(authentication.getCredentials().toString(), user.getPassword())) {
            try {
                return new UsernamePasswordAuthenticationToken(authentication.getPrincipal(),
                        new TokenHolder(
                                TokenFactory.generateAuthToken(user.getId(),
                                        authorities.stream().map(GrantedAuthority::getAuthority).toList(),
                                        user.getEmail(), jwtConfiguration),
                                TokenFactory.generateRefreshToken(user.getId(), jwtConfiguration)),
                        authorities);
            } catch (IOException | NullPointerException e) {
                throw new AuthenticationServiceException("Error occurred while trying to authenticate");
            }
        } else {
            throw new BadCredentialsException("Invalid password");
        }
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);

    }
}
