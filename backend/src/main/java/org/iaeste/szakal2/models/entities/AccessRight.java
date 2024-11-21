package org.iaeste.szakal2.models.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;


@Entity
@Getter
@Table(name = "access_rights")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AccessRight {


    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String code;
    private String description;
}
