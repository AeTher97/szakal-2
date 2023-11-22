package org.iaeste.szakal2.repositories;

import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.*;
import org.iaeste.szakal2.models.dto.company.CompanySearch;
import org.iaeste.szakal2.models.entities.Company;
import org.iaeste.szakal2.models.entities.CompanyCategory;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class CompanySpecification implements Specification<Company> {

    private final CompanySearch criteria;
    private final EntityManager entityManager;

    public CompanySpecification(CompanySearch criteria, EntityManager entityManager) {
        this.criteria = criteria;
        this.entityManager = entityManager;
    }

    private static String wrapWithPercent(String value) {
        return "%" + value + "%";
    }

    @Override
    public Predicate toPredicate(Root<Company> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {

        Path<String> name = root.get("name");

        final List<Predicate> predicateList = new ArrayList<>();

        if (criteria.getName() != null) {
            predicateList.add(criteriaBuilder.like(name, wrapWithPercent(criteria.getName())));
        }

        if (criteria.getCategory() != null) {
            CriteriaQuery<CompanyCategory> companyCategoryCriteriaQuery = criteriaBuilder.createQuery(CompanyCategory.class);
            Root<CompanyCategory> companyCategoryRoot = companyCategoryCriteriaQuery.from(CompanyCategory.class);
            companyCategoryCriteriaQuery.select(companyCategoryRoot)
                    .where(criteriaBuilder.equal(companyCategoryRoot.get("name"), criteria.getCategory()));

            CompanyCategory companyCategory = entityManager.createQuery(companyCategoryCriteriaQuery).getSingleResult();

            predicateList.add(criteriaBuilder.isMember(companyCategory, root.get("categories")));
        }


        return criteriaBuilder.and(predicateList.toArray(new Predicate[0]));
    }
}
