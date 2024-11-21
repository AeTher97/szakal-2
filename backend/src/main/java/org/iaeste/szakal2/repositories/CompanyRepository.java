package org.iaeste.szakal2.repositories;

import org.iaeste.szakal2.models.entities.Company;
import org.iaeste.szakal2.models.entities.CompanyCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.lang.NonNullApi;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CompanyRepository extends JpaRepository<Company, UUID>, JpaSpecificationExecutor<Company> {

    @EntityGraph(value = "Company.listing", type = EntityGraph.EntityGraphType.LOAD)
    List<Company> findAllById(Iterable<UUID> ids);

    @EntityGraph(value = "Company.address", type = EntityGraph.EntityGraphType.LOAD)
    Page<Company> findAll(Specification<Company> companySpecification, Pageable pageable);

    @EntityGraph(value = "Company.detail", type = EntityGraph.EntityGraphType.LOAD)
    Optional<Company> findCompanyById(UUID id);

    List<Company> findCompanyByCategoriesIn(Iterable<CompanyCategory> companyCategories);

}
