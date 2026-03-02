package com.zanqian.savemoney.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.Instant;

/**
 * 提醒实体类
 *
 * 记录用户的待办提醒事项
 * 如待支付账单、定期支出提醒等
 */
@Data
@Entity
@Table(name = "reminders")
public class Reminder {
    /** 提醒ID（主键），使用UUID自动生成 */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    /** 所属用户ID */
    private String userId;

    /** 提醒名称（如"房租"、"电费"等） */
    private String name;

    /** 提醒金额 */
    @Column(precision = 12, scale = 2)
    private BigDecimal amount;

    /** 每月提醒日期（1-31） */
    private Integer dueDay;

    /** 关联分类ID */
    private String categoryId;

    /** 是否启用该提醒 */
    private Boolean isEnabled;

    /** 提醒备注 */
    private String note;

    /** 创建时间 */
    @CreationTimestamp
    private Instant createdAt;
}
