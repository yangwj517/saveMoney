package com.zanqian.savemoney.service;

import com.zanqian.savemoney.dto.ReminderRequest;
import com.zanqian.savemoney.dto.ReminderSettingsRequest;
import com.zanqian.savemoney.dto.ReminderUpdateRequest;
import java.util.List;
import java.util.Map;

/**
 * 提醒服务接口
 *
 * 定义提醒相关的业务逻辑
 */
public interface ReminderService {
    /**
     * 获取提醒列表
     *
     * @param userId 用户ID
     * @return 提醒列表
     */
    List<Map<String, Object>> getReminders(String userId);

    /**
     * 创建提醒
     *
     * @param userId 用户ID
     * @param request 创建请求
     * @return 创建后的提醒信息
     */
    Map<String, Object> createReminder(String userId, ReminderRequest request);

    /**
     * 更新提醒
     *
     * @param userId 用户ID
     * @param id 提醒ID
     * @param request 更新请求
     * @return 更新后的提醒信息
     */
    Map<String, Object> updateReminder(String userId, String id, ReminderUpdateRequest request);

    /**
     * 删除提醒
     *
     * @param userId 用户ID
     * @param id 提醒ID
     */
    void deleteReminder(String userId, String id);

    /**
     * 获取提醒设置
     *
     * @param userId 用户ID
     * @return 提醒设置信息
     */
    Map<String, Object> getSettings(String userId);

    /**
     * 更新提醒设置
     *
     * @param userId 用户ID
     * @param request 设置更新请求
     * @return 更新后的设置信息
     */
    Map<String, Object> updateSettings(String userId, ReminderSettingsRequest request);
}
