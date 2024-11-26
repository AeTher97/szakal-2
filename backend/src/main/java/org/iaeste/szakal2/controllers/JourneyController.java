package org.iaeste.szakal2.controllers;


import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;
import org.iaeste.szakal2.exceptions.ResourceNotFoundException;
import org.iaeste.szakal2.models.dto.SzakalSort;
import org.iaeste.szakal2.models.dto.campaign.ContactJourneySearch;
import org.iaeste.szakal2.models.dto.journey.*;
import org.iaeste.szakal2.security.utils.AccessVerificationBean;
import org.iaeste.szakal2.services.JourneyService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/journeys")
@Log4j2
public class JourneyController {

    private final JourneyService journeyService;

    public JourneyController(JourneyService journeyService) {
        this.journeyService = journeyService;
    }


    @PostMapping
    @PreAuthorize("hasAnyAuthority(@authorityBean.journeyCreation(), @authorityBean.journeyCreationForOthers())")
    public ContactJourneyDetailsDTO createContactJourney(@RequestBody @Valid ContactJourneyCreationDTO contactJourneyCreationDTO) {
        if (AccessVerificationBean.isUser(contactJourneyCreationDTO.getUser().toString()) ||
                AccessVerificationBean.hasRole("journey_creation_for_others")) {
            return journeyService.createJourney(contactJourneyCreationDTO);
        } else {
            throw new BadCredentialsException("Permissions not sufficient to assign a journey to this user");
        }
    }

    @PutMapping("/{id}/status")
    public ContactJourneyDetailsDTO updateContactJourneyStatus(@PathVariable("id") UUID id,
                                                               @RequestBody @Valid ContactJourneyStatusUpdatingDTO contactJourneyStatusUpdatingDTO) {
        return journeyService.updateJourneyStatus(id, contactJourneyStatusUpdatingDTO);
    }

    @PostMapping("/{id}/events")
    @PreAuthorize("@accessVerificationBean.isUser(#contactEventCreationDTO.user.toString())")
    public ContactJourneyDetailsDTO addContactEvent(@PathVariable("id") UUID id,
                                                    @RequestBody @Valid ContactEventCreationDTO contactEventCreationDTO) {
        return journeyService.addContactEvent(id, contactEventCreationDTO);
    }

    @PostMapping("/{id}/comments")
    @PreAuthorize("@accessVerificationBean.isUser(#commentCreationDTO.user.toString())")
    public ContactJourneyDetailsDTO addComment(@PathVariable("id") UUID id,
                                               @RequestBody @Valid CommentCreationDTO commentCreationDTO) {
        return journeyService.addComment(id, commentCreationDTO);
    }

    @PutMapping("/{id}/finish")
    public ContactJourneyDetailsDTO finishJourney(@PathVariable("id") UUID id) {
        return journeyService.finishJourney(id);
    }

    @PutMapping("/{id}/removeUser")
    public ContactJourneyDetailsDTO removeUserFromJourney(@PathVariable("id") UUID id) {
        return journeyService.removeUserFromJourney(id);
    }

    @GetMapping("/{id}")
    public ContactJourneyDetailsDTO getContactJourney(@PathVariable("id") UUID id) {
        return journeyService.getJourneyDTOById(id);
    }


    @GetMapping
    public Page<ContactJourneyListingDTO> getContactJourneys(@RequestParam(defaultValue = "10") int pageSize,
                                                             @RequestParam int pageNumber,
                                                             @RequestParam(required = false) UUID userId,
                                                             @RequestParam(required = false) UUID campaignId,
                                                             @RequestParam(required = false) String companyName,
                                                             @RequestParam(required = false) String status,
                                                             @RequestParam(required = false) String detailedStatus,
                                                             @RequestParam(required = false) String eventText,
                                                             @RequestParam(required = false) String sort) {
        if ((campaignId != null && userId == null) || (campaignId == null && userId != null)) {
            throw new ResourceNotFoundException("You have to call with both user and campaign id at once");
        }
        return journeyService.getJourneys(Pageable.ofSize(pageSize).withPage(pageNumber),
                ContactJourneySearch
                        .builder()
                        .companyName(companyName)
                        .status(status)
                        .detailedStatus(detailedStatus)
                        .eventText(eventText)
                        .userId(userId)
                        .campaignId(campaignId)
                        .szakalSort(sort == null ? null : SzakalSort.fromString(sort))
                        .build());
    }
}
