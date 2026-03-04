package com.zanqian.savemoney.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SourceType;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * 储蓄记录实体类
 *
 * 记录对储蓄目标的单次存取操作
 */
@Data
@Entity
@Table(name = "savings_deposits")
public class SavingsDeposit {
    /** 记录ID（主键），使用UUID自动生成 */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    /** 所属储蓄目标ID */
    private String goalId;

    /** 存取金额（正数为存入，负数为提取） */
    @Column(precision = 12, scale = 2)
    private BigDecimal amount;

    /** 备注 */
    private String note;

    /** 创建时间，记录存取操作时间 */
    @UpdateTimestamp(source = SourceType.DB)    // 从数据库获取时间
    private Instant createdAt;
}
