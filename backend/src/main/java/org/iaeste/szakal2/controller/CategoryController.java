package org.iaeste.szakal2.controller;

import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;
import org.iaeste.szakal2.models.dto.category.CompanyCategoryCreationDTO;
import org.iaeste.szakal2.models.entities.CompanyCategory;
import org.iaeste.szakal2.services.CategoryService;
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
    public CompanyCategory createCategory(@RequestBody @Valid CompanyCategoryCreationDTO companyCategoryCreationDTO) {
        return categoryService.createCategory(companyCategoryCreationDTO);
    }

    @PutMapping("/{id}")
    public CompanyCategory modifyCategory(@PathVariable("id") UUID id,
                                          @RequestBody @Valid CompanyCategoryCreationDTO companyCategoryCreationDTO) {
        return categoryService.modifyCategory(id, companyCategoryCreationDTO);
    }


    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable("id")UUID categoryId) {
        categoryService.deleteCategory(categoryId);
    }
}
