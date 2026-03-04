package com.zanqian.savemoney.controller;

import com.zanqian.savemoney.common.ApiResponse;
import com.zanqian.savemoney.service.NotificationService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 通知控制器
 *
 * 处理用户通知相关操作：
 * - 获取通知列表（支持分页和状态筛选）
 * - 标记单个通知为已读
 * - 标记全部通知为已读
 * - 删除通知
 *
 * 通知用于通知用户各类系统事件、预算提醒、储蓄进度等
 */
@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    /**
     * 获取通知列表
     *
     * 获取用户的通知列表，支持按读/未读状态筛选
     *
     * @param page 页码（默认1）
     * @param pageSize 每页数量（默认20）
     * @param isRead 读取状态（可选，true为已读，false为未读）
     * @return 分页的通知列表
     */
    @GetMapping
    public ApiResponse<Map<String, Object>> getNotifications(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer pageSize,
            @RequestParam(required = false) Boolean isRead) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(notificationService.getNotifications(userId, page, pageSize, isRead));
    }

    /**
     * 标记单个通知为已读
     *
     * 将指定的通知标记为已读状态
     *
     * @param id 通知ID
     * @return 标记成功响应
     */
    @PutMapping("/{id}/read")
    public ApiResponse<Void> markAsRead(@PathVariable String id) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        notificationService.markAsRead(userId, id);
        return ApiResponse.success();
    }

    /**
     * 标记全部通知为已读
     *
     * 将用户的所有未读通知标记为已读
     *
     * @return 标记成功响应
     */
    @PutMapping("/read-all")
    public ApiResponse<Void> markAllAsRead() {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        notificationService.markAllAsRead(userId);
        return ApiResponse.success();
    }

    /**
     * 删除通知
     *
     * 删除指定的通知
     *
     * @param id 通知ID
     * @return 删除成功响应
     */
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteNotification(@PathVariable String id) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        notificationService.deleteNotification(userId, id);
        return ApiResponse.success();
    }
}
