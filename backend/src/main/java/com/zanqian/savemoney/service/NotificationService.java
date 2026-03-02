package com.zanqian.savemoney.service;

import java.util.Map;

/**
 * 通知服务接口
 *
 * 定义通知相关的业务逻辑
 */
public interface NotificationService {
    /**
     * 获取通知列表
     *
     * @param userId 用户ID
     * @param page 页码
     * @param pageSize 每页数量
     * @param isRead 读取状态（可选）
     * @return 分页的通知列表
     */
    Map<String, Object> getNotifications(String userId, Integer page, Integer pageSize, Boolean isRead);

    /**
     * 标记单个通知为已读
     *
     * @param userId 用户ID
     * @param id 通知ID
     */
    void markAsRead(String userId, String id);

    /**
     * 标记所有通知为已读
     *
     * @param userId 用户ID
     */
    void markAllAsRead(String userId);

    /**
     * 删除通知
     *
     * @param userId 用户ID
     * @param id 通知ID
     */
    void deleteNotification(String userId, String id);
}
