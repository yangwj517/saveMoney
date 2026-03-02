package com.zanqian.savemoney.service;

import com.zanqian.savemoney.dto.DepositRequest;
import com.zanqian.savemoney.dto.SavingsGoalRequest;
import com.zanqian.savemoney.dto.SavingsGoalUpdateRequest;
import java.util.List;
import java.util.Map;

/**
 * 储蓄目标服务接口
 *
 * 定义储蓄目标管理相关的业务逻辑
 */
public interface SavingsGoalService {
    /**
     * 获取储蓄目标列表
     *
     * @param userId 用户ID
     * @param bookType 账簿类型
     * @param isCompleted 是否完成（可选）
     * @return 储蓄目标列表
     */
    List<Map<String, Object>> getGoals(String userId, String bookType, Boolean isCompleted);

    /**
     * 获取储蓄目标详情
     *
     * @param userId 用户ID
     * @param id 目标ID
     * @return 目标详情
     */
    Map<String, Object> getGoal(String userId, String id);

    /**
     * 创建储蓄目标
     *
     * @param userId 用户ID
     * @param request 创建请求
     * @return 创建后的目标信息
     */
    Map<String, Object> createGoal(String userId, SavingsGoalRequest request);

    /**
     * 更新储蓄目标
     *
     * @param userId 用户ID
     * @param id 目标ID
     * @param request 更新请求
     * @return 更新后的目标信息
     */
    Map<String, Object> updateGoal(String userId, String id, SavingsGoalUpdateRequest request);

    /**
     * 删除储蓄目标
     *
     * @param userId 用户ID
     * @param id 目标ID
     */
    void deleteGoal(String userId, String id);

    /**
     * 往储蓄目标存入资金
     *
     * @param userId 用户ID
     * @param goalId 目标ID
     * @param request 存入请求
     * @return 存入后的目标信息
     */
    Map<String, Object> deposit(String userId, String goalId, DepositRequest request);

    /**
     * 从储蓄目标提取资金
     *
     * @param userId 用户ID
     * @param goalId 目标ID
     * @param request 提取请求
     * @return 提取后的目标信息
     */
    Map<String, Object> withdraw(String userId, String goalId, DepositRequest request);
}
