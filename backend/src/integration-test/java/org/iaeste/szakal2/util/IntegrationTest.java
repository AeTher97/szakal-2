package org.iaeste.szakal2.util;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.http.Header;
import org.iaeste.szakal2.util.SharedPostgresContainer;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.utility.DockerImageName;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.not;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public abstract class IntegrationTest {

    @LocalServerPort
    protected Integer port;

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", sharedPostgresContainer::getJdbcUrl);
        registry.add("spring.datasource.username", sharedPostgresContainer::getUsername);
        registry.add("spring.datasource.password", sharedPostgresContainer::getPassword);
        registry.add("jwt.secret", () -> "kfjhjdskl5409378ugofhu435jothy870pfyu9354uyihgert90jhg9uy9543543334");
    }


    private static PostgreSQLContainer<?> sharedPostgresContainer;

    @BeforeAll
    public static void beforeAll() {
        sharedPostgresContainer = SharedPostgresContainer.getInstance();
    }


    @BeforeEach
    void setUp() {
        RestAssured.baseURI = "http://localhost:" + port;
    }


}
