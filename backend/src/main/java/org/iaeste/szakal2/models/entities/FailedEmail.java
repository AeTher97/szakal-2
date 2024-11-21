package org.iaeste.szakal2.models.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.UUID;

@Table(name = "failed_emails")
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FailedEmail {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;
    @Column(length = 5000)
    private String content;
    private String recipient;
    private String subject;
    private Date date;
}