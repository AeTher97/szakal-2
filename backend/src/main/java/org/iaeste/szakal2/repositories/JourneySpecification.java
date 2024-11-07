package org.iaeste.szakal2.repositories;

import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.*;
import org.iaeste.szakal2.models.dto.SzakalSort;
import org.iaeste.szakal2.models.dto.campaign.ContactJourneySearch;
import org.iaeste.szakal2.models.entities.Company;
import org.iaeste.szakal2.models.entities.ContactJourney;
import org.iaeste.szakal2.models.entities.ContactPerson;
import org.iaeste.szakal2.models.entities.ContactStatus;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class JourneySpecification implements Specification<ContactJourney> {

    private final ContactJourneySearch criteria;

    public JourneySpecification(ContactJourneySearch criteria, EntityManager entityManager) {
        this.criteria = criteria;
    }

    private static String wrapWithPercent(String value) {
        return "%" + value + "%";
    }

    public static void addCases(Root<ContactJourney> root, CriteriaQuery<?> criteriaQuery,
                                CriteriaBuilder criteriaBuilder, boolean ascending) {
        Path<String> contactStatus = root.get("contactStatus");

        CriteriaBuilder.SimpleCase<String, Integer> contactJourneyCase = criteriaBuilder.selectCase(contactStatus);
        for (int i = 0; i < ContactStatus.getInLocalOrder().size(); i++) {
            contactJourneyCase
                    .when(ContactStatus.getInLocalOrder().get(i).name(), i);
        }
        if (ascending) {
            criteriaQuery.orderBy(criteriaBuilder.asc(contactJourneyCase));
        } else {
            criteriaQuery.orderBy(criteriaBuilder.desc(contactJourneyCase));
        }
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
            if (criteria.getStatus().equals("in-progress")) {
                predicateList.add(criteriaBuilder.isFalse(root.get("finished")));
            } else if (criteria.getStatus().equals("finished")) {
                predicateList.add(criteriaBuilder.isTrue(root.get("finished")));
            }
        }

        if (criteria.getDetailedStatus() != null) {
            predicateList.add(criteriaBuilder.equal(root.get("contactStatus"), criteria.getDetailedStatus()));
        }

        if (criteria.getEventText() != null) {
            SetJoin<Company, ContactPerson> join = root.joinSet("contactEvents", JoinType.LEFT);
            join.on(criteriaBuilder.equal(join.get("contactJourney").get("id"), root.get("id")));
            predicateList.add(criteriaBuilder.like(criteriaBuilder.lower(join.get("description")),
                    wrapWithPercent(criteria.getEventText().toLowerCase())));
        }

        if (criteria.getUser() != null) {
            String[] parts = criteria.getUser().toLowerCase().split(" ");
            if (parts.length == 1) {
                predicateList.add(
                        criteriaBuilder.or(
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("user").get("name")),
                                        wrapWithPercent(parts[0])),
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("user").get("surname")),
                                        wrapWithPercent(parts[0])),
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("user").get("email"))
                                        , wrapWithPercent(parts[0]))));
            } else if (parts.length > 1) {
                predicateList.add(
                        criteriaBuilder.or(
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("user").get("name")),
                                        wrapWithPercent(parts[0])),
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("user").get("surname")),
                                        wrapWithPercent(parts[1])),
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("user").get("email")),
                                        wrapWithPercent(parts[0]))));
            }
        }

        if (criteria.getUserId() != null) {
            predicateList.add(criteriaBuilder.equal(root.get("user").get("id"), criteria.getUserId()));
        }

        if (criteria.getSzakalSort() != null) {
            boolean asc = criteria.getSzakalSort().getSortDirection().equals(SzakalSort.SortDirection.ASC);
            switch (criteria.getSzakalSort().getColumnName()) {
                case "detailedStatus" -> addCases(root, query, criteriaBuilder, asc);
                case "user" -> query.orderBy(asc ? criteriaBuilder.asc(root.get("user").get("surname")) :
                        criteriaBuilder.desc(root.get("user").get("surname")));
                case "companyName" -> query.orderBy(asc ? criteriaBuilder.asc(root.get("company").get("name")) :
                        criteriaBuilder.desc(root.get("company").get("name")));
                case "startDate" -> query.orderBy(asc ? criteriaBuilder.asc(root.get("journeyStart")) :
                        criteriaBuilder.desc(root.get("journeyStart")));
                case "lastInteraction" -> {
                    final Date MIN_DATE = new Date(0L);
                    final Date MAX_DATE = new Date(4000, 0, 0);

                    Order lastInteractionOrder = asc ?
                            criteriaBuilder.asc(criteriaBuilder.coalesce(root.get("lastInteraction"), MAX_DATE)) :
                            criteriaBuilder.desc(criteriaBuilder.coalesce(root.get("lastInteraction"), MIN_DATE));
                    query.orderBy(lastInteractionOrder);
                }
                default -> throw new IllegalArgumentException("Sort not supported");
            }
        }


        return criteriaBuilder.and(predicateList.toArray(new Predicate[0]));
    }

}