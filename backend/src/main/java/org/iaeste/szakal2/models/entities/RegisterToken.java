package org.iaeste.szakal2.models.entities;


import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.UUID;

@Table(name = "register_tokens")
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterToken {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Getter
    private String token;
    @Getter
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "user_id")
    private User user;
    @Getter
    private Date expiryDate;

    public boolean isExpired() {
        return expiryDate.before(new Date());
    }

}
