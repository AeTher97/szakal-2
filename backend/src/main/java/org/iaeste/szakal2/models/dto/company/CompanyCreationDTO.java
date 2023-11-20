package org.iaeste.szakal2.models.dto.company;

import jakarta.validation.constraints.NotNull;
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
public class CompanyCreationDTO {

    @NotNull
    private String name;
    private Address address;
    @NotNull
    private String phone;
    private String fax;
    private String www;
    @NotNull
    private String email;
    private List<UUID> categories;
}
