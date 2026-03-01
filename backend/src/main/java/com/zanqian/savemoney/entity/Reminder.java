package com.zanqian.savemoney.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.Instant;

@Data
@Entity
@Table(name = "reminders")
public class Reminder {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String userId;
    private String name;

    @Column(precision = 12, scale = 2)
    private BigDecimal amount;

    private Integer dueDay;
    private String categoryId;
    private Boolean isEnabled;
    private String note;

    @CreationTimestamp
    private Instant createdAt;
}
