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

@Service
@Log4j2
public class InitService {

    private static final List<AccessRight> viewingRights = List.of(
            AccessRight.builder().code(Authority.USER_VIEWING.getValue())
                    .description("Przeglądanie listy użytkowników").build(),
            AccessRight.builder().code(Authority.ROLE_VIEWING.getValue()
            ).description("Przeglądanie dostępnych ról").build());
    private static final List<AccessRight> modificationRights = List.of(
            AccessRight.builder().code(Authority.CAMPAIGN_MODIFICATION.getValue())
                    .description("Dodawanie akcji").build(),
            AccessRight.builder().code(Authority.ROLE_MODIFICATION.getValue())
                    .description("Modyfikacja definicji roli").build(),
            AccessRight.builder().code(Authority.USER_ROLE_GRANTING.getValue())
                    .description("Modyfikacja roli użytkownika").build(),
            AccessRight.builder().code(Authority.COMPANY_MODIFICATION.getValue())
                    .description("Modyfikacja firm").build(),
            AccessRight.builder().code(Authority.CATEGORY_MODIFICATION.getValue())
                    .description("Modyfikacja kategorii").build(),
            AccessRight.builder().code(Authority.USER_ACCEPTANCE.getValue())
                    .description("Akceptowanie użytkowników").build(),
            AccessRight.builder().code(Authority.USER_MANAGEMENT.getValue())
                    .description("Dezaktywowanie użytkowników").build(),
            AccessRight.builder().code(Authority.JOURNEY_CREATION.getValue())
                    .description("Przypisywanie firm do siebie").build(),
            AccessRight.builder().code(Authority.JOURNEY_CREATION_FOR_OTHERS.getValue())
                    .description("Przypisywanie firm do innych").build(),
            AccessRight.builder().code(Authority.JOURNEY_MODIFICATION_FOR_OTHERS.getValue())
                    .description("Edycja kontaktów innych").build(),
            AccessRight.builder().code(Authority.APP_SETTINGS.getValue()
            ).description("Ustawienia aplikacji").build()
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
