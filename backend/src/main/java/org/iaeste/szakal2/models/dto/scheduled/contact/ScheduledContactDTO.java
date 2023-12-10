package org.iaeste.szakal2.models.dto.scheduled.contact;

import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.iaeste.szakal2.models.entities.Company;
import org.iaeste.szakal2.models.entities.User;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ScheduledContactDTO {

    @NotNull
    private UUID company;

    @NotNull
    private UUID user;

    @NotNull
    private LocalDateTime reminderDate;

    private String note;
}
