package com.zanqian.savemoney.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.Instant;

/**
 * 用户实体类
 *
 * 存储用户的基本信息
 */
@Data
@Entity
@Table(name = "users")
public class User {
    /** 用户ID（主键），使用UUID自动生成 */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    /** 用户昵称 */
    private String nickname;

    /** 用户头像URL */
    private String avatar;

    /** 用户手机号 */
    private String phone;

    /** 用户邮箱 */
    private String email;

    /** 创建时间，记录用户注册时间 */
    @CreationTimestamp
    private Instant createdAt;
}
