package org.iaeste.szakal2.repositories;

import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.*;
import org.iaeste.szakal2.models.dto.company.CompanySearchDTO;
import org.iaeste.szakal2.models.entities.Company;
import org.iaeste.szakal2.models.entities.CompanyCategory;
import org.iaeste.szakal2.models.entities.ContactJourney;
import org.iaeste.szakal2.models.entities.ContactPerson;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class CompanySpecification implements Specification<Company> {

    private final CompanySearchDTO criteria;
    private final EntityManager entityManager;

    public CompanySpecification(CompanySearchDTO criteria, EntityManager entityManager) {
        this.criteria = criteria;
        this.entityManager = entityManager;
    }

    private static String wrapWithPercent(String value) {
        return STR."%\{value}%";
    }

    @Override
    public Predicate toPredicate(Root<Company> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {

        Path<String> name = root.get("name");
        query.distinct(true);

        final List<Predicate> predicateList = new ArrayList<>();

        if (criteria.getName() != null) {
            predicateList.add(criteriaBuilder.like(criteriaBuilder.lower(name), wrapWithPercent(criteria.getName().toLowerCase())));
        }

        if (criteria.getCategory() != null) {
            CriteriaQuery<CompanyCategory> companyCategoryCriteriaQuery = criteriaBuilder.createQuery(CompanyCategory.class);
            Root<CompanyCategory> companyCategoryRoot = companyCategoryCriteriaQuery.from(CompanyCategory.class);
            companyCategoryCriteriaQuery.select(companyCategoryRoot)
                    .where(criteriaBuilder.equal(companyCategoryRoot.get("name"), criteria.getCategory()));

            CompanyCategory companyCategory = entityManager.createQuery(companyCategoryCriteriaQuery).getSingleResult();

            predicateList.add(criteriaBuilder.isMember(companyCategory, root.get("categories")));
        }

        if(criteria.getStatus() != null){
            if(criteria.getStatus().equals("free")) {
                Join<Company, ContactJourney> join = root.join("contactJourneys", JoinType.LEFT);
                join.on(criteriaBuilder.equal(join.get("campaign").get("id"), criteria.getCampaign()));
                predicateList.add(criteriaBuilder.isNull(join.get("id")));
            } else if(criteria.getStatus().equals("taken")){
                predicateList.add(criteriaBuilder.equal(root.join("contactJourneys").get("campaign").get("id"),
                        criteria.getCampaign()));
            }
        }

        if(criteria.isHasAlumni()){
            Join<Company, ContactPerson> join = root.join("contactPeople", JoinType.LEFT);
            join.on(criteriaBuilder.equal(join.get("company").get("id"), root.get("id")));
            predicateList.add(criteriaBuilder.isTrue(join.get("isAlumni")));
        }

        if(criteria.getAlumniDescription() != null){
            SetJoin<Company, ContactPerson> join = root.joinSet("contactPeople", JoinType.LEFT);
            join.on(criteriaBuilder.equal(join.get("company").get("id"), root.get("id")));
            predicateList.add(criteriaBuilder.and(criteriaBuilder.like(criteriaBuilder.lower(join.get("comment")),
                    wrapWithPercent(criteria.getAlumniDescription().toLowerCase())),
                    criteriaBuilder.isTrue(join.get("isAlumni"))
            ));
        }

        if(criteria.getCommittee() != null){
            SetJoin<Company, ContactPerson> join = root.joinSet("contactPeople", JoinType.LEFT);
            join.on(criteriaBuilder.equal(join.get("company").get("id"), root.get("id")));
            predicateList.add(criteriaBuilder.and(criteriaBuilder.like(criteriaBuilder.lower(join.get("committee")),
                            wrapWithPercent(criteria.getCommittee().toLowerCase())),
                    criteriaBuilder.isTrue(join.get("isAlumni"))
            ));
        }

        if(criteria.getCampaignName() != null){
            SetJoin<Company, ContactJourney> join = root.joinSet("contactJourneys", JoinType.LEFT);
            join.on(criteriaBuilder.equal(join.get("company").get("id"), root.get("id")));
            predicateList.add(criteriaBuilder.like(criteriaBuilder.lower(join.get("campaign").get("name")),
                            wrapWithPercent(criteria.getCampaignName().toLowerCase()))
            );
        }

        return criteriaBuilder.and(predicateList.toArray(new Predicate[0]));
    }
}
