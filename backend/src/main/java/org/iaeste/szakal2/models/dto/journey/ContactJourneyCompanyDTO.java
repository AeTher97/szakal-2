package org.iaeste.szakal2.models.dto.journey;

import lombok.Builder;
import lombok.Data;
import org.iaeste.szakal2.models.dto.company.ContactPersonMinimalDTO;
import org.iaeste.szakal2.models.entities.Address;
import org.iaeste.szakal2.models.entities.Company;
import org.iaeste.szakal2.models.entities.CompanyCategory;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@Builder
public class ContactJourneyCompanyDTO {

    private UUID id;
    private String name;
    private Address address;
    private String phone;
    private String www;
    private String email;
    private Set<ContactPersonMinimalDTO> contactPeople;
    private Set<CompanyCategory> categories;

    public static ContactJourneyCompanyDTO fromCompany(Company company) {
        return builder()
                .id(company.getId())
                .name(company.getName())
                .address(company.getAddress())
                .phone(company.getPhone())
                .www(company.getWww())
                .email(company.getEmail())
                .contactPeople(company.getContactPeople().stream().map(ContactPersonMinimalDTO::from).collect(Collectors.toSet()))
                .categories(company.getCategories())
                .build();
    }
}
