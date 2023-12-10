package org.iaeste.szakal2.controllers;

import lombok.extern.log4j.Log4j2;
import org.iaeste.szakal2.exceptions.ResourceNotFoundException;
import org.iaeste.szakal2.models.dto.notification.NotificationSeenDTO;
import org.iaeste.szakal2.services.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@Log4j2
public class NotificationController {


    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<Object> getAllNotifications() {
        return ResponseEntity.ok(notificationService.getNotifications());
    }

    @PutMapping("/seen")
    public void seenNotifications(@RequestBody NotificationSeenDTO notificationSeenDTO) throws ResourceNotFoundException {
        log.info("Updating notifications seen status");
        notificationService.markSeen(notificationSeenDTO.getNotifications());
    }
}
