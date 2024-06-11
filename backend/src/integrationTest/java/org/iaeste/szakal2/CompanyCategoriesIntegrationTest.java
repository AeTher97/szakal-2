package org.iaeste.szakal2;

import io.restassured.http.ContentType;
import org.iaeste.szakal2.repositories.CategoryRepository;
import org.iaeste.szakal2.util.IntegrationTestWithTools;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.UUID;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

public class CompanyCategoriesIntegrationTest extends IntegrationTestWithTools {

    @Autowired
    private CategoryRepository categoryRepository;

    @Test
    public void testCreatingCategory() {
        withAccessRights("category_modification")
                .contentType(ContentType.JSON)
                .body(STR."""
                        {
                            "name" : "Gardening"
                        }
                        """)
                .when()
                .post("api/categories")
                .then()
                .statusCode(200);
    }

    @Test
    public void testCreatingCategoryWithTheSameNameIsImpossible() {
        withAccessRights("category_modification")
                .contentType(ContentType.JSON)
                .body(STR."""
                        {
                            "name" : "Gardening"
                        }
                        """)
                .when()
                .post("api/categories")
                .then()
                .statusCode(200);

        withAccessRights("category_modification")
                .contentType(ContentType.JSON)
                .body(STR."""
                        {
                            "name" : "Gardening"
                        }
                        """)
                .when()
                .post("api/categories")
                .then()
                .statusCode(409);
    }

    @Test
    public void testModifyingCategory() {
        UUID id = UUID.fromString(withAccessRights("category_modification")
                .contentType(ContentType.JSON)
                .body(STR."""
                        {
                            "name" : "Gardening"
                        }
                        """)
                .when()
                .post("api/categories")
                .then()
                .statusCode(200)
                .extract().
                path("id"));

        withAccessRights("category_modification")
                .contentType(ContentType.JSON)
                .body(STR."""
                        {
                            "name" : "Better gardening"
                        }
                        """)
                .when()
                .put("api/categories/ " + id)
                .then()
                .statusCode(200);

        assertThat(categoryRepository.findAll().size()).isEqualTo(1);
        assertThat(categoryRepository.findCompanyCategoryById(id).get().getName())
                .isEqualTo("Better gardening");
    }

    @Test
    public void testDeletingCategoryWithoutAnyCompanyBound() {
        UUID id = UUID.fromString(withAccessRights("category_modification")
                .contentType(ContentType.JSON)
                .body(STR."""
                        {
                            "name" : "Gardening"
                        }
                        """)
                .when()
                .post("api/categories")
                .then()
                .statusCode(200)
                .extract().
                path("id"));

        withAccessRights("category_modification")
                .when()
                .delete("api/categories/ " + id)
                .then()
                .statusCode(200);

        assertThat(categoryRepository.findAll().size()).isEqualTo(0);
    }

    @Test
    public void testDeletingCategoryWithCompanyBoundFails() {
        UUID id = UUID.fromString(withAccessRights("category_modification", "company_modification")
                .contentType(ContentType.JSON)
                .body(STR."""
                        {
                            "name" : "Gardening"
                        }
                        """)
                .when()
                .post("api/categories")
                .then()
                .statusCode(200)
                .extract().
                path("id"));
        withAccessRights("category_modification", "company_modification")
                .contentType(ContentType.JSON)
                .body(STR. """
                        {
                            "name" : "IAESTE",
                            "address" : {
                                "street" : "Reymonta",
                                "city" : "Krakow",
                                "postalCode": "30-123"
                            },
                            "phone" : "+481235543543",
                            "fax" : "+4843243242",
                            "www" : "iaeste.pl",
                            "email": "company@email.com",
                            "categories" : ["\{ id }"]
                        }
                        """ )
                .when()
                .post("/api/companies")
                .then()
                .statusCode(200);


        withAccessRights("category_modification")
                .when()
                .delete("api/categories/ " + id)
                .then()
                .statusCode(409);

        assertThat(categoryRepository.findAll().size()).isEqualTo(1);
    }

}
