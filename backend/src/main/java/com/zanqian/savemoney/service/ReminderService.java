package com.zanqian.savemoney.service;

import com.zanqian.savemoney.dto.ReminderRequest;
import com.zanqian.savemoney.dto.ReminderSettingsRequest;
import com.zanqian.savemoney.dto.ReminderUpdateRequest;
import java.util.List;
import java.util.Map;

public interface ReminderService {
    List<Map<String, Object>> getReminders(String userId);
    Map<String, Object> createReminder(String userId, ReminderRequest request);
    Map<String, Object> updateReminder(String userId, String id, ReminderUpdateRequest request);
    void deleteReminder(String userId, String id);
    Map<String, Object> getSettings(String userId);
    Map<String, Object> updateSettings(String userId, ReminderSettingsRequest request);
}
