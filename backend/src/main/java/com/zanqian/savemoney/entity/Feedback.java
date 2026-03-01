package com.zanqian.savemoney.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.Instant;

@Data
@Entity
@Table(name = "feedbacks")
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String userId;
    private String type;

    @Column(length = 2000)
    private String content;

    private String contact;

    @Column(length = 2000)
    private String images;

    private String status;

    @CreationTimestamp
    private Instant createdAt;
}
