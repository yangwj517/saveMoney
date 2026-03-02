package com.zanqian.savemoney.service;

import com.zanqian.savemoney.dto.BudgetRequest;
import com.zanqian.savemoney.dto.BudgetUpdateRequest;
import java.util.List;
import java.util.Map;

/**
 * 预算服务接口
 *
 * 定义预算管理相关的业务逻辑
 */
public interface BudgetService {
    /**
     * 获取预算列表
     *
     * @param userId 用户ID
     * @param bookType 账簿类型
     * @param period 预算周期
     * @return 预算列表
     */
    List<Map<String, Object>> getBudgets(String userId, String bookType, String period);

    /**
     * 创建预算
     *
     * @param userId 用户ID
     * @param request 创建请求
     * @return 创建后的预算信息
     */
    Map<String, Object> createBudget(String userId, BudgetRequest request);

    /**
     * 更新预算
     *
     * @param userId 用户ID
     * @param id 预算ID
     * @param request 更新请求
     * @return 更新后的预算信息
     */
    Map<String, Object> updateBudget(String userId, String id, BudgetUpdateRequest request);

    /**
     * 删除预算
     *
     * @param userId 用户ID
     * @param id 预算ID
     */
    void deleteBudget(String userId, String id);
}
