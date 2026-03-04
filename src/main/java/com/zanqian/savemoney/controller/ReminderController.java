package com.zanqian.savemoney.controller;

import com.zanqian.savemoney.common.ApiResponse;
import com.zanqian.savemoney.dto.ReminderRequest;
import com.zanqian.savemoney.dto.ReminderSettingsRequest;
import com.zanqian.savemoney.dto.ReminderUpdateRequest;
import com.zanqian.savemoney.service.ReminderService;
import jakarta.validation.Valid;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 提醒控制器
 *
 * 处理提醒相关操作：
 * - 获取提醒列表
 * - 创建提醒
 * - 修改提醒
 * - 删除提醒
 * - 获取提醒设置
 * - 修改提醒设置
 *
 * 提醒用于通知用户关于待支付账单、储蓄进度等信息
 */
@RestController
@RequestMapping("/reminders")
public class ReminderController {

    private final ReminderService reminderService;

    public ReminderController(ReminderService reminderService) {
        this.reminderService = reminderService;
    }

    /**
     * 获取提醒列表
     *
     * 获取当前用户的所有提醒
     *
     * @return 提醒列表
     */
    @GetMapping
    public ApiResponse<List<Map<String, Object>>> getReminders() {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(reminderService.getReminders(userId));
    }

    /**
     * 创建提醒
     *
     * 创建新的提醒
     *
     * @param request 包含提醒信息的请求（名称、金额、提醒日期等）
     * @return 创建后的提醒信息
     */
    @PostMapping
    public ApiResponse<Map<String, Object>> createReminder(@Valid @RequestBody ReminderRequest request) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(reminderService.createReminder(userId, request));
    }

    /**
     * 更新提醒
     *
     * 修改指定提醒的信息
     *
     * @param id 提醒ID
     * @param request 包含更新信息的请求
     * @return 更新后的提醒信息
     */
    @PutMapping("/{id}")
    public ApiResponse<Map<String, Object>> updateReminder(@PathVariable String id,
                                                            @Valid @RequestBody ReminderUpdateRequest request) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(reminderService.updateReminder(userId, id, request));
    }

    /**
     * 删除提醒
     *
     * 删除指定的提醒
     *
     * @param id 提醒ID
     * @return 删除成功响应
     */
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteReminder(@PathVariable String id) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        reminderService.deleteReminder(userId, id);
        return ApiResponse.success();
    }

    /**
     * 获取提醒设置
     *
     * 获取用户的提醒全局设置（如账单提醒时间、储蓄提醒时间等）
     *
     * @return 提醒设置信息
     */
    @GetMapping("/settings")
    public ApiResponse<Map<String, Object>> getSettings() {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(reminderService.getSettings(userId));
    }

    /**
     * 修改提醒设置
     *
     * 更新用户的提醒全局设置
     *
     * @param request 包含新的设置信息的请求
     * @return 更新后的设置信息
     */
    @PutMapping("/settings")
    public ApiResponse<Map<String, Object>> updateSettings(@Valid @RequestBody ReminderSettingsRequest request) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(reminderService.updateSettings(userId, request));
    }
}
