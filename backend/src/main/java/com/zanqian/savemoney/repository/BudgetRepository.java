package com.zanqian.savemoney.repository;

import com.zanqian.savemoney.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * 预算数据仓库接口
 *
 * 提供预算数据的数据库操作接口
 */
public interface BudgetRepository extends JpaRepository<Budget, String> {
    /**
     * 根据用户ID和账簿类型查询预算列表
     *
     * @param userId 用户ID
     * @param bookType 账簿类型
     * @return 预算列表
     */
    List<Budget> findByUserIdAndBookType(String userId, String bookType);

    /**
     * 根据用户ID、账簿类型和周期查询预算列表
     *
     * @param userId 用户ID
     * @param bookType 账簿类型
     * @param period 预算周期
     * @return 预算列表
     */
    List<Budget> findByUserIdAndBookTypeAndPeriod(String userId, String bookType, String period);

    /**
     * 检查用户指定周期内是否已存在该分类的预算
     *
     * @param userId 用户ID
     * @param bookType 账簿类型
     * @param period 预算周期
     * @param categoryId 分类ID
     * @return 是否存在
     */
    boolean existsByUserIdAndBookTypeAndPeriodAndCategoryId(String userId, String bookType, String period, String categoryId);
}


