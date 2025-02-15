package org.iaeste.szakal2.services;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.iaeste.szakal2.exceptions.ResourceNotFoundException;
import org.iaeste.szakal2.models.dto.company.*;
import org.iaeste.szakal2.models.entities.Company;
import org.iaeste.szakal2.models.entities.CompanyCategory;
import org.iaeste.szakal2.models.entities.ContactPerson;
import org.iaeste.szakal2.repositories.CategoryRepository;
import org.iaeste.szakal2.repositories.CompanyRepository;
import org.iaeste.szakal2.repositories.CompanySpecification;
import org.iaeste.szakal2.repositories.ContactJourneyRepository;
import org.iaeste.szakal2.security.utils.SecurityUtils;
import org.iaeste.szakal2.utils.Utils;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class CompanyService {

    @PersistenceContext
    private EntityManager entityManager;
    private final ContactJourneyRepository contactJourneyRepository;
    private final UserService userService;
    private final WsNotifyingService wsNotifyingService;
    private final CompanyRepository companyRepository;
    private final CategoryRepository categoryRepository;
    private final ContactJourneyRepository contactJourneyRepository;

    public CompanyService(UserService userService,
                          WsNotifyingService wsNotifyingService,
                          CompanyRepository companyRepository,
                          CategoryRepository categoryRepository,
                          ContactJourneyRepository contactJourneyRepository) {
        this.userService = userService;
        this.wsNotifyingService = wsNotifyingService;
        this.companyRepository = companyRepository;
        this.categoryRepository = categoryRepository;
        this.contactJourneyRepository = contactJourneyRepository;
    }

    public Company createCompany(CompanyCreationDTO companyCreationDTO) {
        Company company = companyFromDTO(companyCreationDTO);
        company = companyRepository.save(company);
        wsNotifyingService.sendUpdateAboutCompanies();
        return company;
    }

    public Company updateCompany(UUID id, CompanyModificationDTO companyModificationDTO) {
        Company company = getCompanyById(id);
        if (companyModificationDTO.getCategories() != null) {
            company.getCategories().clear();
            company.getCategories().addAll(categoryRepository.findAllById(companyModificationDTO.getCategories()));
        }
        company.setUpdatedBy(userService.getUserById(SecurityUtils.getUserId()));
        BeanUtils.copyProperties(companyModificationDTO, company, Utils.getNullPropertyNames(companyModificationDTO));
        companyRepository.save(company);
        wsNotifyingService.sendUpdateAboutCompany(company.getId());
        return company;
    }

    public void deleteCompany(UUID id) {
        Company company = getCompanyById(id);
        company.setDeleted(true);
        company.setDeletedDate(LocalDateTime.now());
        wsNotifyingService.sendUpdateAboutCompanies();
        companyRepository.save(company);
    }

    @Transactional
    public Company addContactPerson(UUID id, ContactPersonCreationDTO contactPersonCreationDTO) {
        Company company = getCompanyById(id);
        ContactPerson contactPerson = contactPersonFromDTO(company.getId(), contactPersonCreationDTO);
        company.getContactPeople().add(contactPerson);

        companyRepository.save(company);
        wsNotifyingService.sendUpdateAboutCompany(id);
        return company;
    }

    @Transactional
    public Company modifyContactPerson(UUID id, UUID contactPersonId, ContactPersonCreationDTO contactPersonCreationDTO) {
        Company company = getCompanyById(id);
        Optional<ContactPerson> contactPersonOptional = company.getContactPeople().stream()
                .filter(contactPerson -> contactPerson.getId().equals(contactPersonId)).findAny();

        if (contactPersonOptional.isEmpty()) {
            throw new ResourceNotFoundException("Contact person not found");
        }

        ContactPerson contactPerson = contactPersonOptional.get();
        BeanUtils.copyProperties(contactPersonCreationDTO, contactPerson,
                Utils.getNullPropertyNames(contactPersonCreationDTO));

        companyRepository.save(company);
        wsNotifyingService.sendUpdateAboutCompany(id);
        return company;
    }

    @Transactional
    public Company deleteContactPerson(UUID companyId, UUID contactPersonId) {
        Company company = getCompanyById(companyId);
        Optional<ContactPerson> contactPersonOptional = company.getContactPeople().stream()
                .filter(contactPerson -> contactPerson.getId().equals(contactPersonId)).findAny();

        if (contactPersonOptional.isEmpty()) {
            throw new ResourceNotFoundException("Contact person not found");
        }

        contactJourneyRepository.findAll().stream()
                .flatMap(journey -> journey.getContactEvents().stream())
                .filter(event -> event.getContactPerson() != null && event.getContactPerson().getId().equals(contactPersonId))
                .forEach(event -> event.setContactPerson(null));

        company.getContactPeople().remove(contactPersonOptional.get());
        companyRepository.save(company);
        wsNotifyingService.sendUpdateAboutCompany(companyId);
        return company;
    }

    public Company getCompanyById(UUID id) {
        Optional<Company> companyOptional = companyRepository.findCompanyById(id);
        if (companyOptional.isEmpty()) {
            throw new ResourceNotFoundException(STR."""
                    Company with id \{id} does not exist""");
        }
        return companyOptional.get();
    }

    public CompanyDetailsDTO getCompanyDTOById(UUID id) {
        Optional<Company> companyOptional = companyRepository.findCompanyById(id);
        if (companyOptional.isEmpty()) {
            throw new ResourceNotFoundException(STR."""
                    Company with id \{id} does not exist""");
        }
        return CompanyDetailsDTO.fromCompany(companyOptional.get());
    }

    public Page<Company> getCompanies(CompanySearchDTO companySearchDTO, Pageable pageable) {
        Page<Company> companyPage = companyRepository.findAll(new CompanySpecification(companySearchDTO, entityManager), pageable);
        List<Company> companies = companyRepository.findAllById(companyPage.map(Company::getId).stream().toList());
        return new PageImpl<>(companies, pageable, companyPage.getTotalElements());
    }

    private Company companyFromDTO(CompanyCreationDTO companyCreationDTO) {
        Set<CompanyCategory> categoriesList = new HashSet<>();
        if (companyCreationDTO.getCategories() != null && !companyCreationDTO.getCategories().isEmpty()) {
            categoriesList.addAll(categoryRepository.findAllById(companyCreationDTO.getCategories()));
        }
        Company company = Company.builder()
                .categories(categoriesList)
                .updateDate(LocalDateTime.now())
                .insertDate(LocalDateTime.now())
                .contactPeople(new HashSet<>())
                .updatedBy(userService.getUserById(SecurityUtils.getUserId()))
                .build();
        BeanUtils.copyProperties(companyCreationDTO, company, Utils.getNullPropertyNames(companyCreationDTO));
        return company;
    }

    private ContactPerson contactPersonFromDTO(UUID companyUUID, ContactPersonCreationDTO contactPersonCreationDTO) {
        Company company = getCompanyById(companyUUID);
        return ContactPerson.builder()
                .company(company)
                .name(contactPersonCreationDTO.getName())
                .position(contactPersonCreationDTO.getPosition())
                .email(contactPersonCreationDTO.getEmail())
                .phone(contactPersonCreationDTO.getPhone())
                .comment(contactPersonCreationDTO.getComment())
                .isAlumni(contactPersonCreationDTO.isAlumni())
                .committee(contactPersonCreationDTO.getCommittee())
                .build();
    }

}
