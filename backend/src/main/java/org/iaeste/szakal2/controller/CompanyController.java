package org.iaeste.szakal2.controller;

import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;
import org.iaeste.szakal2.models.dto.company.CompanyCreationDTO;
import org.iaeste.szakal2.models.dto.company.ContactPersonCreationDTO;
import org.iaeste.szakal2.models.entities.Company;
import org.iaeste.szakal2.services.CompanyService;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/companies")
@Log4j2
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @PostMapping
    public Company createCompany(@RequestBody @Valid CompanyCreationDTO companyCreationDTO) {
        return companyService.createCompany(companyCreationDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteCompany(@PathVariable("id") UUID id) {
        companyService.deleteCompany(id);
    }

    @PutMapping("/{id}")
    public void modifyCompany(@PathVariable("id") UUID id, @RequestBody @Valid CompanyCreationDTO companyCreationDTO) {
        companyService.updateCompany(id, companyCreationDTO);
    }

    @PutMapping("/{id}/contactPerson")
    public void addContactPerson(@PathVariable("id") UUID id, @RequestBody @Valid ContactPersonCreationDTO contactPersonCreationDTO) {
        companyService.addContactPerson(id, contactPersonCreationDTO);
    }
}
