package com.zanqian.savemoney.service.impl;

import com.zanqian.savemoney.common.ErrorCode;
import com.zanqian.savemoney.common.exception.BusinessException;
import com.zanqian.savemoney.entity.Notification;
import com.zanqian.savemoney.repository.NotificationRepository;
import com.zanqian.savemoney.service.NotificationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 通知业务实现类
 *
 * 实现通知相关的业务逻辑：
 * - 获取通知列表（支持分页和读取状态筛选）
 * - 标记单个通知为已读
 * - 标记所有通知为已读
 * - 删除通知
 * - 统计未读通知数
 */
@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationServiceImpl(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    /**
     * 获取通知列表
     *
     * 支持按读取状态筛选，支持分页
     * 按创建时间倒序排列，最新的通知在前
     * 同时返回未读通知数量
     *
     * @param userId 用户ID
     * @param page 页码（如果为null或<=0，则默认为1）
     * @param pageSize 每页数量（如果为null或<=0，则默认为20）
     * @param isRead 读取状态（可选，null表示返回全部通知）
     * @return 包含通知列表、分页信息和未读数的Map
     */
    @Override
    public Map<String, Object> getNotifications(String userId, Integer page, Integer pageSize, Boolean isRead) {
        // 参数验证和默认值设置
        int p = (page != null && page > 0) ? page : 1;
        int s = (pageSize != null && pageSize > 0) ? pageSize : 20;

        // 根据是否指定读取状态进行分页查询
        Page<Notification> pageResult;
        if (isRead != null) {
            // 按读取状态筛选
            pageResult = notificationRepository.findByUserIdAndIsRead(userId, isRead,
                    PageRequest.of(p - 1, s, Sort.by(Sort.Direction.DESC, "createdAt")));
        } else {
            // 返回全部通知
            pageResult = notificationRepository.findByUserId(userId,
                    PageRequest.of(p - 1, s, Sort.by(Sort.Direction.DESC, "createdAt")));
        }

        // 将通知实体转换为Map格式
        List<Map<String, Object>> list = pageResult.getContent().stream().map(n -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", n.getId());
            map.put("type", n.getType());
            map.put("title", n.getTitle());
            map.put("content", n.getContent());
            map.put("isRead", n.getIsRead());
            map.put("createdAt", n.getCreatedAt() != null ? n.getCreatedAt().toString() : null);
            return map;
        }).collect(Collectors.toList());

        // 统计该用户的未读通知数
        long unreadCount = notificationRepository.countByUserIdAndIsRead(userId, false);

        // 构建分页信息
        Map<String, Object> pagination = new LinkedHashMap<>();
        pagination.put("page", p);
        pagination.put("pageSize", s);
        pagination.put("total", pageResult.getTotalElements());
        pagination.put("totalPages", pageResult.getTotalPages());

        // 构建返回结果
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("list", list);
        result.put("pagination", pagination);
        result.put("unreadCount", unreadCount);
        return result;
    }

    /**
     * 标记单个通知为已读
     *
     * @param userId 用户ID
     * @param id 通知ID
     * @throws BusinessException 如果通知不存在或无权操作
     */
    @Override
    @Transactional
    public void markAsRead(String userId, String id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND, "通知不存在"));

        // 权限验证：只能标记属于自己的通知
        if (!notification.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    /**
     * 标记所有通知为已读
     *
     * 将该用户的所有未读通知一次性标记为已读
     * 使用数据库的批量UPDATE操作，性能更优
     *
     * @param userId 用户ID
     */
    @Override
    @Transactional
    public void markAllAsRead(String userId) {
        notificationRepository.markAllAsRead(userId);
    }

    /**
     * 删除通知
     *
     * @param userId 用户ID
     * @param id 通知ID
     * @throws BusinessException 如果通知不存在或无权操作
     */
    @Override
    @Transactional
    public void deleteNotification(String userId, String id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND, "通知不存在"));

        // 权限验证：只能删除属于自己的通知
        if (!notification.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        notificationRepository.delete(notification);
    }
}
