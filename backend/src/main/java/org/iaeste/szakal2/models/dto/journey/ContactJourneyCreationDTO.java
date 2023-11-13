package org.iaeste.szakal2.models.dto.journey;

import jakarta.persistence.CascadeType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.*;
import org.iaeste.szakal2.models.entities.*;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ContactJourneyCreationDTO {

    private UUID user;
    private UUID company;
    private UUID campaign;
}
