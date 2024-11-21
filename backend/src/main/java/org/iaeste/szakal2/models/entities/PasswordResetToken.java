package org.iaeste.szakal2.models.entities;


import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.UUID;

@Table(name = "password_reset_tokens")
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private static final int EXPIRATION = 24 * 60 * 60 * 1000;
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
