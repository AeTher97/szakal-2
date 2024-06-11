package org.iaeste.szakal2.util;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.http.Header;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Arrays;
import java.util.List;

public abstract class IntegrationTestWithTools extends IntegrationTest {

    @Autowired
    protected IntegrationTestDatabase integrationTestDatabase;

    @BeforeEach
    public void cleanUpBefore() {
        cleanUp();
    }

    @AfterEach
    public void CleanUpAfter() {
        cleanUp();
    }

    protected void cleanUp() {
        integrationTestDatabase.getCommentRepository().truncate();
        integrationTestDatabase.getJourneyRepository().deleteAll();
        integrationTestDatabase.getCompanyRepository().deleteAll();
        integrationTestDatabase.getUsersRepository().deleteAll();
        integrationTestDatabase.getCampaignRepository().deleteAll();
        integrationTestDatabase.getRolesRepository().deleteAll();
        integrationTestDatabase.getAccessRightRepository().deleteAll();
        integrationTestDatabase.getCategoryRepository().deleteAll();
    }

    protected io.restassured.specification.RequestSpecification withAdminAuth() {
        integrationTestDatabase.createUser("administrator@szakal.org",
                "administrator",
                "administrator",
                List.of("role_modification"));
        String authToken = getToken("administrator@szakal.org", "administrator");
        return RestAssured.given()
                .header(new Header("Authorization", "Bearer " + authToken));
    }

    protected io.restassured.specification.RequestSpecification withAccessRights(String... accessRights) {
        integrationTestDatabase.createUser("test_user@szakal.org",
                "test_user",
                "password",
                Arrays.stream(accessRights).toList());

        String authToken = getToken("test_user@szakal.org", "password");
        return RestAssured.given()
                .header(new Header("Authorization", "Bearer " + authToken));
    }

    protected String getToken(String email, String password) {
        return RestAssured.given()
                .contentType(ContentType.MULTIPART)
                .multiPart("username", email)
                .multiPart("password", password)
                .when()
                .post("/api/login")
                .then()
                .statusCode(200)
                .extract()
                .path("authToken");
    }





}
