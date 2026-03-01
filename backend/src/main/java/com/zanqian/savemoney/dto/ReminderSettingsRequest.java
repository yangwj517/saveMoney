package com.zanqian.savemoney.dto;

import lombok.Data;

@Data
public class ReminderSettingsRequest {
    private Boolean billReminder;
    private String billReminderTime;
    private Boolean savingsReminder;
    private String savingsReminderTime;
    private Boolean budgetAlert;
    private Integer budgetAlertThreshold;
}
