package org.iaeste.szakal2.repositories;

import org.iaeste.szakal2.models.entities.Company;
import org.iaeste.szakal2.models.entities.CompanyCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CategoryRepository extends JpaRepository<CompanyCategory, UUID> {

    Optional<CompanyCategory> findCompanyCategoryByNameIgnoreCase(String name);
    Optional<CompanyCategory> findCompanyCategoryById(UUID id);

}
