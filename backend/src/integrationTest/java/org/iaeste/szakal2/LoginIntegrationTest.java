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

    public static final String EMAIL_TEST_LOGIN = "test-login@gmail.com";
    public static final String PASSWORD_123 = "Password123!";
    private static final String URL = "/api/login";
    private static final String USERNAME = "username";
    private static final String PASSWORD = "password";

    @AfterEach
    public void truncateUserService() {
        integrationTestDatabase.getUsersRepository().deleteAll();
    }

    @Test
    public void loginsCorrectly() {
        integrationTestDatabase.createUser(EMAIL_TEST_LOGIN,
                "testLogin",
                PASSWORD_123,
                List.of());
        RestAssured.given()
                .contentType(ContentType.MULTIPART)
                .multiPart(USERNAME, EMAIL_TEST_LOGIN)
                .multiPart(PASSWORD, PASSWORD_123)
                .when()
                .post(URL)
                .then()
                .statusCode(200)
                .body("authToken", Matchers.not(Matchers.emptyString()))
                .body("refreshToken", Matchers.not(Matchers.emptyString()));
    }

    @Test
    public void failsToLoginWithWrongPassword() {
        integrationTestDatabase.createUser("test-failed-login@gmail.com",
                "testFailedLogin",
                PASSWORD_123,
                List.of());
        RestAssured.given()
                .contentType(ContentType.MULTIPART)
                .multiPart(USERNAME, "test-failed-login@gmail.com")
                .multiPart(PASSWORD, "Password1")
                .when()
                .post(URL)
                .then()
                .statusCode(401);
    }

    @Test
    public void refreshesCorrectly() {
        integrationTestDatabase.createUser(EMAIL_TEST_LOGIN,
                "testLogin",
                PASSWORD_123,
                List.of());
        ValidatableResponse response = RestAssured.given()
                .contentType(ContentType.MULTIPART)
                .multiPart(USERNAME, EMAIL_TEST_LOGIN)
                .multiPart(PASSWORD, PASSWORD_123)
                .when()
                .post(URL)
                .then()
                .statusCode(200);

        String refreshCookie = response.extract().cookie("JWT_REFRESH");

        RestAssured.given()
                .cookies(Map.of("JWT_REFRESH", refreshCookie))
                .post("/api/refresh")
                .then()
                .statusCode(200)
                .body("accessToken", Matchers.not(Matchers.emptyString()));
    }

}
