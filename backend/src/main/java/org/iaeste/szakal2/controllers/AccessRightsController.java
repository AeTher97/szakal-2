package org.iaeste.szakal2.controllers;

import lombok.extern.log4j.Log4j2;
import org.iaeste.szakal2.models.entities.AccessRight;
import org.iaeste.szakal2.repositories.AccessRightRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/accessRights")
@Log4j2
public class AccessRightsController {

    private final AccessRightRepository accessRightRepository;

    public AccessRightsController(AccessRightRepository accessRightRepository) {
        this.accessRightRepository = accessRightRepository;
    }

    @GetMapping
    public List<AccessRight> getAccessRights() {
        return accessRightRepository.findAllByOrderByCode();
    }
}
