package org.iaeste.szakal2;

import io.restassured.http.ContentType;
import org.iaeste.szakal2.models.entities.Campaign;
import org.iaeste.szakal2.models.entities.Company;
import org.iaeste.szakal2.models.entities.ContactJourney;
import org.iaeste.szakal2.models.entities.User;
import org.iaeste.szakal2.repositories.ContactJourneyRepository;
import org.iaeste.szakal2.util.IntegrationTestWithTools;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.iaeste.szakal2.models.entities.ContactStatus.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class ContactJourneyIntegrationTest extends IntegrationTestWithTools {

    @Autowired
    private ContactJourneyRepository contactJourneyRepository;

    @Test
    public void testCreatingContactJourney() {
        Company company = integrationTestDatabase.createCompany("IAESTE");
        User user = integrationTestDatabase.createUser("test_user@szakal.org", "company-creator", "password",
                List.of("company_modification"));
        Campaign campaign = integrationTestDatabase.createCampaign("PPP2023", LocalDate.now());

        UUID journeyId = UUID.fromString(withAccessRights("journey_creation")
                .contentType(ContentType.JSON)
                .body(STR. """
                        {
                        "user" : "\{ user.getId() }",
                        "company" : "\{ company.getId() }",
                        "campaign" : "\{ campaign.getId() }"
                        }
                        """ )
                .that()
                .post("/api/journeys")
                .then()
                .statusCode(200)
                .extract()
                .path("id"));

        assertEquals(user.getId(), integrationTestDatabase.getContactJourney(journeyId).getUser().getId());
        assertEquals(campaign.getId(), integrationTestDatabase.getContactJourney(journeyId).getCampaign().getId());
        assertEquals(company.getId(), integrationTestDatabase.getContactJourney(journeyId).getCompany().getId());
        assertEquals(ASSIGNED, integrationTestDatabase.getContactJourney(journeyId).getContactStatus());
    }

    @Test
    public void testUpdatingJourneyStatus() {
        Company company = integrationTestDatabase.createCompany("IAESTE");
        User user = integrationTestDatabase.createUser("test_user@szakal.org", "company-creator", "password",
                List.of("company_modification"));
        Campaign campaign = integrationTestDatabase.createCampaign("PPP2023", LocalDate.now());

        UUID journeyId = UUID.fromString(withAccessRights("journey_creation")
                .contentType(ContentType.JSON)
                .body(STR. """
                        {
                        "user" : "\{ user.getId() }",
                        "company" : "\{ company.getId() }",
                        "campaign" : "\{ campaign.getId() }"
                        }
                        """ )
                .that()
                .post("/api/journeys")
                .then()
                .statusCode(200)
                .extract()
                .path("id"));

        withAccessRights("journey_modification")
                .contentType(ContentType.JSON)
                .body(STR."""
                        {
                        "contactStatus" : "CALL_LATER"
                        }
                        """)
                .that()
                .put("/api/journeys/" + journeyId + "/status")
                .then()
                .statusCode(200);

        assertEquals(user.getId(), integrationTestDatabase.getContactJourney(journeyId).getUser().getId());
        assertEquals(campaign.getId(), integrationTestDatabase.getContactJourney(journeyId).getCampaign().getId());
        assertEquals(company.getId(), integrationTestDatabase.getContactJourney(journeyId).getCompany().getId());
        assertEquals(CALL_LATER, integrationTestDatabase.getContactJourney(journeyId).getContactStatus());
    }

    @Test
    public void testCantAddTwoJourneysForTheSameCampaignAndCompany() {
        ContactJourney contactJourney = integrationTestDatabase.createContactJourney();

        withAccessRights("journey_creation")
                .contentType(ContentType.JSON)
                .body(STR. """
                        {
                        "user" : "\{ contactJourney.getUser().getId() }",
                        "company" : "\{ contactJourney.getCompany().getId() }",
                        "campaign" : "\{ contactJourney.getCampaign().getId() }"
                        }
                        """ )
                .that()
                .post("/api/journeys")
                .then()
                .statusCode(409);
    }

    @Test
    public void testAddContactJourneyComment() {
        ContactJourney contactJourney = integrationTestDatabase.createContactJourney();

        withAccessRights("journey_modification")
                .contentType(ContentType.JSON)
                .body(STR."""
                        {
                              "comment" : "Nie idzie za dobrze",
                              "user" : "\{ contactJourney.getUser().getId().toString() }"
                        }
                        """)
                .when()
                .post("/api/journeys/" + contactJourney.getId() + "/comments")
                .then().statusCode(200);

        ContactJourney contactJourney1 = integrationTestDatabase.getContactJourney(contactJourney.getId());
        assertEquals(1, contactJourney1.getComments().size());
        assertEquals("Nie idzie za dobrze", contactJourney1.getComments().get(0).getComment());
        contactJourneyRepository.deleteById(contactJourney1.getId());
        contactJourneyRepository.flush();

    }

    @Test
    public void testAddContactJourneyEvent() {
        ContactJourney contactJourney = integrationTestDatabase.createContactJourney();

        withAccessRights("journey_creation")
                .contentType(ContentType.JSON)
                .body(STR. """
                        {
                              "contactPerson" : "\{ contactJourney.getCompany().getContactPeople().get(0).getId() }",
                              "user" : "\{ contactJourney.getUser().getId() }",
                              "contactJourney" : "\{ contactJourney.getId() }",
                              "description" : "Tried calling",
                              "contactStatus" : "NOT_INTERESTED"
                        }
                        """ )
                .when()
                .post("/api/journeys/" + contactJourney.getId() + "/events")
                .then().statusCode(200);

        ContactJourney contactJourney1 = integrationTestDatabase.getContactJourney(contactJourney.getId());
        assertEquals(1, contactJourney1.getContactEvents().size());
        assertEquals("Tried calling", contactJourney1.getContactEvents().get(0).getDescription());
        assertEquals(NOT_INTERESTED, contactJourney1.getContactEvents().get(0).getEventType());
    }
}
