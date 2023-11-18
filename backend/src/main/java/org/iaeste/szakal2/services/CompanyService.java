package org.iaeste.szakal2.services;

import jakarta.transaction.Transactional;
import org.iaeste.szakal2.exceptions.ResourceNotFoundException;
import org.iaeste.szakal2.models.dto.company.CompanyCreationDTO;
import org.iaeste.szakal2.models.dto.company.ContactPersonCreationDTO;
import org.iaeste.szakal2.models.entities.Company;
import org.iaeste.szakal2.models.entities.CompanyCategory;
import org.iaeste.szakal2.models.entities.ContactPerson;
import org.iaeste.szakal2.repositories.CategoryRepository;
import org.iaeste.szakal2.repositories.CompanyRepository;
import org.iaeste.szakal2.security.utils.SecurityUtils;
import org.iaeste.szakal2.utils.Utils;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CompanyService {

    private final UserService userService;
    private final CompanyRepository companyRepository;
    private final CategoryRepository categoryRepository;

    public CompanyService(UserService userService, CompanyRepository companyRepository, CategoryRepository categoryRepository) {
        this.userService = userService;
        this.companyRepository = companyRepository;
        this.categoryRepository = categoryRepository;
    }

    public Company createCompany(CompanyCreationDTO companyCreationDTO) {
        Company company = companyFromDTO(companyCreationDTO);
        return companyRepository.save(company);
    }

    @Transactional
    public Company addContactPerson(UUID id, ContactPersonCreationDTO contactPersonCreationDTO) {
        Company company = getCompanyById(id);
        ContactPerson contactPerson = contactPersonFromDTO(company.getId(), contactPersonCreationDTO);
        company.getContactPeople().add(contactPerson);

        return companyRepository.save(company);
    }

    public Company updateCompany(UUID id, CompanyCreationDTO companyCreationDTO) {
        Company company = getCompanyById(id);
        if (companyCreationDTO.getCategories() != null && !companyCreationDTO.getCategories().isEmpty()) {
            company.getCategories().clear();
            company.getCategories().addAll(categoryRepository.findAllById(companyCreationDTO.getCategories()));
        }
        company.setUpdatedBy(userService.getUserById(SecurityUtils.getUserId()));
        BeanUtils.copyProperties(companyCreationDTO, company, Utils.getNullPropertyNames(companyCreationDTO));
        return companyRepository.save(company);
    }

    public void deleteCompany(UUID id) {
        Company company = getCompanyById(id);
        company.setDeleted(true);
        company.setDeletedDate(LocalDateTime.now());
        companyRepository.save(company);
    }

    public Company getCompanyById(UUID id) {
        Optional<Company> companyOptional = companyRepository.findCompanyById(id);
        if (companyOptional.isEmpty()) {
            throw new ResourceNotFoundException(STR. """
                    Company with id \{ id } does not exist""" );
        }
        return companyOptional.get();
    }

    public Page<Company> getCompanies(Pageable pageable) {
        return companyRepository.findAllByDeletedFalseOrderByNameDesc(pageable);
    }

    public void truncate() {
        companyRepository.deleteAll();
    }

    private Company companyFromDTO(CompanyCreationDTO companyCreationDTO) {
        List<CompanyCategory> categoriesList = new ArrayList<>();
        if (companyCreationDTO.getCategories() != null && !companyCreationDTO.getCategories().isEmpty()) {
            categoriesList.addAll(categoryRepository.findAllById(companyCreationDTO.getCategories()));
        }
        Company company = Company.builder()
                .categories(categoriesList)
                .updateDate(LocalDateTime.now())
                .insertDate(LocalDateTime.now())
                .contactPeople(new ArrayList<>())
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
                .phone2(contactPersonCreationDTO.getPhone2())
                .comment(contactPersonCreationDTO.getComment())
                .build();
    }

}
