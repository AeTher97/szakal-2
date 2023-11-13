package org.iaeste.szakal2.services;

import org.iaeste.szakal2.exceptions.ResourceExistsException;
import org.iaeste.szakal2.exceptions.ResourceNotFoundException;
import org.iaeste.szakal2.models.dto.category.CompanyCategoryCreationDTO;
import org.iaeste.szakal2.models.entities.CompanyCategory;
import org.iaeste.szakal2.repositories.CategoryRepository;
import org.iaeste.szakal2.repositories.CompanyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CompanyRepository companyRepository;

    public CategoryService(CategoryRepository categoryRepository, CompanyRepository companyRepository) {
        this.categoryRepository = categoryRepository;
        this.companyRepository = companyRepository;
    }

    public CompanyCategory createCategory(CompanyCategoryCreationDTO companyCategoryCreationDTO) {
        Optional<CompanyCategory> companyCategoryOptional
                = categoryRepository.findCompanyCategoryByNameIgnoreCase(companyCategoryCreationDTO.getName());
        if (companyCategoryOptional.isPresent()) {
            throw new ResourceExistsException(STR. """
                    Category with name \{ companyCategoryCreationDTO.getName() } already exists""" );
        }
        return categoryRepository.save(companyCategoryFromDto(companyCategoryCreationDTO));
    }

    public CompanyCategory modifyCategory(UUID id, CompanyCategoryCreationDTO companyCategoryCreationDTO) {
        Optional<CompanyCategory> companyCategoryOptional
                = categoryRepository.findCompanyCategoryById(id);
        if (companyCategoryOptional.isEmpty()) {
            throw new ResourceNotFoundException(STR. """
                    Category with id \{ id } does not exists""" );
        }
        CompanyCategory companyCategory = companyCategoryOptional.get();
        companyCategory.setName(companyCategoryCreationDTO.getName());
        return categoryRepository.save(companyCategory);
    }

    public void deleteCategory(UUID categoryId) {
        Optional<CompanyCategory> companyCategory = categoryRepository.findCompanyCategoryById(categoryId);
        if (companyCategory.isEmpty()) {
            throw new ResourceNotFoundException(STR. """
                    Category with id \{ categoryId } does not exist""" );
        }
        if (!companyRepository.findCompanyByCategoriesIn(List.of(companyCategory.get())).isEmpty()) {
            throw new ResourceExistsException("Cannot delete category, companies referencing it still exist");
        }
        categoryRepository.deleteById(categoryId);
    }

    public void truncate() {
        categoryRepository.deleteAll();
    }

    private CompanyCategory companyCategoryFromDto(CompanyCategoryCreationDTO companyCategoryCreationDTO) {
        return CompanyCategory.builder()
                .name(companyCategoryCreationDTO.getName()).build();
    }
}
