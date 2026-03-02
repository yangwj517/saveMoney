package com.zanqian.savemoney.repository;

import com.zanqian.savemoney.entity.SavingsDeposit;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * 储蓄记录数据仓库接口
 *
 * 提供储蓄存取记录数据的数据库操作接口
 */
public interface SavingsDepositRepository extends JpaRepository<SavingsDeposit, String> {
    /**
     * 根据目标ID查询该目标的所有存取记录（按创建时间倒序）
     *
     * @param goalId 储蓄目标ID
     * @return 存取记录列表
     */
    List<SavingsDeposit> findByGoalIdOrderByCreatedAtDesc(String goalId);
}
