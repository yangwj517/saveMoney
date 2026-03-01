package com.zanqian.savemoney.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.Instant;

@Data
@Entity
@Table(name = "savings_deposits")
public class SavingsDeposit {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String goalId;

    @Column(precision = 12, scale = 2)
    private BigDecimal amount;

    private String note;

    @CreationTimestamp
    private Instant createdAt;
}
