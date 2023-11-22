package org.iaeste.szakal2;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.assertj.core.api.AssertionsForClassTypes;
import org.hamcrest.Matchers;
import org.iaeste.szakal2.models.dto.user.UserCreationDTO;
import org.iaeste.szakal2.models.entities.User;
import org.iaeste.szakal2.services.UserService;
import org.iaeste.szakal2.util.IntegrationTestWithTools;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

public class RegistrationIntegrationTest extends IntegrationTestWithTools {

    @Autowired
    UserService userService;

    @Test
    public void userRegistersWithCorrectRequest() {
        UUID userId = UUID.fromString(RestAssured.given()
                .contentType(ContentType.JSON)
                .body(StringTemplate.STR."""
                            {
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
        assertDoesNotThrow(() -> userService.getUserById(userId));
        User user = userService.getUserById(userId);
        AssertionsForClassTypes.assertThat(user.getName()).isEqualTo("Michal");
        AssertionsForClassTypes.assertThat(user.getSurname()).isEqualTo("Wozniak");
        AssertionsForClassTypes.assertThat(user.getCreatedAt()).isNotNull();
        AssertionsForClassTypes.assertThat(user.getEmail()).isEqualTo("emtail@gmail.com");
        AssertionsForClassTypes.assertThat(user.isAccepted()).isFalse();
        AssertionsForClassTypes.assertThat(user.isActive()).isFalse();
    }

    @Test
    public void failsToRegisterWithWeakPassword() {

        RestAssured.given()
                .contentType(ContentType.JSON)
                .body(StringTemplate.STR."""
                            {
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

        RestAssured.given()
                .contentType(ContentType.JSON)
                .body(StringTemplate.STR."""
                            {
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
    public void failsToRegisterIfEmailTaken() {
        userService.registerUser(UserCreationDTO.builder()
                .email("taken-email@gmail.com")
                .password("Password123!")
                .repeatPassword("Password123!")
                .name("Name")
                .surname("Surname")
                .build());
        RestAssured.given()
                .contentType(ContentType.JSON)
                .body(StringTemplate.STR."""
                            {
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
                .body("error", Matchers.equalTo("Email already taken"));
    }

}
