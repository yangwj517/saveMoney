package com.zanqian.savemoney.service.impl;

import com.zanqian.savemoney.common.ErrorCode;
import com.zanqian.savemoney.common.exception.BusinessException;
import com.zanqian.savemoney.dto.ReminderRequest;
import com.zanqian.savemoney.dto.ReminderSettingsRequest;
import com.zanqian.savemoney.dto.ReminderUpdateRequest;
import com.zanqian.savemoney.entity.Category;
import com.zanqian.savemoney.entity.Reminder;
import com.zanqian.savemoney.entity.ReminderSettings;
import com.zanqian.savemoney.repository.CategoryRepository;
import com.zanqian.savemoney.repository.ReminderRepository;
import com.zanqian.savemoney.repository.ReminderSettingsRepository;
import com.zanqian.savemoney.service.ReminderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 提醒业务实现类
 *
 * 实现提醒相关的业务逻辑：
 * - 获取提醒列表
 * - 创建提醒
 * - 更新提醒
 * - 删除提醒
 * - 获取提醒全局设置
 * - 更新提醒全局设置
 */
@Service
public class ReminderServiceImpl implements ReminderService {

    private final ReminderRepository reminderRepository;
    private final ReminderSettingsRepository settingsRepository;
    private final CategoryRepository categoryRepository;

    public ReminderServiceImpl(ReminderRepository reminderRepository,
                                ReminderSettingsRepository settingsRepository,
                                CategoryRepository categoryRepository) {
        this.reminderRepository = reminderRepository;
        this.settingsRepository = settingsRepository;
        this.categoryRepository = categoryRepository;
    }

    /**
     * 获取提醒列表
     *
     * @param userId 用户ID
     * @return 用户的所有提醒列表
     */
    @Override
    public List<Map<String, Object>> getReminders(String userId) {
        return reminderRepository.findByUserId(userId).stream()
                .map(this::toMap).collect(Collectors.toList());
    }

    /**
     * 创建提醒
     *
     * @param userId 用户ID
     * @param request 提醒创建请求
     * @return 创建后的提醒信息
     */
    @Override
    @Transactional
    public Map<String, Object> createReminder(String userId, ReminderRequest request) {
        Reminder reminder = new Reminder();
        reminder.setUserId(userId);
        reminder.setName(request.getName());
        reminder.setAmount(request.getAmount());
        reminder.setDueDay(request.getDueDay());
        reminder.setCategoryId(request.getCategoryId());
        // 如果未指定状态，默认启用
        reminder.setIsEnabled(request.getIsEnabled() != null ? request.getIsEnabled() : true);
        reminder.setNote(request.getNote());
        reminderRepository.save(reminder);
        return toMap(reminder);
    }

