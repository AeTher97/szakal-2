package org.iaeste.szakal2.repositories;

import org.iaeste.szakal2.models.entities.Company;
import org.iaeste.szakal2.models.entities.CompanyCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CompanyRepository extends JpaRepository<Company, UUID> {

    Optional<Company> findCompanyById(UUID id);
    List<Company> findCompanyByCategoriesIn(Iterable<CompanyCategory> companyCategories);
}
