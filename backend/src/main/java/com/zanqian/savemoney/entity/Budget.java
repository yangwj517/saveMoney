package com.zanqian.savemoney.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

/**
 * 预算实体类
 *
 * 为用户设定支出预算，并监控预算使用情况
 */
@Data
@Entity
@Table(name = "budgets")
public class Budget {
    /** 预算ID（主键），使用UUID自动生成 */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    /** 所属用户ID */
    private String userId;

    /** 预算分类ID */
    private String categoryId;

    /** 预算额度 */
    @Column(precision = 12, scale = 2)
    private BigDecimal amount;

    /** 已使用额度 */
    @Column(precision = 12, scale = 2)
    private BigDecimal usedAmount;

    /** 预算周期（"monthly"月度、"yearly"年度等） */
    private String period;

    /** 所属账簿类型 */
    private String bookType;

    /** 预算提醒阈值（百分比，如80表示达到80%时提醒） */
    private Integer alertThreshold;

    /** 是否启用预算提醒 */
    private Boolean isAlertEnabled;
}
