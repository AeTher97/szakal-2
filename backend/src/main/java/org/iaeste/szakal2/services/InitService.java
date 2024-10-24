package org.iaeste.szakal2.services;

import lombok.extern.log4j.Log4j2;
import org.iaeste.szakal2.models.entities.AccessRight;
import org.iaeste.szakal2.models.entities.Role;
import org.iaeste.szakal2.models.entities.User;
import org.iaeste.szakal2.repositories.AccessRightRepository;
import org.iaeste.szakal2.repositories.RolesRepository;
import org.iaeste.szakal2.repositories.UsersRepository;
import org.iaeste.szakal2.security.Authority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
@Log4j2
public class InitService {

    private static final List<AccessRight> viewingRights = List.of(
            AccessRight.builder().code(Authority.USER_VIEWING.getValue())
                    .description(Authority.USER_VIEWING.getDescription()).build(),
            AccessRight.builder().code(Authority.ROLE_VIEWING.getValue())
                    .description(Authority.ROLE_VIEWING.getDescription()).build());

    private static final List<AccessRight> modificationRights = List.of(
            AccessRight.builder().code(Authority.CAMPAIGN_MODIFICATION.getValue())
                    .description(Authority.CAMPAIGN_MODIFICATION.getDescription()).build(),
            AccessRight.builder().code(Authority.ROLE_MODIFICATION.getValue())
                    .description(Authority.ROLE_MODIFICATION.getDescription()).build(),
            AccessRight.builder().code(Authority.USER_ROLE_GRANTING.getValue())
                    .description(Authority.USER_ROLE_GRANTING.getDescription()).build(),
            AccessRight.builder().code(Authority.COMPANY_MODIFICATION.getValue())
                    .description(Authority.COMPANY_MODIFICATION.getDescription()).build(),
            AccessRight.builder().code(Authority.CATEGORY_MODIFICATION.getValue())
                    .description(Authority.CATEGORY_MODIFICATION.getDescription()).build(),
            AccessRight.builder().code(Authority.USER_ACCEPTANCE.getValue())
                    .description(Authority.USER_ACCEPTANCE.getDescription()).build(),
            AccessRight.builder().code(Authority.USER_MANAGEMENT.getValue())
                    .description(Authority.USER_MANAGEMENT.getDescription()).build(),
            AccessRight.builder().code(Authority.JOURNEY_CREATION.getValue())
                    .description(Authority.JOURNEY_CREATION.getDescription()).build(),
            AccessRight.builder().code(Authority.USER_GROUP_MODIFICATION.getValue())
                    .description(Authority.USER_GROUP_MODIFICATION.getDescription()).build(),
            AccessRight.builder().code(Authority.JOURNEY_CREATION_FOR_OTHERS.getValue())
                    .description(Authority.JOURNEY_CREATION_FOR_OTHERS.getDescription()).build(),
            AccessRight.builder().code(Authority.JOURNEY_MODIFICATION_FOR_OTHERS.getValue())
                    .description(Authority.JOURNEY_MODIFICATION_FOR_OTHERS.getDescription()).build(),
            AccessRight.builder().code(Authority.APP_SETTINGS.getValue())
                    .description(Authority.APP_SETTINGS.getDescription()).build()
    );
    private final RolesRepository rolesRepository;
    private final PasswordEncoder passwordEncoder;
    private final UsersRepository usersRepository;
    private final AccessRightRepository accessRightRepository;

    public InitService(RolesRepository rolesRepository,
                       UsersRepository usersRepository,
                       AccessRightRepository accessRightRepository) {
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
                .roles(Set.of(role))
                .name("Admin")
                .surname("Admin")
                .createdAt(LocalDateTime.now())
                .accepted(true)
                .active(true)
                .build());
    }
}
