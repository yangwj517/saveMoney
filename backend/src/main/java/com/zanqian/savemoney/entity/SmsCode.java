package com.zanqian.savemoney.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;

/**
 * 短信验证码实体类
 *
 * 存储发送给用户的短信验证码
 * 用于手机号登录验证
 */
@Data
@Entity
@Table(name = "sms_codes")
public class SmsCode {
    /** 记录ID（主键），使用UUID自动生成 */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    /** 手机号 */
    private String phone;

    /** 验证码 */
    private String code;

    /** 验证码过期时间 */
    private Instant expireAt;

    /** 是否已使用 */
    private Boolean used;
}
