package org.iaeste.szakal2.repositories;

import jakarta.persistence.criteria.*;
import org.iaeste.szakal2.models.dto.SzakalSort;
import org.iaeste.szakal2.models.dto.user.UserSearchDTO;
import org.iaeste.szakal2.models.entities.Role;
import org.iaeste.szakal2.models.entities.User;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class UserSpecification implements Specification<User> {

    private final UserSearchDTO criteria;

    public UserSpecification(UserSearchDTO criteria) {
        this.criteria = criteria;
    }

    @Override
    public Predicate toPredicate(Root<User> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        List<Predicate> predicates = new ArrayList<>();

        if (criteria.getName() != null && !criteria.getName().isEmpty()) {
            String fullName = criteria.getName().toLowerCase();
            Predicate namePredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("name")),
                    wrapWithPercent(fullName));
            Predicate surnamePredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("surname")),
                    wrapWithPercent(fullName));
            Predicate fullNamePredicate = criteriaBuilder.like(criteriaBuilder.lower(
                            criteriaBuilder.concat(root.get("name"), criteriaBuilder.concat(" ", root.get("surname")))),
                    wrapWithPercent(fullName));
            predicates.add(criteriaBuilder.or(namePredicate, surnamePredicate, fullNamePredicate));
        }

        if (criteria.getCommittee() != null && !criteria.getCommittee().isEmpty()) {
            predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("committee")),
                    wrapWithPercent(criteria.getCommittee().toLowerCase())));
        }

        if (criteria.getRole() != null && !criteria.getRole().isEmpty()) {
            Join<User, Role> rolesJoin = root.join("roles");
            predicates.add(criteriaBuilder.like(criteriaBuilder.lower(rolesJoin.get("name")),
                    wrapWithPercent(criteria.getRole().toLowerCase())));
        }

        if (criteria.getSzakalSort() != null) {
            boolean asc = criteria.getSzakalSort().getSortDirection().equals(SzakalSort.SortDirection.ASC);
            query.orderBy(asc ? criteriaBuilder.asc(criteriaBuilder.concat(root.get("name"),
                    criteriaBuilder.concat(" ", root.get("surname")))) :
                    criteriaBuilder.desc(criteriaBuilder.concat(root.get("name"),
                            criteriaBuilder.concat(" ", root.get("surname")))));
        }

        return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
    }

    private String wrapWithPercent(String value) {
        return "%" + value + "%";
    }
}