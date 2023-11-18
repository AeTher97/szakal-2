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
    protected IntegrationTestDatabaseApi integrationTestDatabaseApi;

    @BeforeEach
    public void cleanUpBefore() {
        cleanUp();
    }

    @AfterEach
    public void CleanUpAfter() {
        cleanUp();
    }

    protected void cleanUp() {
        integrationTestDatabaseApi.getCommentRepository().truncate();
        integrationTestDatabaseApi.getJourneyRepository().deleteAll();
        integrationTestDatabaseApi.getCompanyRepository().deleteAll();
        integrationTestDatabaseApi.getUsersRepository().deleteAll();
        integrationTestDatabaseApi.getCampaignRepository().deleteAll();
        integrationTestDatabaseApi.getRolesRepository().deleteAll();
        integrationTestDatabaseApi.getAccessRightRepository().deleteAll();
        integrationTestDatabaseApi.getCategoryRepository().deleteAll();
    }

    protected io.restassured.specification.RequestSpecification withAdminAuth() {
        integrationTestDatabaseApi.createUser("administrator@szakal.org",
                "administrator",
                "administrator",
                List.of("role_modification"));
        String authToken = getToken("administrator@szakal.org", "administrator");
        return RestAssured.given()
                .header(new Header("Authorization", "Bearer " + authToken));
    }

    protected io.restassured.specification.RequestSpecification withAccessRights(String... accessRights) {
        integrationTestDatabaseApi.createUser("test_user@szakal.org",
                "test_user",
                "test_user",
                Arrays.stream(accessRights).toList());

        String authToken = getToken("test_user@szakal.org", "test_user");
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
