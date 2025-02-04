package org.iaeste.szakal2.models.dto.journey;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ContactEventEditDTO {

    @NotNull
    private UUID eventId;
    @NotNull
    private String description;
    @NotNull
    private String contactStatus;
    private UUID contactPerson;
    @NotNull
    private UUID user;
}