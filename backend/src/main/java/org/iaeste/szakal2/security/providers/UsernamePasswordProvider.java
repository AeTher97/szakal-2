package org.iaeste.szakal2.security.providers;


import org.iaeste.szakal2.configuration.JwtConfiguration;
import org.iaeste.szakal2.models.entities.User;
import org.iaeste.szakal2.repositories.UsersRepository;
import org.iaeste.szakal2.security.TokenFactory;
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
import java.util.Optional;

public class UsernamePasswordProvider implements AuthenticationProvider {

    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtConfiguration jwtConfiguration;

    public UsernamePasswordProvider(UsersRepository usersRepository, PasswordEncoder passwordEncoder, JwtConfiguration jwtConfiguration) {
        this.usersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtConfiguration = jwtConfiguration;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        Optional<User> userOptional = usersRepository.findUserByEmailIgnoreCase(authentication.getPrincipal().toString());
        if (userOptional.isEmpty()) {
            throw new BadCredentialsException("Invalid credentials");
        }
        User user = userOptional.get();

        if (!user.isActive()) {
            throw new BadCredentialsException(STR."""
                    Your account is no longer active""");
        }

        List<GrantedAuthority> authorities = new ArrayList<>();
        user.getRoles().forEach(role -> authorities.add(new SimpleGrantedAuthority(role.getId().toString())));


        if (passwordEncoder.matches(authentication.getCredentials().toString(), user.getPassword())) {
            try {
                return new UsernamePasswordAuthenticationToken(authentication.getPrincipal(),
                        new TokenHolder(
                                TokenFactory.generateAuthToken(user.getId(),
                                        authorities.stream().map(GrantedAuthority::getAuthority).toList(),
                                        user.getEmail(),
                                        user.getName(),
                                        user.getSurname(),
                                        jwtConfiguration),
                                TokenFactory.generateRefreshToken(user.getId(), jwtConfiguration), user.isAccepted()),
                        authorities);
            } catch (IOException | NullPointerException e) {
                throw new AuthenticationServiceException("Error occurred while trying to authenticate");
            }
        } else {
            throw new BadCredentialsException("Invalid credentials");
        }
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);

    }
}
