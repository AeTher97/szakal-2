package org.iaeste.szakal2;

import io.restassured.http.ContentType;
import org.iaeste.szakal2.models.entities.Company;
import org.iaeste.szakal2.repositories.CategoryRepository;
import org.iaeste.szakal2.repositories.CompanyRepository;
import org.iaeste.szakal2.util.IntegrationTestWithTools;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.UUID;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class CompanyIntegrationTest extends IntegrationTestWithTools {

    @Autowired
    private CompanyRepository companyRepository;
    @Autowired
    private CategoryRepository categoryRepository;

    @Test
    public void testCreateCompany() {
        UUID categoryId = createCategory("Gardening").getId();

        String companyId = withAccessRights("company_modification")
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
                            "categories" : ["\{ categoryId }"]
                        }
                        """ )
                .when()
                .post("/api/companies")
                .then()
                .statusCode(200)
                .extract()
                .path("id");
        UUID companyUUID = UUID.fromString(companyId);
        Company company = companyRepository.findCompanyById(companyUUID).get();
        assertThat(company.getName()).isEqualTo("IAESTE");
        assertThat(company.getAddress().getCity()).isEqualTo("Krakow");
        assertThat(company.getAddress().getStreet()).isEqualTo("Reymonta");
        assertThat(company.getAddress().getPostalCode()).isEqualTo("30-123");
        assertThat(company.getPhone()).isEqualTo("+481235543543");
        assertThat(company.getFax()).isEqualTo("+4843243242");
        assertThat(company.getWww()).isEqualTo("iaeste.pl");
        assertThat(company.getEmail()).isEqualTo("company@email.com");
        assertThat(company.getCategories().size()).isEqualTo(1);
        assertThat(company.getCategories().get(0).getName()).isEqualTo("Gardening");
    }

    @Test
    public void testUpdateCompany() {
        UUID categoryId = createCategory("Gardening").getId();

        String companyId = withAccessRights("company_modification")
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
                            "categories" : ["\{ categoryId }"]
                        }
                        """ )
                .when()
                .post("/api/companies")
                .then()
                .statusCode(200)
                .extract()
                .path("id");

        UUID companyUUID = UUID.fromString(companyId);
        UUID categoryId2 = createCategory("Gardening2").getId();


        withAccessRights("company_modification")
                .contentType(ContentType.JSON)
                .body(STR. """
                        {
                            "name" : "IAESTE2",
                            "address" : {
                                "street" : "Reymonta2",
                                "city" : "Krakow2",
                                "postalCode": "30-1234"
                            },
                            "phone" : "+69",
                            "fax" : "+420",
                            "www" : "best.pl",
                            "email": "best@email.com",
                            "categories" : ["\{ categoryId }", "\{ categoryId2 }"]
                        }
                        """ )
                .when()
                .put("/api/companies/" + companyId)
                .then()
                .statusCode(200);

        Company company = companyRepository.findCompanyById(companyUUID).get();

        assertEquals("IAESTE2", company.getName());
        assertEquals("Krakow2", company.getAddress().getCity());
        assertEquals("Reymonta2", company.getAddress().getStreet());
        assertEquals("30-1234", company.getAddress().getPostalCode());
        assertEquals("+69", company.getPhone());
        assertEquals("+420", company.getFax());
        assertEquals("best.pl", company.getWww());
        assertEquals("best@email.com", company.getEmail());
        assertEquals(2, company.getCategories().size());
    }

    @Test
    public void testAddContactPerson() {
        Company company = createCompany("IAESTE", false);

        withAccessRights("company_modification")
                .contentType(ContentType.JSON)
                .body(STR."""
                        {
                            "name" : "Asia Kowalska",
                            "position" : "HR admin",
                            "phone" : "+481239321",
                            "comment" : "HRy...",
                            "email": "asia@firma.com"
                        }
                        """)
                .when()
                .put("/api/companies/" + company.getId() + "/contactPerson")
                .then()
                .statusCode(200);

        withAccessRights("company_modification")
                .contentType(ContentType.JSON)
                .body(STR."""
                        {
                            "name" : "Kowlaksa Asia",
                            "position" : "CEO",
                            "phone" : "+481r4329321",
                            "comment" : "CEO!",
                            "email": "ceo@firma.com"
                        }
                        """)
                .when()
                .put("/api/companies/" + company.getId() + "/contactPerson")
                .then()
                .statusCode(200);

        Company company2 = companyService.getCompanyById(company.getId());

        assertEquals(2, company2.getContactPeople().size());
    }
}
