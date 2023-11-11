package org.iaeste.szakal2.services;

import lombok.extern.log4j.Log4j2;
import org.iaeste.szakal2.models.AccessRight;
import org.iaeste.szakal2.models.entities.Role;
import org.iaeste.szakal2.models.entities.User;
import org.iaeste.szakal2.repositories.AccessRightRepository;
import org.iaeste.szakal2.repositories.RolesRepository;
import org.iaeste.szakal2.repositories.UsersRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
@Log4j2
public class InitService {

    private final RolesRepository rolesRepository;
    private final PasswordEncoder passwordEncoder;
    private final UsersRepository usersRepository;
    private final AccessRightRepository accessRightRepository;

    public InitService(RolesRepository rolesRepository, PasswordEncoder passwordEncoder, UsersRepository usersRepository, AccessRightRepository accessRightRepository) {
        this.rolesRepository = rolesRepository;
        this.passwordEncoder = passwordEncoder;
        this.usersRepository = usersRepository;
        this.accessRightRepository = accessRightRepository;
    }

    public void initializeDatabase() {
        if (usersRepository.findAll().isEmpty()) {
            createDefaultAdminUser(createDefaultRole(createRolesModificationAccessRight()));
        }
    }

    private AccessRight createRolesModificationAccessRight() {
        log.info("Creating default access rights");
        return accessRightRepository.save(AccessRight.builder()
                        .description("Right to modify roles")
                        .code("role_modification")
                .build());
    }

    private Role createDefaultRole(AccessRight accessRight) {
        log.info("Creating default role");
        Role adminRole = Role.builder()
                .name("ADMIM")
                .description("System administrator")
                .accessRights(Arrays.asList(accessRight))
                .build();
        return rolesRepository.save(adminRole);
    }

    private void createDefaultAdminUser(Role role) {
        log.info("Creating default admin user");
        usersRepository.save(User.builder()
                .username("administrator")
                .email("administrator@szakal.org")
                .password(passwordEncoder.encode("administrator"))
                .roles(Arrays.asList(role))
                .name("Admin")
                .surname("Admin")
                .build());
    }
}
