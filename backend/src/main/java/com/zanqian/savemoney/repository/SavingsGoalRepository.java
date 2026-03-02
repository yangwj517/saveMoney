package com.zanqian.savemoney.repository;

import com.zanqian.savemoney.entity.SavingsGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * 储蓄目标数据仓库接口
 *
 * 提供储蓄目标数据的数据库操作接口
 */
public interface SavingsGoalRepository extends JpaRepository<SavingsGoal, String> {
    /**
     * 根据用户ID和账簿类型查询储蓄目标列表
     *
     * @param userId 用户ID
     * @param bookType 账簿类型
     * @return 储蓄目标列表
     */
    List<SavingsGoal> findByUserIdAndBookType(String userId, String bookType);

    /**
     * 根据用户ID、账簿类型和完成状态查询储蓄目标列表
     *
     * @param userId 用户ID
     * @param bookType 账簿类型
     * @param isCompleted 是否完成
     * @return 储蓄目标列表
     */
    List<SavingsGoal> findByUserIdAndBookTypeAndIsCompleted(String userId, String bookType, Boolean isCompleted);
}
