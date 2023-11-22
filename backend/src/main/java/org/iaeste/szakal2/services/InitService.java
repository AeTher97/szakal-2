package org.iaeste.szakal2.services;

import lombok.extern.log4j.Log4j2;
import org.iaeste.szakal2.models.AccessRight;
import org.iaeste.szakal2.models.entities.Role;
import org.iaeste.szakal2.models.entities.User;
import org.iaeste.szakal2.repositories.AccessRightRepository;
import org.iaeste.szakal2.repositories.RolesRepository;
import org.iaeste.szakal2.repositories.UsersRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Log4j2
public class InitService {

    private static final List<AccessRight> viewingRights = List.of(
            AccessRight.builder().code("user_viewing").description("View users").build(),
            AccessRight.builder().code("role_viewing").description("View roles").build(),
            AccessRight.builder().code("company_viewing").description("View companies").build(),
            AccessRight.builder().code("category_viewing").description("View categories").build(),
            AccessRight.builder().code("campaign_viewing").description("View campaigns").build()
    );
    private static final List<AccessRight> modificationRights = List.of(
            AccessRight.builder().code("campaign_modification").description("Modify campaigns").build(),
            AccessRight.builder().code("role_modification").description("Modify roles").build(),
            AccessRight.builder().code("company_modification").description("Modify companies").build(),
            AccessRight.builder().code("category_modification").description("Modify categories").build(),
            AccessRight.builder().code("user_acceptance").description("Accept users").build(),
            AccessRight.builder().code("journey_modification").description("Modify journeys").build()
    );
    private final RolesRepository rolesRepository;
    private final PasswordEncoder passwordEncoder;
    private final UsersRepository usersRepository;
    private final AccessRightRepository accessRightRepository;

    public InitService(RolesRepository rolesRepository, UsersRepository usersRepository, AccessRightRepository accessRightRepository) {
        this.rolesRepository = rolesRepository;
        this.usersRepository = usersRepository;
        this.accessRightRepository = accessRightRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public void initializeDatabase() {
        if (usersRepository.findAll().isEmpty()) {
            List<AccessRight> savedAccessRights = createDefaultAccessRights();
            Role adminRole = createDefaultAdminRole(savedAccessRights);
            createDefaultAdminUser(adminRole);
        }
    }

    private List<AccessRight> createDefaultAccessRights() {
        log.info("Creating default access rights");
        List<AccessRight> saved = accessRightRepository.saveAll(modificationRights);
        saved.addAll(accessRightRepository.saveAll(viewingRights));
        return saved;

    }

    private Role createDefaultAdminRole(List<AccessRight> accessRights) {
        log.info("Creating default role");
        Role adminRole = Role.builder()
                .name("ADMIN")
                .description("System administrator")
                .accessRights(accessRights)
                .build();
        return rolesRepository.save(adminRole);
    }

    private void createDefaultAdminUser(Role role) {
        log.info("Creating default admin user");
        usersRepository.save(User.builder()
                .email("administrator@szakal.org")
                .password(passwordEncoder.encode("administrator"))
                .roles(List.of(role))
                .name("Admin")
                .surname("Admin")
                .createdAt(LocalDateTime.now())
                .accepted(true)
                .active(true)
                .build());
    }
}
