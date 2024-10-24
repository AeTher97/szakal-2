package org.iaeste.szakal2.models.dto.company;

import lombok.Builder;
import lombok.Data;
import org.iaeste.szakal2.models.entities.Company;

import java.util.UUID;

@Data
@Builder
public class CompanyMinimalDTO {

    private UUID id;
    private String name;

    public static CompanyMinimalDTO fromCompany(Company company) {
        return CompanyMinimalDTO.builder()
                .id(company.getId())
                .name(company.getName())
                .build();
    }
}
