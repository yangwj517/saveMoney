package com.zanqian.savemoney.service.impl;

import com.zanqian.savemoney.common.ErrorCode;
import com.zanqian.savemoney.common.exception.BusinessException;
import com.zanqian.savemoney.dto.DepositRequest;
import com.zanqian.savemoney.dto.SavingsGoalRequest;
import com.zanqian.savemoney.dto.SavingsGoalUpdateRequest;
import com.zanqian.savemoney.entity.SavingsDeposit;
import com.zanqian.savemoney.entity.SavingsGoal;
import com.zanqian.savemoney.repository.SavingsDepositRepository;
import com.zanqian.savemoney.repository.SavingsGoalRepository;
import com.zanqian.savemoney.service.SavingsGoalService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 储蓄目标业务实现类
 *
 * 实现储蓄目标相关的业务逻辑：
 * - 获取储蓄目标列表
 * - 获取目标详情（包含存取记录）
 * - 创建储蓄目标
 * - 更新储蓄目标
 * - 删除储蓄目标
 * - 存入资金（增加目标余额）
 * - 提取资金（减少目标余额）
 */
@Service
public class SavingsGoalServiceImpl implements SavingsGoalService {

    private final SavingsGoalRepository goalRepository;
    private final SavingsDepositRepository depositRepository;

    public SavingsGoalServiceImpl(SavingsGoalRepository goalRepository, SavingsDepositRepository depositRepository) {
        this.goalRepository = goalRepository;
        this.depositRepository = depositRepository;
    }

    /**
     * 获取储蓄目标列表
     *
     * 根据用户ID、账簿类型和完成状态获取目标列表
     *
     * @param userId 用户ID
     * @param bookType 账簿类型
     * @param isCompleted 是否完成（可选，null表示获取全部）
     * @return 储蓄目标列表
     */
    @Override
    public List<Map<String, Object>> getGoals(String userId, String bookType, Boolean isCompleted) {
        List<SavingsGoal> goals;
        // 按完成状态筛选或获取所有目标
        if (isCompleted != null) {
            goals = goalRepository.findByUserIdAndBookTypeAndIsCompleted(userId, bookType, isCompleted);
        } else {
            goals = goalRepository.findByUserIdAndBookType(userId, bookType);
        }
        return goals.stream().map(this::toMap).collect(Collectors.toList());
    }

