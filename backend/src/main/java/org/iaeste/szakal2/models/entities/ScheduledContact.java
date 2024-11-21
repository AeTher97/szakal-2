package org.iaeste.szakal2.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Table(name = "scheduled_contacts")
public class ScheduledContact {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne
    @JsonIgnoreProperties(value = {"contactJourneys", "updatedBy", "address"})
    private Company company;

    @ManyToOne
    @Setter
    @JsonIgnoreProperties(value = {"roles"})
    private User user;

    @Setter
    private LocalDateTime reminderDate;
    @Setter
    private LocalDateTime contactDate;

    @Setter
    private String note;
}
