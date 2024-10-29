package org.iaeste.szakal2.models.dto.company;

import lombok.Builder;
import lombok.Data;
import org.iaeste.szakal2.models.dto.journey.ContactJourneyCompanyDetailsDTO;
import org.iaeste.szakal2.models.entities.Address;
import org.iaeste.szakal2.models.entities.Company;
import org.iaeste.szakal2.models.entities.CompanyCategory;
import org.iaeste.szakal2.models.entities.ContactPerson;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Builder
@Data
public class CompanyDetailsDTO {

    private UUID id;
    private String name;
    private Address address;
    private String phone;
    private String fax;
    private String www;
    private String email;
    private Set<ContactPerson> contactPeople;
    private Set<CompanyCategory> categories;
    private Set<ContactJourneyCompanyDetailsDTO> contactJourneys;
    private LocalDateTime insertDate;
    private boolean deleted;

    public static CompanyDetailsDTO fromCompany(Company company) {
        return CompanyDetailsDTO.builder()
                .id(company.getId())
                .address(company.getAddress())
                .name(company.getName())
                .phone(company.getPhone())
                .fax(company.getFax())
                .www(company.getWww())
                .email(company.getEmail())
                .contactPeople(company.getContactPeople())
                .categories(company.getCategories())
                .contactJourneys(company.getContactJourneys().stream().map(ContactJourneyCompanyDetailsDTO::fromContactJourney)
                        .collect(Collectors.toSet()))
                .insertDate(company.getInsertDate())
                .deleted(company.isDeleted())
                .build();
    }
}