    /**
     * 获取储蓄目标详情
     *
     * 返回目标信息以及该目标的所有存取记录
     *
     * @param userId 用户ID
     * @param id 目标ID
     * @return 包含目标详情和存取记录的Map
     * @throws BusinessException 如果目标不存在或无权操作
     */
    @Override
    public Map<String, Object> getGoal(String userId, String id) {
        SavingsGoal goal = goalRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND, "目标不存在"));

        // 权限验证：只能查看属于自己的目标
        if (!goal.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        Map<String, Object> map = toMap(goal);

        // 获取该目标的所有存取记录（按创建时间倒序）
        List<SavingsDeposit> deposits = depositRepository.findByGoalIdOrderByCreatedAtDesc(id);
        List<Map<String, Object>> depositList = deposits.stream().map(d -> {
            Map<String, Object> dm = new LinkedHashMap<>();
            dm.put("id", d.getId());
            dm.put("goalId", d.getGoalId());
            dm.put("amount", d.getAmount());
            dm.put("note", d.getNote());
            dm.put("createdAt", d.getCreatedAt() != null ? d.getCreatedAt().toString() : null);
            return dm;
        }).collect(Collectors.toList());
        map.put("deposits", depositList);

        return map;
    }

    /**
     * 创建储蓄目标
     *
     * @param userId 用户ID
     * @param request 目标创建请求
     * @return 创建后的目标信息
     */
    @Override
    @Transactional
    public Map<String, Object> createGoal(String userId, SavingsGoalRequest request) {
        SavingsGoal goal = new SavingsGoal();
        goal.setUserId(userId);
        goal.setName(request.getName());
        goal.setTargetAmount(request.getTargetAmount());
        goal.setCurrentAmount(BigDecimal.ZERO);
        goal.setBookType(request.getBookType());
        if (request.getDeadline() != null) {
            goal.setDeadline(LocalDate.parse(request.getDeadline()));
        }
        goal.setIcon(request.getIcon());
        goal.setColor(request.getColor());
        goal.setCoverImage(request.getCoverImage());
        goal.setIsCompleted(false);
        goalRepository.save(goal);
        return toMap(goal);
    }

    /**
     * 更新储蓄目标
     *
     * 支持部分更新，只更新非null的字段
     *
     * @param userId 用户ID
     * @param id 目标ID
     * @param request 目标更新请求
     * @return 更新后的目标信息
     * @throws BusinessException 如果目标不存在或无权操作
     */
    @Override
    @Transactional
    public Map<String, Object> updateGoal(String userId, String id, SavingsGoalUpdateRequest request) {
        SavingsGoal goal = goalRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND, "目标不存在"));

        // 权限验证：只能修改属于自己的目标
        if (!goal.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        // 选择性更新目标信息
        if (request.getName() != null) goal.setName(request.getName());
        if (request.getTargetAmount() != null) goal.setTargetAmount(request.getTargetAmount());
        if (request.getDeadline() != null) goal.setDeadline(LocalDate.parse(request.getDeadline()));
        if (request.getIcon() != null) goal.setIcon(request.getIcon());
        if (request.getColor() != null) goal.setColor(request.getColor());
        goalRepository.save(goal);
        return toMap(goal);
    }

    /**
     * 删除储蓄目标
     *
     * @param userId 用户ID
     * @param id 目标ID
     * @throws BusinessException 如果目标不存在或无权操作
     */
    @Override
    @Transactional
    public void deleteGoal(String userId, String id) {
        SavingsGoal goal = goalRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND, "目标不存在"));

        // 权限验证：只能删除属于自己的目标
        if (!goal.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        goalRepository.delete(goal);
    }

    /**
     * 往储蓄目标存入资金
     *
     * 流程：
     * 1. 验证目标存在和权限
     * 2. 创建存入记录
     * 3. 更新目标当前金额
     * 4. 如果当前金额达到或超过目标金额，标记为已完成
     *
     * @param userId 用户ID
     * @param goalId 目标ID
     * @param request 存入请求（金额和备注）
     * @return 存入操作的结果
     * @throws BusinessException 如果目标不存在或无权操作
     */
    @Override
    @Transactional
    public Map<String, Object> deposit(String userId, String goalId, DepositRequest request) {
        SavingsGoal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND, "目标不存在"));

        // 权限验证：只能对自己的目标进行操作
        if (!goal.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        // 创建存入记录
        SavingsDeposit deposit = new SavingsDeposit();
        deposit.setGoalId(goalId);
        deposit.setAmount(request.getAmount());
        deposit.setNote(request.getNote());
        depositRepository.save(deposit);

        // 更新目标当前余额
        goal.setCurrentAmount(goal.getCurrentAmount().add(request.getAmount()));

        // 如果达到目标，标记为已完成
        if (goal.getCurrentAmount().compareTo(goal.getTargetAmount()) >= 0) {
            goal.setIsCompleted(true);
        }
        goalRepository.save(goal);

        // 返回存入操作结果
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", deposit.getId());
        result.put("goalId", deposit.getGoalId());
        result.put("amount", deposit.getAmount());
        result.put("note", deposit.getNote());
        result.put("createdAt", deposit.getCreatedAt() != null ? deposit.getCreatedAt().toString() : null);
        return result;
    }

    /**
     * 从储蓄目标提取资金
     *
     * 流程：
     * 1. 验证目标存在和权限
     * 2. 创建提取记录（金额为负数）
     * 3. 更新目标当前金额（减少）
     * 4. 标记为未完成（如果之前已完成）
     *
     * @param userId 用户ID
     * @param goalId 目标ID
     * @param request 提取请求（金额和备注）
     * @return 提取操作的结果
     * @throws BusinessException 如果目标不存在或无权操作
     */
    @Override
    @Transactional
    public Map<String, Object> withdraw(String userId, String goalId, DepositRequest request) {
        SavingsGoal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND, "目标不存在"));

        // 权限验证：只能对自己的目标进行操作
        if (!goal.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        // 创建提取记录（金额为负数）
        SavingsDeposit deposit = new SavingsDeposit();
        deposit.setGoalId(goalId);
        deposit.setAmount(request.getAmount().negate());  // 取反为负数
        deposit.setNote(request.getNote());
        depositRepository.save(deposit);

        // 更新目标当前余额（减少）
        goal.setCurrentAmount(goal.getCurrentAmount().subtract(request.getAmount()));
        // 提取后标记为未完成
        goal.setIsCompleted(false);
        goalRepository.save(goal);

        // 返回提取操作结果
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", deposit.getId());
        result.put("goalId", deposit.getGoalId());
        result.put("amount", deposit.getAmount());
        result.put("note", deposit.getNote());
        result.put("createdAt", deposit.getCreatedAt() != null ? deposit.getCreatedAt().toString() : null);
        return result;
    }

    /**
     * 将SavingsGoal实体转换为Map格式
     *
     * @param g 储蓄目标实体
     * @return 目标信息Map
     */
    private Map<String, Object> toMap(SavingsGoal g) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", g.getId());
        map.put("name", g.getName());
        map.put("targetAmount", g.getTargetAmount());
        map.put("currentAmount", g.getCurrentAmount());
        map.put("bookType", g.getBookType());
        map.put("deadline", g.getDeadline() != null ? g.getDeadline().toString() : null);
        map.put("icon", g.getIcon());
        map.put("color", g.getColor());
        map.put("coverImage", g.getCoverImage());
        map.put("isCompleted", g.getIsCompleted());
        map.put("createdAt", g.getCreatedAt() != null ? g.getCreatedAt().toString() : null);
        map.put("updatedAt", g.getUpdatedAt() != null ? g.getUpdatedAt().toString() : null);
        return map;
    }
}
