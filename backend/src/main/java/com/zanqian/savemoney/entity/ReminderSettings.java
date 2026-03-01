package com.zanqian.savemoney.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "reminder_settings")
public class ReminderSettings {
    @Id
    private String userId;

    private Boolean billReminder;
    private String billReminderTime;
    private Boolean savingsReminder;
    private String savingsReminderTime;
    private Boolean budgetAlert;
    private Integer budgetAlertThreshold;
}
