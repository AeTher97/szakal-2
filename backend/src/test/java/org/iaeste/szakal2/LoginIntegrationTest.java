package org.iaeste.szakal2;


import io.restassured.http.ContentType;
import org.iaeste.szakal2.models.dto.user.UserCreationDTO;
import org.iaeste.szakal2.services.UserService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.emptyString;
import static org.hamcrest.Matchers.not;

public class LoginIntegrationTest extends IntegrationTestBase {


    @Autowired
    UserService userService;

    @AfterEach
    public void truncateUserService() {
        userService.truncate();
    }

    @Test
    public void loginsCorrectly() {
        userService.registerUser(UserCreationDTO.builder()
                .email("test-login@gmail.com")
                .password("Password123!")
                .repeatPassword("Password123!")
                .username("testLogin")
                .build());
        given()
                .contentType(ContentType.MULTIPART)
                .multiPart("username", "test-login@gmail.com")
                .multiPart("password", "Password123!")
                .when()
                .post("/api/login")
                .then()
                .statusCode(200)
                .body("authToken", not(emptyString()))
                .body("refreshToken", not(emptyString()));
    }

    @Test
    public void failsToLoginWithWrongPassword() {
        userService.registerUser(UserCreationDTO.builder()
                .email("test-failed-login@gmail.com")
                .password("Password123!")
                .repeatPassword("Password123!")
                .username("testFailedLogin")
                .build());
        given()
                .contentType(ContentType.MULTIPART)
                .multiPart("username", "test-failed-login@gmail.com")
                .multiPart("password", "Password1")
                .when()
                .post("/api/login")
                .then()
                .statusCode(401);
    }

    @Test
    public void refreshesCorrectly() {
        userService.registerUser(UserCreationDTO.builder()
                .email("test-login@gmail.com")
                .password("Password123!")
                .repeatPassword("Password123!")
                .username("testLogin")
                .build());
        String refreshToken = given()
                .contentType(ContentType.MULTIPART)
                .multiPart("username", "test-login@gmail.com")
                .multiPart("password", "Password123!")
                .when()
                .post("/api/login")
                .then()
                .statusCode(200)
                .extract()
                .path("refreshToken");

        given().contentType(ContentType.MULTIPART)
                .multiPart("refreshToken", refreshToken)
                .when()
                .post("/api/refresh")
                .then()
                .statusCode(200)
                .body("accessToken", not(emptyString()));
    }

}
