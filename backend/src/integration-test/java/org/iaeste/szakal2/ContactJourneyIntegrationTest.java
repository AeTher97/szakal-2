package org.iaeste.szakal2;

import io.restassured.http.ContentType;
import org.iaeste.szakal2.models.entities.*;
import org.iaeste.szakal2.util.IntegrationTestWithTools;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.iaeste.szakal2.models.entities.ContactStatus.IN_PROGRESS;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

public class ContactJourneyIntegrationTest extends IntegrationTestWithTools {

    @Test
    public void testCreatingContactJourney() {
        Company company = createCompany("IAESTE");
        User user = createUser("company-creator@gmail.com", "company-creator", "password",
                List.of("company_modification"));
        Campaign campaign = createCampaign("PPP2023", LocalDate.now());

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

        assertEquals(user.getId(), journeyService.getJourneyById(journeyId).getUser().getId());
        assertEquals(campaign.getId(), journeyService.getJourneyById(journeyId).getCampaign().getId());
        assertEquals(company.getId(), journeyService.getJourneyById(journeyId).getCompany().getId());
        assertNull(journeyService.getJourneyById(journeyId).getContactStatus());
    }

    @Test
    public void testUpdatingJourneyStatus() {
        Company company = createCompany("IAESTE");
        User user = createUser("company-creator@gmail.com", "company-creator", "password",
                List.of("company_modification"));
        Campaign campaign = createCampaign("PPP2023", LocalDate.now());

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

        assertEquals(user.getId(), journeyService.getJourneyById(journeyId).getUser().getId());
        assertEquals(campaign.getId(), journeyService.getJourneyById(journeyId).getCampaign().getId());
        assertEquals(company.getId(), journeyService.getJourneyById(journeyId).getCompany().getId());
        assertEquals(IN_PROGRESS, journeyService.getJourneyById(journeyId).getContactStatus());
    }

    @Test
    public void testCantAddTwoJourneysForTheSameCampaignAndCompany() {
        ContactJourney contactJourney = createContactJourney();

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
        ContactJourney contactJourney = createContactJourney();

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

        ContactJourney contactJourney1 = journeyService.getJourneyById(contactJourney.getId());
        assertEquals(1, contactJourney1.getComments().size());
        assertEquals("Nie idzie za dobrze", contactJourney1.getComments().get(0).getComment());
    }

    @Test
    public void testAddContactJourneyEvent() {
        ContactJourney contactJourney = createContactJourney();

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

        ContactJourney contactJourney1 = journeyService.getJourneyById(contactJourney.getId());
        assertEquals(1, contactJourney1.getContactEvents().size());
        assertEquals("Kicked off the contact", contactJourney1.getContactEvents().get(0).getSubject());
        assertEquals("Tried calling", contactJourney1.getContactEvents().get(0).getDescription());
        assertEquals(ContactEventType.START_CONTACT, contactJourney1.getContactEvents().get(0).getEventType());
    }
}
