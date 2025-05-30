package org.iaeste.szakal2;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.hamcrest.Matchers;
import org.iaeste.szakal2.models.dto.user.UserDTO;
import org.iaeste.szakal2.models.entities.AccessRight;
import org.iaeste.szakal2.models.entities.Role;
import org.iaeste.szakal2.repositories.AccessRightRepository;
import org.iaeste.szakal2.services.UserService;
import org.iaeste.szakal2.util.IntegrationTestWithTools;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashMap;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;


public class UserIntegrationTest extends IntegrationTestWithTools {

    @Autowired
    private UserService userService;
    @Autowired
    private AccessRightRepository accessRightRepository;

    @Test
    public void testGetUsers() {
        integrationTestDatabase.createUser("administrator@szakal.org", "administrator", "administrator", List.of());
        List<HashMap<String, String>> content = withAccessRights("user_viewing")
                .when()
                .get("/api/users?pageNumber=0")
                .then()
                .statusCode(200)
                .extract()
                .path("content");
        assertThat(content.size()).isEqualTo(2);
    }

    @Test
    public void testGetUser() {
        integrationTestDatabase.createUser("administrator@szakal.org", "administrator", "administrator", List.of());
        UUID userId = userService.getUserByEmail("administrator@szakal.org").getId();
        UserDTO userDTO = withAccessRights("user_viewing")
                .when()
                .get(STR. """
                        /api/users/\{ userId }
                        """ )
                .then()
                .statusCode(200)
                .extract()
                .as(UserDTO.class);
        assertThat(userDTO.getEmail()).isEqualTo("administrator@szakal.org");
        assertThat(userDTO.getId()).isEqualTo(userId);
    }

    @Test
    public void testAddRoleToUser() {
        integrationTestDatabase.createUser("administrator@szakal.org", "administrator", "administrator", List.of());
        UUID userId = userService.getUserByEmail("administrator@szakal.org").getId();
        Role role = integrationTestDatabase.createRole(List.of(accessRightRepository.save(
                AccessRight.builder()
                        .code("user_viewing")
                        .build()
        ).getId()), "VIEWING", "Viewing things");

        assertThat(integrationTestDatabase.getUsersRepository().findUserByEmailIgnoreCase("administrator@szakal.org")
                .get().getRoles().size()).isEqualTo(1);

        UserDTO userDTO = withAccessRights("user_role_granting")
                .contentType(ContentType.JSON)
                .body(STR. """
                        {
                        "roles": ["\{ role.getId() }"]
                        }
                        """ )
                .when()
                .put(STR. """
                        /api/users/\{ userId }/roles
                        """ )
                .then()
                .statusCode(200)
                .extract()
                .as(UserDTO.class);

        assertThat(userDTO.getEmail()).isEqualTo("administrator@szakal.org");
        assertThat(userDTO.getId()).isEqualTo(userId);
        assertThat(integrationTestDatabase.getUsersRepository().findUserByEmailIgnoreCase("administrator@szakal.org")
                .get().getRoles().size()).isEqualTo(1);
        assertThat(integrationTestDatabase.getUsersRepository().findUserByEmailIgnoreCase("administrator@szakal.org")
                .get().getRoles().iterator().next().getName()).isEqualTo("VIEWING");

    }

    @Test
    public void testPasswordChange() {
        integrationTestDatabase.createUser("administrator@szakal.org", "administrator", "administrator", List.of());
        UUID userId = userService.getUserByEmail("administrator@szakal.org").getId();

        withAdminAuth()
                .contentType(ContentType.JSON)
                .body(STR."""
                        {
                        "currentPassword": "administrator",
                        "password" : "newPassword",
                        "repeatPassword" : "newPassword"
                        }
                        """)
                .when()
                .put(STR. """
                        /api/users/\{ userId }/password
                        """ )
                .then()
                .statusCode(200);

        RestAssured.given()
                .contentType(ContentType.MULTIPART)
                .multiPart("username", "administrator@szakal.org")
                .multiPart("password", "newPassword")
                .when()
                .post("/api/login")
                .then()
                .statusCode(200)
                .body("authToken", Matchers.not(Matchers.emptyString()))
                .body("refreshToken", Matchers.not(Matchers.emptyString()));

    }
}
