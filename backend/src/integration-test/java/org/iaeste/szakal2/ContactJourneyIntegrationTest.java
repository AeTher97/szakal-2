package org.iaeste.szakal2;

import io.restassured.http.ContentType;
import org.iaeste.szakal2.models.entities.*;
import org.iaeste.szakal2.repositories.ContactJourneyRepository;
import org.iaeste.szakal2.util.IntegrationTestWithTools;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.iaeste.szakal2.models.entities.ContactStatus.ASSIGNED;
import static org.iaeste.szakal2.models.entities.ContactStatus.IN_PROGRESS;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class ContactJourneyIntegrationTest extends IntegrationTestWithTools {

    @Autowired
    private ContactJourneyRepository contactJourneyRepository;

    @Test
    public void testCreatingContactJourney() {
        Company company = integrationTestDatabaseApi.createCompany("IAESTE");
        User user = integrationTestDatabaseApi.createUser("company-creator@gmail.com", "company-creator", "password",
                List.of("company_modification"));
        Campaign campaign = integrationTestDatabaseApi.createCampaign("PPP2023", LocalDate.now());

        UUID journeyId = UUID.fromString(withAccessRights("journey_modification")
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

        assertEquals(user.getId(), integrationTestDatabaseApi.getContactJourney(journeyId).getUser().getId());
        assertEquals(campaign.getId(), integrationTestDatabaseApi.getContactJourney(journeyId).getCampaign().getId());
        assertEquals(company.getId(), integrationTestDatabaseApi.getContactJourney(journeyId).getCompany().getId());
        assertEquals(ASSIGNED, integrationTestDatabaseApi.getContactJourney(journeyId).getContactStatus());
    }

    @Test
    public void testUpdatingJourneyStatus() {
        Company company = integrationTestDatabaseApi.createCompany("IAESTE");
        User user = integrationTestDatabaseApi.createUser("company-creator@gmail.com", "company-creator", "password",
                List.of("company_modification"));
        Campaign campaign = integrationTestDatabaseApi.createCampaign("PPP2023", LocalDate.now());

        UUID journeyId = UUID.fromString(withAccessRights("journey_modification")
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
                        "contactStatus" : "IN_PROGRESS"
                        }
                        """)
                .that()
                .put("/api/journeys/" + journeyId + "/status")
                .then()
                .statusCode(200);

        assertEquals(user.getId(), integrationTestDatabaseApi.getContactJourney(journeyId).getUser().getId());
        assertEquals(campaign.getId(), integrationTestDatabaseApi.getContactJourney(journeyId).getCampaign().getId());
        assertEquals(company.getId(), integrationTestDatabaseApi.getContactJourney(journeyId).getCompany().getId());
        assertEquals(IN_PROGRESS, integrationTestDatabaseApi.getContactJourney(journeyId).getContactStatus());
    }

    @Test
    public void testCantAddTwoJourneysForTheSameCampaignAndCompany() {
        ContactJourney contactJourney = integrationTestDatabaseApi.createContactJourney();

        withAccessRights("journey_modification")
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
        ContactJourney contactJourney = integrationTestDatabaseApi.createContactJourney();


        withAccessRights("journey_modification")
                .contentType(ContentType.JSON)
                .body(STR."""
                        {
                              "comment" : "Nie idzie za dobrze"
                        }
                        """)
                .when()
                .post("/api/journeys/" + contactJourney.getId() + "/comments")
                .then().statusCode(200);

        ContactJourney contactJourney1 = integrationTestDatabaseApi.getContactJourney(contactJourney.getId());
        assertEquals(1, contactJourney1.getComments().size());
        assertEquals("Nie idzie za dobrze", contactJourney1.getComments().get(0).getComment());
        contactJourneyRepository.deleteById(contactJourney1.getId());
        contactJourneyRepository.flush();

    }

    @Test
    public void testAddContactJourneyEvent() {
        ContactJourney contactJourney = integrationTestDatabaseApi.createContactJourney();

        withAccessRights("journey_modification")
                .contentType(ContentType.JSON)
                .body(STR. """
                        {
                              "contactPerson" : "\{ contactJourney.getCompany().getContactPeople().get(0).getId() }",
                              "user" : "\{ contactJourney.getUser().getId() }",
                              "contactJourney" : "\{ contactJourney.getId() }",
                              "subject" : "Kicked off the contact",
                              "description" : "Tried calling",
                              "eventType" : "START_CONTACT"
                        }
                        """ )
                .when()
                .post("/api/journeys/" + contactJourney.getId() + "/events")
                .then().statusCode(200);

        ContactJourney contactJourney1 = integrationTestDatabaseApi.getContactJourney(contactJourney.getId());
        assertEquals(1, contactJourney1.getContactEvents().size());
        assertEquals("Kicked off the contact", contactJourney1.getContactEvents().get(0).getSubject());
        assertEquals("Tried calling", contactJourney1.getContactEvents().get(0).getDescription());
        assertEquals(ContactEventType.START_CONTACT, contactJourney1.getContactEvents().get(0).getEventType());
    }
}
