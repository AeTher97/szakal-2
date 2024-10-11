package org.iaeste.szakal2.repositories;

import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.iaeste.szakal2.models.dto.campaign.ContactJourneySearch;
import org.iaeste.szakal2.models.entities.ContactJourney;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class JourneySpecification implements Specification<ContactJourney> {

    private final ContactJourneySearch criteria;

    public JourneySpecification(ContactJourneySearch criteria, EntityManager entityManager) {
        this.criteria = criteria;
    }

    private static String wrapWithPercent(String value) {
        return "%" + value + "%";
    }

    @Override
    public Predicate toPredicate(Root<ContactJourney> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {


        final List<Predicate> predicateList = new ArrayList<>();

        if (criteria.getCampaignId() != null) {
            predicateList.add(criteriaBuilder.equal(root.get("campaignId"),
                    criteria.getCampaignId()));
        }

        if (criteria.getCompanyName() != null) {
            predicateList.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("company").get("name")),
                    wrapWithPercent(criteria.getCompanyName().toLowerCase())));
        }

        if (criteria.getStatus() != null) {
            if(criteria.getStatus().equals("in-progress")) {
                predicateList.add(criteriaBuilder.isFalse(root.get("finished")));
            } else if(criteria.getStatus().equals("finished")){
                predicateList.add(criteriaBuilder.isTrue(root.get("finished")));
            }
        }

        if (criteria.getDetailedStatus() != null) {
            predicateList.add(criteriaBuilder.equal(root.get("contactStatus"), criteria.getDetailedStatus()));
        }

        if (criteria.getUser() != null) {
            String [] parts = criteria.getUser().toLowerCase().split(" ");
            if(parts.length == 1) {
                predicateList.add(
                        criteriaBuilder.or(
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("user").get("name")), wrapWithPercent(parts[0])),
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("user").get("surname")), wrapWithPercent(parts[0])),
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("user").get("email")), wrapWithPercent(parts[0]))));
            } else if(parts.length > 1){
                predicateList.add(
                        criteriaBuilder.or(
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("user").get("name")), wrapWithPercent(parts[0])),
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("user").get("surname")), wrapWithPercent(parts[1])),
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("user").get("email")), wrapWithPercent(parts[0]))));
            }

        }

        return criteriaBuilder.and(predicateList.toArray(new Predicate[0]));
    }
}