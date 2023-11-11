package org.iaeste.szakal2;

import io.restassured.http.ContentType;
import org.iaeste.szakal2.models.entities.User;
import org.iaeste.szakal2.models.dto.user.UserCreationDTO;
import org.iaeste.szakal2.services.UserService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.DirtiesContext;

import java.util.UUID;

import static io.restassured.RestAssured.given;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.hamcrest.Matchers.equalTo;

@DirtiesContext
public class RegistrationIntegrationTest extends IntegrationTestBase {

    @Autowired
    UserService userService;

    @AfterEach
    public void truncateUserService() {
        userService.truncate();
    }

    @Test
    public void userRegistersWithCorrectRequest() {
        UUID userId = UUID.fromString(given()
                .contentType(ContentType.JSON)
                .body(STR."""
                            {
                            "username": "AeTher",
                            "email" : "emtail@gmail.com",
                            "password" :"Test123!",
                            "repeatPassword": "Test123!",
                            "name" : "Michal",
                            "surname" : "Wozniak"
                            }
                        """)
                .when()
                .post("/api/users")
                .then()
                .statusCode(200)
                .extract()
                .path("id"));
        assertThat(userService.getUserById(userId)).isPresent();
        User user = userService.getUserById(userId).get();
        assertThat(user.getUsername()).isEqualTo("AeTher");
        assertThat(user.getName()).isEqualTo("Michal");
        assertThat(user.getSurname()).isEqualTo("Wozniak");
        assertThat(user.getCreatedAt()).isNotNull();
        assertThat(user.getEmail()).isEqualTo("emtail@gmail.com");
        assertThat(user.isAccepted()).isFalse();
        assertThat(user.isActive()).isFalse();
    }

    @Test
    public void failsToRegisterWithWeakPassword() {

        given()
                .contentType(ContentType.JSON)
                .body(STR."""
                            {
                            "username": "TakenUsername",
                            "email" : "not-taken-email@gmail.com",
                            "password" :"weak",
                            "repeatPassword": "weak",
                            "name" : "Michal",
                            "surname" : "Wozniak"
                            }
                        """)
                .when()
                .post("/api/users")
                .then()
                .statusCode(400);
    }

    @Test
    public void failsToRegisterWithNotMatchingPasswords() {

        given()
                .contentType(ContentType.JSON)
                .body(STR."""
                            {
                            "username": "TakenUsername",
                            "email" : "not-taken-email@gmail.com",
                            "password" :"Password123!",
                            "repeatPassword": "Password13!",
                            "name" : "Michal",
                            "surname" : "Wozniak"
                            }
                        """)
                .when()
                .post("/api/users")
                .then()
                .statusCode(400);
    }


    @Test
    public void failsToRegisterIfUsernameTaken() {
        userService.registerUser(UserCreationDTO.builder()
                .email("taken-email@gmail.com")
                .password("Password123!")
                .repeatPassword("Password123!")
                .username("TakenUsername")
                .build());
        given()
                .contentType(ContentType.JSON)
                .body(STR."""
                            {
                            "username": "TakenUsername",
                            "email" : "not-taken-email@gmail.com",
                            "password" :"Test123!",
                            "repeatPassword": "Test123!",
                            "name" : "Michal",
                            "surname" : "Wozniak"
                            }
                        """)
                .when()
                .post("/api/users")
                .then()
                .statusCode(400)
                .body("error", equalTo("Username already taken"));
    }

    @Test
    public void failsToRegisterIfEmailTaken() {
        userService.registerUser(UserCreationDTO.builder()
                .email("taken-email@gmail.com")
                .password("Password123!")
                .repeatPassword("Password123!")
                .username("TakenUsername")
                .build());
        given()
                .contentType(ContentType.JSON)
                .body(STR."""
                            {
                            "username": "NotTakenUsername",
                            "email" : "taken-email@gmail.com",
                            "password" :"Test123!",
                            "repeatPassword": "Test123!",
                            "name" : "Michal",
                            "surname" : "Wozniak"
                            }
                        """)
                .when()
                .post("/api/users")
                .then()
                .statusCode(400)
                .body("error", equalTo("Email already taken"));
    }

}
