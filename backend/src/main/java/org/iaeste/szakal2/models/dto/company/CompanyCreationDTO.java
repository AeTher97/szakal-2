package org.iaeste.szakal2.models.dto.company;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.iaeste.szakal2.models.entities.Address;
import org.iaeste.szakal2.models.entities.CompanyCategory;
import org.iaeste.szakal2.models.entities.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CompanyCreationDTO {

    @NotNull
    private String name;
    @NotNull
    private Address address;
    @NotNull
    private String phone;
    @NotNull
    private String fax;
    @NotNull
    private String www;
    @NotNull
    private String  email;
    @NotEmpty
    private List<UUID> categories;
}
