package org.iaeste.szakal2.models.dto.campaign;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CampaignCreationDTO {

    @NotNull
    private String name;
    @NotNull
    private LocalDate startDate;
    private String description;
}
