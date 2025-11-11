package org.iaeste.szakal2.util;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.http.Header;
import io.restassured.response.ValidatableResponse;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

public abstract class IntegrationTestWithTools extends IntegrationTest {

    private static final String ADMINISTRATOR = "administrator";
    private static final String PASSWORD = "password";
    private static final String FGP_COOKIE = "FGP_COOKIE";

    @Autowired
    protected IntegrationTestDatabase integrationTestDatabase;

    @BeforeEach
    public void cleanUpBefore() {
        cleanUp();
    }

    @AfterEach
    public void cleanUpAfter() {
        cleanUp();
    }

    protected void cleanUp() {
        integrationTestDatabase.getCommentRepository().truncate();
        integrationTestDatabase.getJourneyRepository().deleteAll();
        integrationTestDatabase.getCompanyRepository().deleteAll();
        integrationTestDatabase.getRegisterTokenRepository().deleteAll();
        integrationTestDatabase.getPasswordTokenRepository().deleteAll();
        integrationTestDatabase.getUsersRepository().deleteAll();
        integrationTestDatabase.getCampaignRepository().deleteAll();
        integrationTestDatabase.getRolesRepository().deleteAll();
        integrationTestDatabase.getAccessRightRepository().deleteAll();
        integrationTestDatabase.getCategoryRepository().deleteAll();
    }

    protected io.restassured.specification.RequestSpecification withAdminAuth() {
        integrationTestDatabase.createUser("administrator@szakal.org",
                ADMINISTRATOR,
                ADMINISTRATOR,
                List.of("role_modification"));
        ValidatableResponse response = requestToken("administrator@szakal.org", ADMINISTRATOR);
        String authToken = getToken(response);
        String fgpCookie = getCookie(response);
        return RestAssured.given()
                .cookies(Map.of(FGP_COOKIE, fgpCookie))
                .header(new Header("Authorization", "Bearer " + authToken));
    }

    protected io.restassured.specification.RequestSpecification withAccessRights(String... accessRights) {
        integrationTestDatabase.createUser("test_user@szakal.org",
                "test_user",
                PASSWORD,
                Arrays.stream(accessRights).toList());

        ValidatableResponse response = requestToken("test_user@szakal.org", PASSWORD);
        String authToken = getToken(response);
        String fgpCookie = getCookie(response);
        return RestAssured.given()
                .cookies(Map.of(FGP_COOKIE, fgpCookie))
                .header(new Header("Authorization", "Bearer " + authToken));
    }

    private String getToken(ValidatableResponse response) {
        return response
                .extract()
                .path("authToken");
    }

    private String getCookie(ValidatableResponse response) {
        return response
                .extract()
                .cookie(FGP_COOKIE);
    }

    private ValidatableResponse requestToken(String email, String password) {
        return RestAssured.given()
                .contentType(ContentType.MULTIPART)
                .multiPart("username", email)
                .multiPart(PASSWORD, password)
                .when()
                .post("/api/login")
                .then()
                .statusCode(200);
    }
}
