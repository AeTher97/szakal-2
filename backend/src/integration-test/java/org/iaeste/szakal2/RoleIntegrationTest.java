package org.iaeste.szakal2;

import io.restassured.http.ContentType;
import org.iaeste.szakal2.models.AccessRight;
import org.iaeste.szakal2.models.entities.Role;
import org.iaeste.szakal2.repositories.AccessRightRepository;
import org.iaeste.szakal2.repositories.RolesRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Arrays;
import java.util.UUID;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

public class RoleIntegrationTest extends IntegrationTestBase {

    @Autowired
    private RolesRepository rolesRepository;

    @Autowired
    private AccessRightRepository accessRightRepository;

    @Test
    public void testAddRole() {
        AccessRight accessRight = accessRightRepository.save(AccessRight.builder()
                .description("Access to everything")
                .build());

        UUID roleId = UUID.fromString(withAdminAuth()
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

    }

    @Test
    public void testModifyRole() {
        AccessRight accessRight = accessRightRepository.save(
                AccessRight.builder()
                        .code("nothing")
                        .description("Access to nothing")
                        .build());

        AccessRight adminAccessRight = accessRightRepository.findAccessRightByCode("role_modification").get();

        UUID adminUserRoleId = rolesRepository.findRoleByName("ADMIN").get().getId();

        UUID roleId = UUID.fromString(withAdminAuth()
                .contentType(ContentType.JSON)
                .body(StringTemplate.STR. """
                        {
                            "id" : "\{adminUserRoleId}",
                            "name" : "ADMIN-2",
                            "description" : "Role for a better admin",
                            "accessRights" : ["\{ accessRight.getId() }", "\{adminAccessRight.getId()}"]
                        }
                        """ )
                .when()
                .put("/api/roles")
                .then()
                .statusCode(200)
                .extract()
                .path("id"));

        assertThat(rolesRepository.findRoleById(roleId)).isPresent();
        assertThat(rolesRepository.findRoleById(roleId).get().getName()).isEqualTo("ADMIN-2");
        assertThat(rolesRepository.findRoleById(roleId).get().getDescription()).isEqualTo("Role for a better admin");
        assertThat(rolesRepository.findRoleById(roleId).get().getAccessRights().size()).isEqualTo(2);
        assertThat(rolesRepository.findRoleByName("ADMIN")).isEmpty();
    }

    @Test
    public void testDeleteRole() {
        AccessRight accessRight = accessRightRepository.save(
                AccessRight.builder()
                        .code("should_not_delete")
                        .description("Access to nothing")
                        .build());

        Role role = Role.builder()
                .name("DELETED")
                .accessRights(Arrays.asList(accessRight))
                .description("Role to be deleted")
                .build();

        UUID deletedRoleID = rolesRepository.save(role).getId();

      withAdminAuth()
                .when()
                .delete("/api/roles/" + deletedRoleID)
                .then()
                .statusCode(200);

        assertThat(rolesRepository.findRoleById(deletedRoleID)).isEmpty();
        assertThat(accessRightRepository.findAccessRightById(accessRight.getId())).isPresent();
    }


}
