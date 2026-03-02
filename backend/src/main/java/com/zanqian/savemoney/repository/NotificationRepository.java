package com.zanqian.savemoney.repository;

import com.zanqian.savemoney.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * 通知数据仓库接口
 *
 * 提供通知数据的数据库操作接口
 * 支持分页查询和批量操作
 */
public interface NotificationRepository extends JpaRepository<Notification, String> {
    /**
     * 根据用户ID分页查询通知列表
     *
     * @param userId 用户ID
     * @param pageable 分页信息
     * @return 分页的通知列表
     */
    Page<Notification> findByUserId(String userId, Pageable pageable);

    /**
     * 根据用户ID和读取状态分页查询通知列表
     *
     * @param userId 用户ID
     * @param isRead 读取状态
     * @param pageable 分页信息
     * @return 分页的通知列表
     */
    Page<Notification> findByUserIdAndIsRead(String userId, Boolean isRead, Pageable pageable);

    /**
     * 统计用户未读通知数量
     *
     * @param userId 用户ID
     * @param isRead 读取状态
     * @return 未读通知数量
     */
    long countByUserIdAndIsRead(String userId, Boolean isRead);

    /**
     * 将用户的所有未读通知标记为已读
     *
     * @param userId 用户ID
     */
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.userId = :userId AND n.isRead = false")
    void markAllAsRead(@Param("userId") String userId);
}
