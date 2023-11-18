package org.iaeste.szakal2.controllers;

import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;
import org.iaeste.szakal2.models.dto.company.CompanyCreationDTO;
import org.iaeste.szakal2.models.dto.company.CompanyListingDTO;
import org.iaeste.szakal2.models.dto.company.ContactPersonCreationDTO;
import org.iaeste.szakal2.models.entities.Company;
import org.iaeste.szakal2.services.CompanyService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    public Company modifyCompany(@PathVariable("id") UUID id, @RequestBody @Valid CompanyCreationDTO companyCreationDTO) {
        return companyService.updateCompany(id, companyCreationDTO);
    }

    @PutMapping("/{id}/contactPerson")
    public Company addContactPerson(@PathVariable("id") UUID id, @RequestBody @Valid ContactPersonCreationDTO contactPersonCreationDTO) {
        return companyService.addContactPerson(id, contactPersonCreationDTO);
    }

    @GetMapping("/{id}")
    public Company getCompany(@PathVariable("id") UUID id) {
        return companyService.getCompanyById(id);
    }

    @GetMapping
    public Page<CompanyListingDTO> getCompanies(@RequestParam(defaultValue = "10") int pageSize,
                                                @RequestParam int pageNumber,
                                                @RequestParam(required = false) UUID campaign) {
        return companyService.getCompanies(Pageable.ofSize(pageSize).withPage(pageNumber))
                .map(company -> CompanyListingDTO.fromCompany(company, campaign));
    }
}
