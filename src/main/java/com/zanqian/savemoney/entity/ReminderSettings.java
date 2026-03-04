package com.zanqian.savemoney.entity;

import jakarta.persistence.*;
import lombok.Data;

/**
 * 提醒设置实体类
 *
 * 存储用户的提醒偏好设置
 */
@Data
@Entity
@Table(name = "reminder_settings")
public class ReminderSettings {
    /** 用户ID（主键），一个用户对应一条设置记录 */
    @Id
    private String userId;

    /** 是否启用账单提醒 */
    private Boolean billReminder;

    /** 账单提醒时间（格式：HH:mm） */
    private String billReminderTime;

    /** 是否启用储蓄提醒 */
    private Boolean savingsReminder;

    /** 储蓄提醒时间（格式：HH:mm） */
    private String savingsReminderTime;

    /** 是否启用预算超额提醒 */
    private Boolean budgetAlert;

    /** 预算提醒阈值（百分比） */
    private Integer budgetAlertThreshold;
}
