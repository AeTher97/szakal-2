package org.iaeste.szakal2;

import io.restassured.http.ContentType;
import org.iaeste.szakal2.models.entities.AccessRight;
import org.iaeste.szakal2.models.entities.Role;
import org.iaeste.szakal2.repositories.AccessRightRepository;
import org.iaeste.szakal2.repositories.RolesRepository;
import org.iaeste.szakal2.util.IntegrationTestWithTools;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class RoleIntegrationTest extends IntegrationTestWithTools {

    @Autowired
    private RolesRepository rolesRepository;

    @Autowired
    private AccessRightRepository accessRightRepository;

    @Test
    public void testAddRole() {
        AccessRight accessRight = integrationTestDatabase.createAccessRight("access_to_everything");

        UUID roleId = UUID.fromString(withAccessRights("role_modification")
                .contentType(ContentType.JSON)
                .body(StringTemplate.STR. """
                        {
                            "name" : "USER",
                            "description" : "Role for a user",
                            "accessRights" : ["\{ accessRight.getId() }"]
                        }
                        """ )
                .when()
                .post("/api/roles")
                .then()
                .statusCode(200)
                .extract()
                .path("id"));

        assertThat(rolesRepository.findRoleById(roleId)).isPresent();
        assertThat(rolesRepository.findRoleById(roleId).get().getName()).isEqualTo("USER");
        assertThat(rolesRepository.findRoleById(roleId).get().getDescription()).isEqualTo("Role for a user");
        assertThat(rolesRepository.findRoleById(roleId).get().getAccessRights().size()).isEqualTo(1);
        assertEquals(accessRight.getId(), rolesRepository.findRoleById(roleId).get().getAccessRights().get(0).getId());

    }

    @Test
    public void testAddRoleWithTheSameNameShouldAddJustOne() {
        AccessRight accessRight = integrationTestDatabase.createAccessRight("access_to_everything");

        withAccessRights("role_modification")
                .contentType(ContentType.JSON)
                .body(StringTemplate.STR. """
                        {
                            "name" : "USER",
                            "description" : "Role for a user",
                            "accessRights" : ["\{ accessRight.getId() }"]
                        }
                        """ )
                .when()
                .post("/api/roles")
                .then()
                .statusCode(200);

        withAccessRights("role_modification")
                .contentType(ContentType.JSON)
                .body(StringTemplate.STR. """
                        {
                            "name" : "USER",
                            "description" : "Role for a user",
                            "accessRights" : ["\{ accessRight.getId() }"]
                        }
                        """ )
                .when()
                .post("/api/roles")
                .then()
                .statusCode(409);

        assertThat(rolesRepository.findAll().size()).isEqualTo(2);
        assertThat(rolesRepository.findRoleByNameIgnoreCase("USER").get().getDescription())
                .isEqualTo("Role for a user");
    }

    @Test
    public void testModifyRole() {
        AccessRight accessRight = integrationTestDatabase.createAccessRight("role_modification");

        rolesRepository.save(Role.builder()
                .name("ADMIN")
                .accessRights(List.of(accessRight))
                .build());


        AccessRight adminAccessRight = accessRightRepository.findAccessRightByCode("role_modification").get();

        UUID adminUserRoleId = rolesRepository.findRoleByNameIgnoreCase("ADMIN").get().getId();

        UUID roleId = UUID.fromString(withAccessRights("role_modification")
                .contentType(ContentType.JSON)
                .body(StringTemplate.STR. """
                        {
                            "name" : "ADMIN-2",
                            "description" : "Role for a better admin",
                            "accessRights" : ["\{ accessRight.getId() }", "\{ adminAccessRight.getId() }"]
                        }
                        """ )
                .when()
                .put("/api/roles/" + adminUserRoleId)
                .then()
                .statusCode(200)
                .extract()
                .path("id"));

        assertThat(rolesRepository.findRoleById(roleId)).isPresent();
        assertThat(rolesRepository.findRoleById(roleId).get().getName()).isEqualTo("ADMIN-2");
        assertThat(rolesRepository.findRoleById(roleId).get().getDescription()).isEqualTo("Role for a better admin");
        assertThat(rolesRepository.findRoleById(roleId).get().getAccessRights().size()).isEqualTo(2);
        assertThat(rolesRepository.findRoleByNameIgnoreCase("ADMIN")).isEmpty();
    }

    @Test
    public void testModifyRoleWithNonExistentAccessRight() {
        AccessRight accessRight = integrationTestDatabase.createAccessRight("role_modifictaion");

        rolesRepository.save(Role.builder()
                .name("ADMIN")
                .accessRights(List.of(accessRight))
                .build());

        UUID adminUserRoleId = rolesRepository.findRoleByNameIgnoreCase("ADMIN").get().getId();

        withAccessRights("role_modification")
                .contentType(ContentType.JSON)
                .body(StringTemplate.STR. """
                        {
                            "name" : "ADMIN-2",
                            "description" : "Role for a better admin",
                            "accessRights" : ["\{ accessRight.getId() }", "\{ UUID.randomUUID() }"]
                        }
                        """ )
                .when()
                .put("/api/roles/" + adminUserRoleId)
                .then()
                .statusCode(404);
    }

    @Test
    public void testAddRoleWithNonExistenAccessRightThrows404() {

        withAccessRights("role_modification")
                .contentType(ContentType.JSON)
                .body(StringTemplate.STR. """
                        {
                            "name" : "USER",
                            "description" : "Role for a user",
                            "accessRights" : ["\{ UUID.randomUUID() }"]
                        }
                        """ )
                .when()
                .post("/api/roles")
                .then()
                .statusCode(404);
    }

    @Test
    public void testDeleteRole() {
        AccessRight accessRight = integrationTestDatabase.createAccessRight("should_not_delete");

        Role role = Role.builder()
                .name("DELETED")
                .accessRights(List.of(accessRight))
                .description("Role to be deleted")
                .build();

        UUID deletedRoleID = rolesRepository.save(role).getId();

        withAccessRights("role_modification")
                .when()
                .delete("/api/roles/" + deletedRoleID)
                .then()
                .statusCode(200);

        assertThat(rolesRepository.findRoleById(deletedRoleID)).isEmpty();
        assertThat(accessRightRepository.findAccessRightById(accessRight.getId())).isPresent();
    }


}
