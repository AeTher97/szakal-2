package org.iaeste.szakal2.models.dto.company;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.iaeste.szakal2.models.dto.journey.ContactJourneyMinimalDTO;
import org.iaeste.szakal2.models.entities.Address;
import org.iaeste.szakal2.models.entities.Company;
import org.iaeste.szakal2.models.entities.CompanyCategory;
import org.iaeste.szakal2.models.entities.ContactJourney;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CompanyListingDTO {

    private UUID id;
    private String name;
    private Address address;
    private String phone;
    private String www;
    private String email;
    private LocalDateTime insertDate;
    private Set<CompanyCategory> categories;
    private Set<ContactJourneyMinimalDTO> contactJourneys;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonIgnoreProperties(value = {"company", "campaign", "contactEvents"})
    private ContactJourneyMinimalDTO currentJourney;

    public static CompanyListingDTO fromCompany(Company company) {
        return fromCompany(company, null);
    }

    public static CompanyListingDTO fromCompany(Company company, UUID currentCampaign) {
        return builder()
                .id(company.getId())
                .name(company.getName())
                .address(company.getAddress())
                .phone(company.getPhone())
                .www(company.getWww())
                .email(company.getEmail())
                .insertDate(company.getInsertDate())
                .categories(company.getCategories())
                .contactJourneys(company.getContactJourneys().stream()
                        .map(ContactJourneyMinimalDTO::fromContactJourney).collect(Collectors.toSet()))
                .currentJourney(currentCampaign == null ? null :
                        company.getContactJourneys().stream()
                                .filter(contactJourney -> contactJourney.getCampaign().getId().equals(currentCampaign))
                                .findAny().map(ContactJourneyMinimalDTO::fromContactJourney).orElse(null))
                .build();
    }
}
