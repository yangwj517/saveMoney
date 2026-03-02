package com.zanqian.savemoney.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.Instant;

/**
 * 用户反馈实体类
 *
 * 记录用户提交的意见、建议、问题报告等反馈信息
 */
@Data
@Entity
@Table(name = "feedbacks")
public class Feedback {
    /** 反馈ID（主键），使用UUID自动生成 */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    /** 反馈用户ID */
    private String userId;

    /** 反馈类型（如"bug"问题、"suggestion"建议、"feature"功能请求等） */
    private String type;

    /** 反馈内容 */
    @Column(length = 2000)
    private String content;

    /** 联系方式（邮箱或电话） */
    private String contact;

    /** 反馈附图，存储多个图片URL（JSON格式） */
    @Column(length = 2000)
    private String images;

    /** 反馈处理状态（"pending"待处理、"processing"处理中、"resolved"已解决等） */
    private String status;

    /** 创建时间，记录反馈提交时间 */
    @CreationTimestamp
    private Instant createdAt;
}
