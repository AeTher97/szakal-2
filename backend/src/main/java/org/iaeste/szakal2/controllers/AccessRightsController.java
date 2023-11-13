package org.iaeste.szakal2.controllers;

import lombok.extern.log4j.Log4j2;
import org.iaeste.szakal2.models.AccessRight;
import org.iaeste.szakal2.repositories.AccessRightRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/accessRights")
@Log4j2
public class AccessRightsController {

    private final AccessRightRepository accessRightRepository;

    public AccessRightsController(AccessRightRepository accessRightRepository) {
        this.accessRightRepository = accessRightRepository;
    }

    @GetMapping
    public Page<AccessRight> getAccessRights(@RequestParam(defaultValue = "100") int pageSize, @RequestParam int pageNumber) {
        return accessRightRepository.findAllByOrderByCode(Pageable.ofSize(pageSize).withPage(pageNumber));
    }
}
