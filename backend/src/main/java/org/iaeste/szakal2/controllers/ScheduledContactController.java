package org.iaeste.szakal2.controllers;

import jakarta.validation.Valid;
import org.iaeste.szakal2.models.dto.scheduled.contact.ScheduledContactDTO;
import org.iaeste.szakal2.models.entities.ScheduledContact;
import org.iaeste.szakal2.services.ScheduledContactService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/scheduled-contact")
public class ScheduledContactController {

    private final ScheduledContactService scheduledContactService;

    public ScheduledContactController(ScheduledContactService scheduledContactService) {
        this.scheduledContactService = scheduledContactService;
    }

    @GetMapping
    public List<ScheduledContact> getScheduledContacts() {
        return scheduledContactService.getScheduledContacts();
    }

    @PostMapping
    public ScheduledContact scheduleContact(@Valid @RequestBody ScheduledContactDTO scheduledContactDTO) {
        return scheduledContactService.schedule(scheduledContactDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteScheduledContact(@PathVariable("id") UUID contactId) {
        scheduledContactService.deleteScheduledContact(contactId);
    }
}