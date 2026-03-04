package com.zanqian.savemoney.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SourceType;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * 账户实体类
 *
 * 代表用户的一个资金账户（如现金、银行卡、支付宝等）
 * 用于记录和管理账单
 */
@Data
@Entity
@Table(name = "accounts")
public class Account {
    /** 账户ID（主键），使用UUID自动生成 */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    /** 所属用户ID */
    private String userId;

    /** 账户名称（如"支付宝"、"工资卡"等） */
    private String name;

    /** 账户余额 */
    @Column(precision = 12, scale = 2)
    private BigDecimal balance;

    /** 账户图标 */
    private String icon;

    /** 账户颜色 */
    private String color;

    /** 所属账簿类型（如"personal"个人账簿、"family"家庭账簿等） */
    private String bookType;

    /** 是否为默认账户 */
    private Boolean isDefault;

    /** 创建时间，记录账户创建时间 */
    @UpdateTimestamp(source = SourceType.DB)    // 从数据库获取时间
    private Instant createdAt;
}
