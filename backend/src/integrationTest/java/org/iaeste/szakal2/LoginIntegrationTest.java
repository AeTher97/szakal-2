package org.iaeste.szakal2;


import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.ValidatableResponse;
import org.hamcrest.Matchers;
import org.iaeste.szakal2.util.IntegrationTestWithTools;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;


public class LoginIntegrationTest extends IntegrationTestWithTools {

    @AfterEach
    public void truncateUserService() {
        integrationTestDatabase.getUsersRepository().deleteAll();
    }

    @Test
    public void loginsCorrectly() {
        integrationTestDatabase.createUser("test-login@gmail.com",
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
        integrationTestDatabase.createUser("test-failed-login@gmail.com",
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
        integrationTestDatabase.createUser("test-login@gmail.com",
                "testLogin",
                "Password123!",
                List.of());
        ValidatableResponse response = RestAssured.given()
                .contentType(ContentType.MULTIPART)
                .multiPart("username", "test-login@gmail.com")
                .multiPart("password", "Password123!")
                .when()
                .post("/api/login")
                .then()
                .statusCode(200);

        String sessionCookie = response.extract().cookie("SESSION_COOKIE");
        String refreshCookie = response.extract().cookie("JWT_REFRESH");

        RestAssured.given()
                .cookies(Map.of("SESSION_COOKIE", sessionCookie, "JWT_REFRESH", refreshCookie))
                .post("/api/refresh")
                .then()
                .statusCode(200)
                .body("accessToken", Matchers.not(Matchers.emptyString()));
    }

}
