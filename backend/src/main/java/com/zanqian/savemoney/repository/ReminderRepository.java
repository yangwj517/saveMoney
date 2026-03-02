package com.zanqian.savemoney.repository;

import com.zanqian.savemoney.entity.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * 提醒数据仓库接口
 *
 * 提供提醒数据的数据库操作接口
 */
public interface ReminderRepository extends JpaRepository<Reminder, String> {
    /**
     * 根据用户ID查询该用户的所有提醒
     *
     * @param userId 用户ID
     * @return 提醒列表
     */
    List<Reminder> findByUserId(String userId);
}