    /**
     * 更新提醒
     *
     * 支持部分更新，只更新非null的字段
     *
     * @param userId 用户ID
     * @param id 提醒ID
     * @param request 提醒更新请求
     * @return 更新后的提醒信息
     * @throws BusinessException 如果提醒不存在或无权操作
     */
    @Override
    @Transactional
    public Map<String, Object> updateReminder(String userId, String id, ReminderUpdateRequest request) {
        Reminder reminder = reminderRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND, "提醒不存在"));

        // 权限验证：只能修改属于自己的提醒
        if (!reminder.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        // 选择性更新提醒信息
        if (request.getName() != null) reminder.setName(request.getName());
        if (request.getAmount() != null) reminder.setAmount(request.getAmount());
        if (request.getDueDay() != null) reminder.setDueDay(request.getDueDay());
        if (request.getIsEnabled() != null) reminder.setIsEnabled(request.getIsEnabled());
        if (request.getNote() != null) reminder.setNote(request.getNote());
        reminderRepository.save(reminder);
        return toMap(reminder);
    }

    /**
     * 删除提醒
     *
     * @param userId 用户ID
     * @param id 提醒ID
     * @throws BusinessException 如果提醒不存在或无权操作
     */
    @Override
    @Transactional
    public void deleteReminder(String userId, String id) {
        Reminder reminder = reminderRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND, "提醒不存在"));

        // 权限验证：只能删除属于自己的提醒
        if (!reminder.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        reminderRepository.delete(reminder);
    }

    /**
     * 获取提醒全局设置
     *
     * 如果用户尚未设置，返回默认配置
     *
     * @param userId 用户ID
     * @return 提醒设置信息
     */
    @Override
    public Map<String, Object> getSettings(String userId) {
        ReminderSettings settings = settingsRepository.findByUserId(userId)
                .orElseGet(() -> {
                    // 初始化默认设置
                    ReminderSettings defaultSettings = new ReminderSettings();
                    defaultSettings.setUserId(userId);
                    defaultSettings.setBillReminder(true);
                    defaultSettings.setBillReminderTime("09:00");
                    defaultSettings.setSavingsReminder(true);
                    defaultSettings.setSavingsReminderTime("20:00");
                    defaultSettings.setBudgetAlert(true);
                    defaultSettings.setBudgetAlertThreshold(80);
                    return settingsRepository.save(defaultSettings);
                });
        return toSettingsMap(settings);
    }

    /**
     * 更新提醒全局设置
     *
     * 支持部分更新，只更新非null的字段
     *
     * @param userId 用户ID
     * @param request 设置更新请求
     * @return 更新后的设置信息
     */
    @Override
    @Transactional
    public Map<String, Object> updateSettings(String userId, ReminderSettingsRequest request) {
        ReminderSettings settings = settingsRepository.findByUserId(userId)
                .orElseGet(() -> {
                    ReminderSettings s = new ReminderSettings();
                    s.setUserId(userId);
                    return s;
                });

        // 选择性更新设置信息
        if (request.getBillReminder() != null) settings.setBillReminder(request.getBillReminder());
        if (request.getBillReminderTime() != null) settings.setBillReminderTime(request.getBillReminderTime());
        if (request.getSavingsReminder() != null) settings.setSavingsReminder(request.getSavingsReminder());
        if (request.getSavingsReminderTime() != null) settings.setSavingsReminderTime(request.getSavingsReminderTime());
        if (request.getBudgetAlert() != null) settings.setBudgetAlert(request.getBudgetAlert());
        if (request.getBudgetAlertThreshold() != null) settings.setBudgetAlertThreshold(request.getBudgetAlertThreshold());
        settingsRepository.save(settings);
        return toSettingsMap(settings);
    }

    /**
     * 将Reminder实体转换为Map格式
     *
     * @param r 提醒实体
     * @return 提醒信息Map
     */
    private Map<String, Object> toMap(Reminder r) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", r.getId());
        map.put("name", r.getName());
        map.put("amount", r.getAmount());
        map.put("dueDay", r.getDueDay());
        map.put("categoryId", r.getCategoryId());

        // 获取关联的分类信息
        if (r.getCategoryId() != null) {
            Optional<Category> cat = categoryRepository.findById(r.getCategoryId());
            if (cat.isPresent()) {
                Map<String, Object> catMap = new LinkedHashMap<>();
                catMap.put("id", cat.get().getId());
                catMap.put("name", cat.get().getName());
                catMap.put("icon", cat.get().getIcon());
                catMap.put("color", cat.get().getColor());
                map.put("category", catMap);
            } else {
                map.put("category", null);
            }
        } else {
            map.put("category", null);
        }

        map.put("isEnabled", r.getIsEnabled());
        map.put("note", r.getNote());
        map.put("createdAt", r.getCreatedAt() != null ? r.getCreatedAt().toString() : null);
        return map;
    }

    /**
     * 将ReminderSettings实体转换为Map格式
     *
     * @param s 提醒设置实体
     * @return 设置信息Map
     */
    private Map<String, Object> toSettingsMap(ReminderSettings s) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("billReminder", s.getBillReminder());
        map.put("billReminderTime", s.getBillReminderTime());
        map.put("savingsReminder", s.getSavingsReminder());
        map.put("savingsReminderTime", s.getSavingsReminderTime());
        map.put("budgetAlert", s.getBudgetAlert());
        map.put("budgetAlertThreshold", s.getBudgetAlertThreshold());
        return map;
    }
}
