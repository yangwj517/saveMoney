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

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationServiceImpl(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    public Map<String, Object> getNotifications(String userId, Integer page, Integer pageSize, Boolean isRead) {
        int p = (page != null && page > 0) ? page : 1;
        int s = (pageSize != null && pageSize > 0) ? pageSize : 20;

        Page<Notification> pageResult;
        if (isRead != null) {
            pageResult = notificationRepository.findByUserIdAndIsRead(userId, isRead,
                    PageRequest.of(p - 1, s, Sort.by(Sort.Direction.DESC, "createdAt")));
        } else {
            pageResult = notificationRepository.findByUserId(userId,
                    PageRequest.of(p - 1, s, Sort.by(Sort.Direction.DESC, "createdAt")));
        }

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

        long unreadCount = notificationRepository.countByUserIdAndIsRead(userId, false);

        Map<String, Object> pagination = new LinkedHashMap<>();
        pagination.put("page", p);
        pagination.put("pageSize", s);
        pagination.put("total", pageResult.getTotalElements());
        pagination.put("totalPages", pageResult.getTotalPages());

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("list", list);
        result.put("pagination", pagination);
        result.put("unreadCount", unreadCount);
        return result;
    }

    @Override
    @Transactional
    public void markAsRead(String userId, String id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND, "通知不存在"));
        if (!notification.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    @Override
    @Transactional
    public void markAllAsRead(String userId) {
        notificationRepository.markAllAsRead(userId);
    }

    @Override
    @Transactional
    public void deleteNotification(String userId, String id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND, "通知不存在"));
        if (!notification.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        notificationRepository.delete(notification);
    }
}
