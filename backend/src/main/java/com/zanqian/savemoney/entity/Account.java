package com.zanqian.savemoney.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.Instant;

@Data
@Entity
@Table(name = "accounts")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String userId;
    private String name;

    @Column(precision = 12, scale = 2)
    private BigDecimal balance;

    private String icon;
    private String color;
    private String bookType;
    private Boolean isDefault;

    @CreationTimestamp
    private Instant createdAt;
}
