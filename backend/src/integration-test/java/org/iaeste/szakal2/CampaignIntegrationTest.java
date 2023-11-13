package org.iaeste.szakal2;

import io.restassured.http.ContentType;
import org.iaeste.szakal2.models.entities.Campaign;
import org.iaeste.szakal2.services.CampaignService;
import org.iaeste.szakal2.util.IntegrationTestWithTools;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class CampaignIntegrationTest extends IntegrationTestWithTools {

    @Autowired
    private CampaignService campaignService;

    @Test
    public void createCampaign() {
        UUID campaignUUID = UUID.fromString(withAccessRights("campaign_modification", "company_modification")
                .contentType(ContentType.JSON)
                .body(STR."""
                        {
                        "name": "PPP2023",
                        "startDate": "2023-11-12"
                        }
                        """)
                .when()
                .post("/api/campaigns")
                .then()
                .statusCode(200)
                .extract()
                .path("id"));

        Campaign campaign = campaignService.getCampaignById(campaignUUID);
        assertEquals("PPP2023", campaign.getName());
        assertEquals("2023-11-12", campaign.getStartDate().toString());
    }

    @Test
    public void modifyCampaign() {
        UUID campaignUUID = UUID.fromString(withAccessRights("campaign_modification", "company_modification")
                .contentType(ContentType.JSON)
                .body(STR."""
                        {
                        "name": "PPP2023",
                        "startDate": "2023-11-12"
                        }
                        """)
                .when()
                .post("/api/campaigns")
                .then()
                .statusCode(200)
                .extract()
                .path("id"));


        withAccessRights("campaign_modification", "company_modification")
                .contentType(ContentType.JSON)
                .body(STR."""
                        {
                        "name": "PPP2024",
                        "startDate": "2025-12-05"
                        }
                        """)
                .when()
                .put("/api/campaigns/" + campaignUUID)
                .then()
                .statusCode(200)
                .extract()
                .path("id");

        Campaign campaign = campaignService.getCampaignById(campaignUUID);
        assertEquals("PPP2024", campaign.getName());
        assertEquals("2025-12-05", campaign.getStartDate().toString());
    }
}
