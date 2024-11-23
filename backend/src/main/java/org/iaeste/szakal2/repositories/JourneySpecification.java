package org.iaeste.szakal2.repositories;

import jakarta.persistence.criteria.*;
import org.iaeste.szakal2.models.dto.SzakalSort;
import org.iaeste.szakal2.models.dto.campaign.ContactJourneySearch;
import org.iaeste.szakal2.models.entities.Company;
import org.iaeste.szakal2.models.entities.ContactJourney;
import org.iaeste.szakal2.models.entities.ContactPerson;
import org.iaeste.szakal2.models.entities.ContactStatus;
import org.springframework.data.jpa.domain.Specification;

import java.util.*;

public class JourneySpecification implements Specification<ContactJourney> {

    public static final String COMPANY = "company";
    public static final String SURNAME = "surname";
    public static final String FINISHED = "finished";
    private static final String LAST_INTERACTION = "lastInteraction";
    private final transient ContactJourneySearch criteria;

    public JourneySpecification(ContactJourneySearch criteria) {
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
            predicateList.add(criteriaBuilder.like(criteriaBuilder.lower(root.get(COMPANY).get("name")),
                    wrapWithPercent(criteria.getCompanyName().toLowerCase())));
        }

        if (criteria.getStatus() != null) {
            if (criteria.getStatus().equals("in-progress")) {
                predicateList.add(criteriaBuilder.isFalse(root.get(FINISHED)));
            } else if (criteria.getStatus().equals(FINISHED)) {
                predicateList.add(criteriaBuilder.isTrue(root.get(FINISHED)));
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

        addUserSpecs(root, criteriaBuilder, predicateList);

        if (criteria.getUserId() != null) {
            predicateList.add(criteriaBuilder.equal(root.get("user").get("id"), criteria.getUserId()));
        }

        addSort(root, query, criteriaBuilder);


        return criteriaBuilder.and(predicateList.toArray(new Predicate[0]));
    }

    private void addUserSpecs(Root<ContactJourney> root, CriteriaBuilder criteriaBuilder, List<Predicate> predicateList) {
        if (criteria.getUser() != null) {
            String[] parts = criteria.getUser().toLowerCase().split(" ");
            if (parts.length == 1) {
                predicateList.add(
                        criteriaBuilder.or(
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("user").get("name")),
                                        wrapWithPercent(parts[0])),
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("user").get(SURNAME)),
                                        wrapWithPercent(parts[0])),
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("user").get("email"))
                                        , wrapWithPercent(parts[0]))));
            } else if (parts.length > 1) {
                predicateList.add(
                        criteriaBuilder.or(
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("user").get("name")),
                                        wrapWithPercent(parts[0])),
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("user").get(SURNAME)),
                                        wrapWithPercent(parts[1])),
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("user").get("email")),
                                        wrapWithPercent(parts[0]))));
            }
        }
    }

    private void addSort(Root<ContactJourney> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        if (criteria.getSzakalSort() != null) {
            boolean asc = criteria.getSzakalSort().getSortDirection().equals(SzakalSort.SortDirection.ASC);
            switch (criteria.getSzakalSort().getColumnName()) {
                case "detailedStatus" -> addCases(root, query, criteriaBuilder, asc);
                case "user" -> query.orderBy(asc ? criteriaBuilder.asc(root.get("user").get(SURNAME)) :
                        criteriaBuilder.desc(root.get("user").get(SURNAME)));
                case "companyName" -> query.orderBy(asc ? criteriaBuilder.asc(root.get(COMPANY).get("name")) :
                        criteriaBuilder.desc(root.get(COMPANY).get("name")));
                case "startDate" -> query.orderBy(asc ? criteriaBuilder.asc(root.get("journeyStart")) :
                        criteriaBuilder.desc(root.get("journeyStart")));
                case LAST_INTERACTION -> {
                    final Date minDate = new Date(0L);
                    GregorianCalendar gregorianCalendar = new GregorianCalendar();
                    gregorianCalendar.set(4000, Calendar.JANUARY, 0);
                    final Date maxDate = gregorianCalendar.getTime();

                    Order lastInteractionOrder = asc ?
                            criteriaBuilder.asc(criteriaBuilder.coalesce(root.get(LAST_INTERACTION), maxDate)) :
                            criteriaBuilder.desc(criteriaBuilder.coalesce(root.get(LAST_INTERACTION), minDate));
                    query.orderBy(lastInteractionOrder);
                }
                default -> throw new IllegalArgumentException("Sort not supported");
            }
        }
    }

}