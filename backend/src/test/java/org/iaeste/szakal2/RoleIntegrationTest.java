package org.iaeste.szakal2;

import io.restassured.http.ContentType;
import org.iaeste.szakal2.models.AccessRight;
import org.iaeste.szakal2.repositories.AccessRightRepository;
import org.iaeste.szakal2.repositories.RolesRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.UUID;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

public class RoleIntegrationTest extends IntegrationTestBase {

    @Autowired
    private RolesRepository rolesRepository;

    @Autowired
    private AccessRightRepository accessRightRepository;

    @Test
    public void addRole() {
        AccessRight accessRight = accessRightRepository.save(AccessRight.builder()
                .description("Access to everything")
                .build());

        UUID roleId = UUID.fromString(withAdminAuth()
                .contentType(ContentType.JSON)
                .body(STR. """
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


}
