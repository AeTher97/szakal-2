package org.iaeste.szakal2.models.dto.company;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.iaeste.szakal2.models.entities.Address;
import org.iaeste.szakal2.models.entities.Company;
import org.iaeste.szakal2.models.entities.CompanyCategory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

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
    private List<CompanyCategory> categories;

    public static CompanyListingDTO fromCompany(Company company) {
        return builder()
                .id(company.getId())
                .name(company.getName())
                .address(company.getAddress())
                .phone(company.getPhone())
                .www(company.getWww())
                .email(company.getEmail())
                .insertDate(company.getInsertDate())
                .categories(company.getCategories())
                .build();
    }
}
