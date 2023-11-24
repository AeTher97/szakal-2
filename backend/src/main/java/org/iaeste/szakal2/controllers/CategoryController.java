package org.iaeste.szakal2.controllers;

import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;
import org.iaeste.szakal2.models.dto.category.CompanyCategoryCreationDTO;
import org.iaeste.szakal2.models.entities.CompanyCategory;
import org.iaeste.szakal2.services.CategoryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/categories")
@Log4j2
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('category_modification')")
    public CompanyCategory createCategory(@RequestBody @Valid CompanyCategoryCreationDTO companyCategoryCreationDTO) {
        return categoryService.createCategory(companyCategoryCreationDTO);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('category_modification')")
    public CompanyCategory modifyCategory(@PathVariable("id") UUID id,
                                          @RequestBody @Valid CompanyCategoryCreationDTO companyCategoryCreationDTO) {
        return categoryService.modifyCategory(id, companyCategoryCreationDTO);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('category_modification')")
    public void deleteCategory(@PathVariable("id") UUID categoryId) {
        categoryService.deleteCategory(categoryId);
    }

    @GetMapping
    public Page<CompanyCategory> getCategories(@RequestParam(defaultValue = "10") int pageSize, @RequestParam int pageNumber) {
        return categoryService.getCategories(Pageable.ofSize(pageSize).withPage(pageNumber));
    }
}
