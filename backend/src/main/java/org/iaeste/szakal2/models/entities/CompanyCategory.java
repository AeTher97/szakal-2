package org.iaeste.szakal2.models.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Entity
@Getter
@Table(name = "categories")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CompanyCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Setter
    @NotNull
    private String name;
}
