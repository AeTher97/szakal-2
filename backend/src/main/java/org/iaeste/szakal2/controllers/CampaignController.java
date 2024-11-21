package org.iaeste.szakal2.controllers;

import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;
import org.iaeste.szakal2.models.dto.SzakalSort;
import org.iaeste.szakal2.models.dto.campaign.CampaignCreationDTO;
import org.iaeste.szakal2.models.dto.campaign.CampaignHomeDTO;
import org.iaeste.szakal2.models.dto.campaign.ContactJourneySearch;
import org.iaeste.szakal2.models.dto.journey.ContactJourneyListingDTO;
import org.iaeste.szakal2.models.entities.Campaign;
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
    @PreAuthorize("hasAuthority(@authorityBean.campaignModification())")
    public Campaign createCampaign(@RequestBody @Valid CampaignCreationDTO campaignCreationDTO) {
        return campaignService.createCampaign(campaignCreationDTO);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority(@authorityBean.campaignModification())")
    public Campaign modifyCampaign(@PathVariable("id") UUID id,
                                   @RequestBody @Valid CampaignCreationDTO campaignCreationDTO) {
        return campaignService.modifyCampaign(id, campaignCreationDTO);
    }

    @GetMapping("/{id}")
    public CampaignHomeDTO getCampaign(@PathVariable("id") UUID id) {
        return campaignService.getCampaignHomeDTOById(id);
    }

    @GetMapping
    public Page<Campaign> getCampaigns(@RequestParam(defaultValue = "10") int pageSize,
                                       @RequestParam int pageNumber) {
        return campaignService.getCampaigns(Pageable.ofSize(pageSize).withPage(pageNumber));
    }

    @GetMapping("/{id}/journeys")
    public Page<ContactJourneyListingDTO> getCampaignContactJourneys(@PathVariable("id") UUID id,
                                                                     @RequestParam(defaultValue = "10") int pageSize,
                                                                     @RequestParam(required = false) String companyName,
                                                                     @RequestParam(required = false) String status,
                                                                     @RequestParam(required = false) String detailedStatus,
                                                                     @RequestParam(required = false) String user,
                                                                     @RequestParam(required = false) String eventText,
                                                                     @RequestParam int pageNumber,
                                                                     @RequestParam(required = false) String sort) {
        return campaignService.getJourneysForCampaign(Pageable.ofSize(pageSize).withPage(pageNumber),
                ContactJourneySearch
                        .builder()
                        .companyName(companyName)
                        .campaignId(id)
                        .status(status)
                        .detailedStatus(detailedStatus)
                        .eventText(eventText)
                        .user(user)
                        .szakalSort(sort == null ? null : SzakalSort.fromString(sort))
                        .build());
    }

}
