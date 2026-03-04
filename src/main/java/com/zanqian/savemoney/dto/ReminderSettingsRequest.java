package com.zanqian.savemoney.dto;

import lombok.Data;

/**
 * 提醒设置更新请求DTO
 */
@Data
public class ReminderSettingsRequest {
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
