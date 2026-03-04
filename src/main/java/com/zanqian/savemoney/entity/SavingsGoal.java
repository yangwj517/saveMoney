package com.zanqian.savemoney.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SourceType;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/**
 * 储蓄目标实体类
 *
 * 记录用户的储蓄计划和目标
 * 追踪目标进度，支持存取操作
 */
@Data
@Entity
@Table(name = "savings_goals")
public class SavingsGoal {
    /** 目标ID（主键），使用UUID自动生成 */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    /** 所属用户ID */
    private String userId;

    /** 目标名称（如"购买电脑"、"旅游基金"等） */
    private String name;

    /** 目标金额 */
    @Column(precision = 12, scale = 2)
    private BigDecimal targetAmount;

    /** 当前已存入金额 */
    @Column(precision = 12, scale = 2)
    private BigDecimal currentAmount;

    /** 所属账簿类型 */
    private String bookType;

    /** 目标截止日期 */
    private LocalDate deadline;

    /** 目标图标 */
    private String icon;

    /** 目标颜色 */
    private String color;

    /** 目标封面图片 */
    private String coverImage;

    /** 是否已完成 */
    private Boolean isCompleted;

    /** 创建时间 */
    @UpdateTimestamp(source = SourceType.DB)    // 从数据库获取时间
    private Instant createdAt;

    /** 更新时间 */
    @UpdateTimestamp(source = SourceType.DB)    // 从数据库获取时间
    private Instant updatedAt;
}
