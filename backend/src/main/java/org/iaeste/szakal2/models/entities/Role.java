package org.iaeste.szakal2.models.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Table(name = "roles")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@NamedEntityGraph(name = "Role.details",
        attributeNodes = {
                @NamedAttributeNode("accessRights")
        }
)
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Setter
    private String name;
    @Setter
    private String description;
    @Setter
    private String sortOrder;
    @Setter
    private String isLocal;
    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.MERGE)
    @JoinTable(name = "access_rights_roles",
            joinColumns = @JoinColumn(name = "role_id"),
            inverseJoinColumns = @JoinColumn(name = "access_rights_id")
    )
    @Setter
    private List<AccessRight> accessRights;

}
