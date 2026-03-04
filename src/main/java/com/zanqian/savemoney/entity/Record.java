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
 * 账单记录实体类
 *
 * 记录一笔具体的收入或支出账单
 */
@Data
@Entity
@Table(name = "records")
public class Record {
    /** 记录ID（主键），使用UUID自动生成 */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    /** 所属用户ID */
    private String userId;

    /** 账单金额 */
    @Column(precision = 12, scale = 2)
    private BigDecimal amount;

    /** 账单类型（"income"收入或"expense"支出） */
    private String type;

    /** 分类ID */
    private String categoryId;

    /** 账户ID */
    private String accountId;

    /** 所属账簿类型 */
    private String bookType;

    /** 账单日期 */
    private LocalDate date;

    /** 账单备注 */
    private String note;

    /** 账单附图，存储多个图片URL（JSON格式） */
    @Column(length = 2000)
    private String images;

    /** 创建时间 */
    @CreationTimestamp(source = SourceType.DB)  // 从数据库获取时间
    @Column(updatable = false)
    private Instant createdAt;

    /** 更新时间 */
    @UpdateTimestamp(source = SourceType.DB)    // 从数据库获取时间
    private Instant updatedAt;
}
