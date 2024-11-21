package org.iaeste.szakal2.models.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Getter
@Table(name = "application_settings")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ApplicationSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    @Setter
    private String value;
}
