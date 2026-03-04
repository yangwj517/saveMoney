package com.zanqian.savemoney.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.Instant;

/**
 * 通知实体类
 *
 * 记录发送给用户的各类通知消息
 * 如预算超额提醒、储蓄进度提醒等
 */
@Data
@Entity
@Table(name = "notifications")
public class Notification {
    /** 通知ID（主键），使用UUID自动生成 */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    /** 所属用户ID */
    private String userId;

    /** 通知类型（如"budget_alert"预算超额、"savings_progress"储蓄进度等） */
    private String type;

    /** 通知标题 */
    private String title;

    /** 通知内容 */
    @Column(length = 1000)
    private String content;

    /** 是否已读 */
    private Boolean isRead;

    /** 创建时间 */
    @CreationTimestamp
    private Instant createdAt;
}
