package org.iaeste.szakal2.controllers;

import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;
import org.iaeste.szakal2.models.dto.SzakalSort;
import org.iaeste.szakal2.models.dto.company.*;
import org.iaeste.szakal2.models.entities.Company;
import org.iaeste.szakal2.models.entities.ContactStatus;
import org.iaeste.szakal2.services.CompanyService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasAuthority(@authorityBean.companyModification())")
    public Company createCompany(@RequestBody @Valid CompanyCreationDTO companyCreationDTO) {
        return companyService.createCompany(companyCreationDTO);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority(@authorityBean.companyModification())")
    public void deleteCompany(@PathVariable("id") UUID id) {
        companyService.deleteCompany(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority(@authorityBean.companyModification())")
    public CompanyDetailsDTO modifyCompany(@PathVariable("id") UUID id,
                                           @RequestBody @Valid CompanyModificationDTO companyModificationDTO) {
        return CompanyDetailsDTO.fromCompany(companyService.updateCompany(id, companyModificationDTO));
    }

    @PutMapping("/{id}/contactPerson")
    @PreAuthorize("hasAuthority(@authorityBean.companyModification())")
    public CompanyDetailsDTO addContactPerson(@PathVariable("id") UUID id,
                                              @RequestBody @Valid ContactPersonCreationDTO contactPersonCreationDTO) {
        return CompanyDetailsDTO.fromCompany(companyService.addContactPerson(id, contactPersonCreationDTO));
    }

    @PutMapping("/{companyId}/contactPerson/{contactPersonId}")
    @PreAuthorize("hasAuthority(@authorityBean.companyModification())")
    public Company modifyContactPerson(@PathVariable("companyId") UUID companyId,
                                       @PathVariable("contactPersonId") UUID contactPersonId,
                                       @RequestBody @Valid ContactPersonCreationDTO contactPersonCreationDTO) {
        return companyService.modifyContactPerson(companyId, contactPersonId, contactPersonCreationDTO);
    }

    @DeleteMapping("/{companyId}/contactPerson/{contactPersonId}")
    @PreAuthorize("hasAuthority(@authorityBean.companyModification())")
    public CompanyDetailsDTO deleteContactPerson(@PathVariable("companyId") UUID companyId,
                                                 @PathVariable("contactPersonId") UUID contactPersonId) {
        return CompanyDetailsDTO.fromCompany(companyService.deleteContactPerson(companyId, contactPersonId));
    }

    @GetMapping("/{id}")
    public CompanyDetailsDTO getCompany(@PathVariable("id") UUID id) {
        return companyService.getCompanyDTOById(id);
    }

    @GetMapping
    public Page<CompanyListingDTO> getCompanies(@RequestParam(defaultValue = "10") int pageSize,
                                                @RequestParam int pageNumber,
                                                @RequestParam(required = false) UUID campaign,
                                                @RequestParam(required = false) String name,
                                                @RequestParam(required = false) ContactStatus contactStatus,
                                                @RequestParam(required = false) String category,
                                                @RequestParam(required = false) String status,
                                                @RequestParam(required = false) Boolean hasAlumni,
                                                @RequestParam(required = false) String alumniDescription,
                                                @RequestParam(required = false) String committee,
                                                @RequestParam(required = false) String campaignName,
                                                @RequestParam(required = false) String sort) {
        Pageable pageable;
        if (sort == null) {
            pageable = Pageable.ofSize(pageSize).withPage(pageNumber);
        } else {
            SzakalSort szakalSort = SzakalSort.fromString(sort);
            Sort springSort = Sort.by(szakalSort.getColumnName());
            if (szakalSort.getSortDirection().equals(SzakalSort.SortDirection.ASC)) {
                pageable = PageRequest.of(pageNumber, pageSize, springSort.ascending());
            } else {
                pageable = PageRequest.of(pageNumber, pageSize, springSort.descending());
            }
        }
        return companyService.getCompanies(CompanySearchDTO.builder()
                        .category(category)
                        .contactStatus(contactStatus)
                        .campaign(campaign)
                        .status(status)
                        .hasAlumni(hasAlumni != null && hasAlumni)
                        .alumniDescription(alumniDescription)
                        .campaignName(campaignName)
                        .committee(committee)
                        .name(name).build(), pageable)
                .map(company -> CompanyListingDTO.fromCompany(company, campaign));
    }

}
