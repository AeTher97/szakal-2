package org.iaeste.szakal2.controllers;

import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;
import org.iaeste.szakal2.models.dto.campaign.CampaignCreationDTO;
import org.iaeste.szakal2.models.dto.campaign.ContactJourneySearch;
import org.iaeste.szakal2.models.entities.Campaign;
import org.iaeste.szakal2.models.entities.ContactJourney;
import org.iaeste.szakal2.services.CampaignService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasAuthority('campaign_modification')")
    public Campaign createCampaign(@RequestBody @Valid CampaignCreationDTO campaignCreationDTO) {
        return campaignService.createCampaign(campaignCreationDTO);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('campaign_modification')")
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
                                                           @RequestParam(required = false) String companyName,
                                                           @RequestParam(required = false) String status,
                                                           @RequestParam(required = false) String user,
                                                           @RequestParam int pageNumber) {
        return campaignService.getJourneysForCampaign(Pageable.ofSize(pageSize).withPage(pageNumber),
                ContactJourneySearch.builder()
                        .companyName(companyName)
                        .campaignId(id)
                        .status(status)
                        .user(user)
                        .build());
    }

}
