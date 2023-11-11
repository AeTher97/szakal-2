package org.iaeste.szakal2.security;

import org.iaeste.szakal2.configuration.JwtConfiguration;
import org.iaeste.szakal2.security.filters.JwtAuthorizationFilter;
import org.iaeste.szakal2.security.filters.JwtRefreshFilter;
import org.iaeste.szakal2.security.filters.UsernamePasswordFilter;
import org.iaeste.szakal2.security.providers.JwtAuthenticationProvider;
import org.iaeste.szakal2.security.providers.JwtRefreshProvider;
import org.iaeste.szakal2.security.providers.UsernamePasswordProvider;
import org.iaeste.szakal2.services.RoleService;
import org.iaeste.szakal2.services.UserService;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@EnableWebSecurity
@EnableMethodSecurity(proxyTargetClass = true)
@EnableConfigurationProperties(JwtConfiguration.class)
@Configuration
public class SecurityConfiguration {

    private final RoleService roleService;
    private final UserService userService;
    private final JwtConfiguration jwtConfiguration;
    private final PasswordEncoder passwordEncoder;

    public SecurityConfiguration(RoleService roleService, UserService userService, JwtConfiguration jwtConfiguration,
                                 PasswordEncoder passwordEncoder) {
        this.roleService = roleService;
        this.userService = userService;
        this.jwtConfiguration = jwtConfiguration;
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .cors().disable()
                .csrf().disable()
                .authorizeHttpRequests(authorizer -> authorizer
                        .requestMatchers("/api/login").permitAll()
                        .requestMatchers("/api/refresh").permitAll()
                        .requestMatchers("/api/users").permitAll()
                        .requestMatchers("/api/roles").hasAuthority("role_modification")
                        .requestMatchers("/error").permitAll()
                        .requestMatchers("/api/**").authenticated()
                        .requestMatchers("/**").permitAll()
                        .anyRequest().authenticated()
                )
                .authenticationManager(authenticationManagerBean())
                .addFilter(UsernamePasswordFilter.getUsernamePasswordFilter(authenticationManagerBean(), "/api/login"))
                .addFilter(JwtRefreshFilter.getJwtRefreshFilter(authenticationManagerBean(), "/api/refresh"))
                .addFilterBefore(new JwtAuthorizationFilter(authenticationManagerBean()), SecurityContextHolderAwareRequestFilter.class)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManagerBean() {
        List<AuthenticationProvider> authenticationProviderList = Arrays.asList(
                new UsernamePasswordProvider(userService, passwordEncoder, jwtConfiguration),
                new JwtAuthenticationProvider(jwtConfiguration, roleService),
                new JwtRefreshProvider(jwtConfiguration, userService)
        );

        ProviderManager providerManager = new ProviderManager(authenticationProviderList);
        providerManager.setEraseCredentialsAfterAuthentication(false);
        return providerManager;
    }

    private UrlBasedCorsConfigurationSource corsConfiguration() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOriginPattern("*");
        config.addAllowedHeader("*");
        config.addAllowedMethod("GET");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("DELETE");
        config.addAllowedMethod("OPTIONS");
        config.addAllowedMethod("PATCH");
        source.registerCorsConfiguration("/**", config);
        return source;
    }


}
