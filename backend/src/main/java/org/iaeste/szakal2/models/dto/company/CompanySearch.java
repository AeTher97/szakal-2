package org.iaeste.szakal2.models.dto.company;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.iaeste.szakal2.models.entities.ContactStatus;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CompanySearch {
    private String name;
    private UUID campaign;
    private ContactStatus contactStatus;
    private String category;
    private String status;
    private boolean hasAlumni;
    private String alumniDescription;
    private String campaignName;
}
