package org.iaeste.szakal2.security;

import org.iaeste.szakal2.configuration.JwtConfiguration;
import org.iaeste.szakal2.repositories.RolesRepository;
import org.iaeste.szakal2.repositories.UsersRepository;
import org.iaeste.szakal2.security.filters.JwtAuthorizationFilter;
import org.iaeste.szakal2.security.filters.JwtRefreshFilter;
import org.iaeste.szakal2.security.filters.UsernamePasswordFilter;
import org.iaeste.szakal2.security.providers.JwtAuthenticationProvider;
import org.iaeste.szakal2.security.providers.JwtRefreshProvider;
import org.iaeste.szakal2.security.providers.UsernamePasswordProvider;
import org.iaeste.szakal2.services.RoleService;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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

    private final UsersRepository usersRepository;
    private final RolesRepository rolesRepository;
    private final JwtConfiguration jwtConfiguration;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public SecurityConfiguration(UsersRepository usersRepository, RolesRepository rolesRepository, JwtConfiguration jwtConfiguration) {
        this.usersRepository = usersRepository;
        this.rolesRepository = rolesRepository;
        this.jwtConfiguration = jwtConfiguration;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .cors().disable()
                .csrf().disable()
                .authorizeHttpRequests(authorizer -> authorizer
                        .requestMatchers("/api/login").permitAll()
                        .requestMatchers("/api/refresh").permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/users").hasAuthority("user_viewing")
                        .requestMatchers(HttpMethod.GET, "/api/users/*").hasAuthority("user_viewing")
                        .requestMatchers(HttpMethod.POST, "/api/users").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/users/*/roles").hasAuthority("role_modification")
                        .requestMatchers(HttpMethod.PUT, "/api/users/*/accept").hasAuthority("user_acceptance")
                        .requestMatchers(HttpMethod.PUT, "/api/users/*/password").permitAll()

                        .requestMatchers(HttpMethod.POST,"/api/roles").hasAuthority("role_modification")
                        .requestMatchers(HttpMethod.PUT,"/api/roles/*").hasAuthority("role_modification")
                        .requestMatchers(HttpMethod.DELETE,"/api/roles/*").hasAuthority("role_modification")

                        .requestMatchers(HttpMethod.POST,"/api/companies").hasAuthority("company_modification")
                        .requestMatchers(HttpMethod.DELETE,"/api/companies/*").hasAuthority("company_modification")
                        .requestMatchers(HttpMethod.PUT,"/api/companies/*").hasAuthority("company_modification")
                        .requestMatchers(HttpMethod.PUT,"/api/companies/*/contactPerson").hasAuthority("company_modification")

                        .requestMatchers(HttpMethod.POST,"/api/categories").hasAuthority("category_modification")
                        .requestMatchers(HttpMethod.PUT,"/api/categories/*").hasAuthority("category_modification")
                        .requestMatchers(HttpMethod.DELETE,"/api/categories/*").hasAuthority("category_modification")

                        .requestMatchers(HttpMethod.POST,"/api/journeys").hasAuthority("journey_modification")
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
                new UsernamePasswordProvider(usersRepository, passwordEncoder, jwtConfiguration),
                new JwtAuthenticationProvider(jwtConfiguration, rolesRepository),
                new JwtRefreshProvider(jwtConfiguration, usersRepository)
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
