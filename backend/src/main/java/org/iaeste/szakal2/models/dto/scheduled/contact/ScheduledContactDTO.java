package org.iaeste.szakal2.models.dto.scheduled.contact;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    @NotNull
    private LocalDateTime contactDate;

    private String note;
}
