package org.iaeste.szakal2.models.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;
import org.iaeste.szakal2.models.AccessRight;

import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Table(name = "roles")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Role {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator")
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
