package org.iaeste.szakal2.controllers;

import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;
import org.iaeste.szakal2.models.dto.campaign.CampaignCreationDTO;
import org.iaeste.szakal2.models.entities.Campaign;
import org.iaeste.szakal2.models.entities.ContactJourney;
import org.iaeste.szakal2.services.CampaignService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @GetMapping("/{id}")
    public Campaign getCampaign(@PathVariable("id") UUID id) {
        return campaignService.getCampaignById(id);
    }

    @GetMapping
    public Page<Campaign> getCampaigns(@RequestParam(defaultValue = "10") int pageSize, @RequestParam int pageNumber) {
        return campaignService.getCampaigns(Pageable.ofSize(pageSize).withPage(pageNumber));
    }

    @GetMapping("/{id}/journeys")
    public Page<ContactJourney> getCampaignContactJourneys(@PathVariable("id") UUID id,
                                                           @RequestParam(defaultValue = "10") int pageSize,
                                                           @RequestParam int pageNumber) {
        return campaignService.getJourneysForCampaign(id, Pageable.ofSize(pageSize).withPage(pageNumber));
    }

}
