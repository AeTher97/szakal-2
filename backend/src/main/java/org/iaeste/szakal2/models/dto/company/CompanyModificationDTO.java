package org.iaeste.szakal2.models.dto.company;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.iaeste.szakal2.models.entities.Address;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CompanyModificationDTO {

    private String name;
    private Address address;
    private String phone;
    private String fax;
    private String www;
    private String email;
    private List<UUID> categories;
}
