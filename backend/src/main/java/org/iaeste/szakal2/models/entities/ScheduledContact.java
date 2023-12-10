package org.iaeste.szakal2.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

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
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne
    @JsonIgnoreProperties(value = {"contactJourneys", "updatedBy"})
    private Company company;

    @ManyToOne
    @Setter
    @JsonIgnoreProperties(value = {"roles"})
    private User user;

    @Setter
    private LocalDateTime reminderDate;

    @Setter
    private String note;
}
