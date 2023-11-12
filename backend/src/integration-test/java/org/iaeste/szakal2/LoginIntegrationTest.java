package org.iaeste.szakal2;


import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.hamcrest.Matchers;
import org.iaeste.szakal2.models.dto.user.UserCreationDTO;
import org.iaeste.szakal2.services.UserService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;


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
        RestAssured.given()
                .contentType(ContentType.MULTIPART)
                .multiPart("username", "test-login@gmail.com")
                .multiPart("password", "Password123!")
                .when()
                .post("/api/login")
                .then()
                .statusCode(200)
                .body("authToken", Matchers.not(Matchers.emptyString()))
                .body("refreshToken", Matchers.not(Matchers.emptyString()));
    }

    @Test
    public void failsToLoginWithWrongPassword() {
        userService.registerUser(UserCreationDTO.builder()
                .email("test-failed-login@gmail.com")
                .password("Password123!")
                .repeatPassword("Password123!")
                .username("testFailedLogin")
                .build());
        RestAssured.given()
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
        String refreshToken = RestAssured.given()
                .contentType(ContentType.MULTIPART)
                .multiPart("username", "test-login@gmail.com")
                .multiPart("password", "Password123!")
                .when()
                .post("/api/login")
                .then()
                .statusCode(200)
                .extract()
                .path("refreshToken");

        RestAssured.given().contentType(ContentType.MULTIPART)
                .multiPart("refreshToken", refreshToken)
                .when()
                .post("/api/refresh")
                .then()
                .statusCode(200)
                .body("accessToken", Matchers.not(Matchers.emptyString()));
    }

}
