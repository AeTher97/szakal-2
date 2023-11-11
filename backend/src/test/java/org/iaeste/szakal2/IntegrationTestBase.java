package org.iaeste.szakal2;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.http.Header;
import org.iaeste.szakal2.models.dto.user.UserCreationDTO;
import org.iaeste.szakal2.models.entities.User;
import org.iaeste.szakal2.repositories.RolesRepository;
import org.iaeste.szakal2.repositories.UsersRepository;
import org.iaeste.szakal2.services.UserService;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.utility.DockerImageName;

import java.util.Arrays;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.not;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public abstract class IntegrationTestBase {

    @LocalServerPort
    protected Integer port;

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgreSQLContainer::getJdbcUrl);
        registry.add("spring.datasource.username", postgreSQLContainer::getUsername);
        registry.add("spring.datasource.password", postgreSQLContainer::getPassword);
        registry.add("jwt.secret", () -> "kfjhjdskl5409378ugofhu435jothy870pfyu9354uyihgert90jhg9uy9543543334");
    }


    private static PostgreSQLContainer<?> postgreSQLContainer;

    @BeforeAll
    public static void beforeAll() {
        postgreSQLContainer = new PostgreSQLContainer<>(DockerImageName.parse("postgres").withTag("16.0"));
        postgreSQLContainer.start();
    }


    @BeforeEach
    void setUp() {
        RestAssured.baseURI = "http://localhost:" + port;
    }

    protected io.restassured.specification.RequestSpecification withAdminAuth(){
        String authToken = given()
                .contentType(ContentType.MULTIPART)
                .multiPart("username", "administrator@szakal.org")
                .multiPart("password", "administrator")
                .when()
                .post("/api/login")
                .then()
                .statusCode(200)
                .extract()
                .path("authToken");
        return given()
                .header(new Header("Authorization" , "Bearer " + authToken));
    }
}
