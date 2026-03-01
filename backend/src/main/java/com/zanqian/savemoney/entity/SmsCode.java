package com.zanqian.savemoney.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;

@Data
@Entity
@Table(name = "sms_codes")
public class SmsCode {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String phone;
    private String code;
    private Instant expireAt;
    private Boolean used;
}
