package org.iaeste.szakal2.controllers;


import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;
import org.iaeste.szakal2.models.dto.journey.CommentCreationDTO;
import org.iaeste.szakal2.models.dto.journey.ContactEventDTO;
import org.iaeste.szakal2.models.dto.journey.ContactJourneyCreationDTO;
import org.iaeste.szakal2.models.dto.journey.ContactJourneyStatusUpdatingDTO;
import org.iaeste.szakal2.models.entities.ContactJourney;
import org.iaeste.szakal2.services.JourneyService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    public ContactJourney createContactJourney(@RequestBody @Valid ContactJourneyCreationDTO contactJourneyCreationDTO) {
        return journeyService.createJourney(contactJourneyCreationDTO);
    }

    @PutMapping("/{id}/status")
    public ContactJourney updateContactJourneyStatus(@PathVariable("id") UUID id,
                                                     @RequestBody @Valid ContactJourneyStatusUpdatingDTO contactJourneyStatusUpdatingDTO) {
        return journeyService.updateJourneyStatus(id, contactJourneyStatusUpdatingDTO);
    }

    @PostMapping("/{id}/events")
    public ContactJourney addContactEvent(@PathVariable("id") UUID id,
                                          @RequestBody @Valid ContactEventDTO contactEventDTO) {
        return journeyService.addContactEventDTO(id, contactEventDTO);
    }

    @PostMapping("/{id}/comments")
    public ContactJourney addComment(@PathVariable("id") UUID id,
                                     @RequestBody @Valid CommentCreationDTO commentCreationDTO) {
        return journeyService.addComment(id, commentCreationDTO);
    }

    @GetMapping("/{id}")
    public ContactJourney getContactJourney(@PathVariable("id") UUID id) {
        return journeyService.getJourneyById(id);
    }

    @GetMapping
    public Page<ContactJourney> getContactJourney(@RequestParam(defaultValue = "10") int pageSize, @RequestParam int pageNumber) {
        return journeyService.getJourneys(Pageable.ofSize(pageSize).withPage(pageNumber));
    }
}
