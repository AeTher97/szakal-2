package org.iaeste.szakal2;


import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.hamcrest.Matchers;
import org.iaeste.szakal2.util.IntegrationTestWithTools;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

import java.util.List;


public class LoginIntegrationTest extends IntegrationTestWithTools {

    @AfterEach
    public void truncateUserService() {
        userService.truncate();
    }

    @Test
    public void loginsCorrectly() {
        createUser("test-login@gmail.com",
                "testLogin",
                "Password123!",
                List.of());
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
        createUser("test-failed-login@gmail.com",
                "testFailedLogin",
                "Password123!",
                List.of());
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
        createUser("test-login@gmail.com",
                "testLogin",
                "Password123!",
                List.of());
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
