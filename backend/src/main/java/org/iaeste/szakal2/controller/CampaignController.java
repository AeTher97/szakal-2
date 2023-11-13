package org.iaeste.szakal2.controller;

import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;
import org.iaeste.szakal2.models.dto.campaign.CampaignCreationDTO;
import org.iaeste.szakal2.models.entities.Campaign;
import org.iaeste.szakal2.services.CampaignService;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/campaigns")
@Log4j2
public class CampaignController {

    private final CampaignService campaignService;

    public CampaignController(CampaignService campaignService) {
        this.campaignService = campaignService;
    }

    @PostMapping
    public Campaign createCampaign(@RequestBody @Valid CampaignCreationDTO campaignCreationDTO) {
        return campaignService.createCampaign(campaignCreationDTO);
    }

    @PutMapping("/{id}")
    public Campaign modifyCampaign(@PathVariable("id") UUID id, @RequestBody @Valid CampaignCreationDTO campaignCreationDTO) {
        return campaignService.modifyCampaign(id, campaignCreationDTO);
    }


}
