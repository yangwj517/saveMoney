package com.zanqian.savemoney.service;

import java.util.Map;

public interface NotificationService {
    Map<String, Object> getNotifications(String userId, Integer page, Integer pageSize, Boolean isRead);
    void markAsRead(String userId, String id);
    void markAllAsRead(String userId);
    void deleteNotification(String userId, String id);
}
