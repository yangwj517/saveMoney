package com.zanqian.savemoney.repository;

import com.zanqian.savemoney.entity.ReminderSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * 提醒设置数据仓库接口
 *
 * 提供提醒设置数据的数据库操作接口
 */
public interface ReminderSettingsRepository extends JpaRepository<ReminderSettings, String> {
    /**
     * 根据用户ID查询该用户的提醒设置
     *
     * @param userId 用户ID
     * @return 提醒设置（Optional）
     */
    Optional<ReminderSettings> findByUserId(String userId);
}
