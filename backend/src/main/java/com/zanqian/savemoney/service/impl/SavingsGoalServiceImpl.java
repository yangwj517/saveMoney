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

@Service
public class SavingsGoalServiceImpl implements SavingsGoalService {

    private final SavingsGoalRepository goalRepository;
    private final SavingsDepositRepository depositRepository;

    public SavingsGoalServiceImpl(SavingsGoalRepository goalRepository, SavingsDepositRepository depositRepository) {
        this.goalRepository = goalRepository;
        this.depositRepository = depositRepository;
    }

    @Override
    public List<Map<String, Object>> getGoals(String userId, String bookType, Boolean isCompleted) {
        List<SavingsGoal> goals;
        if (isCompleted != null) {
            goals = goalRepository.findByUserIdAndBookTypeAndIsCompleted(userId, bookType, isCompleted);
        } else {
            goals = goalRepository.findByUserIdAndBookType(userId, bookType);
        }
        return goals.stream().map(this::toMap).collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> getGoal(String userId, String id) {
        SavingsGoal goal = goalRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND, "目标不存在"));
        if (!goal.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        Map<String, Object> map = toMap(goal);

        // Include deposits
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

    @Override
    @Transactional
    public Map<String, Object> updateGoal(String userId, String id, SavingsGoalUpdateRequest request) {
        SavingsGoal goal = goalRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND, "目标不存在"));
        if (!goal.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        if (request.getName() != null) goal.setName(request.getName());
        if (request.getTargetAmount() != null) goal.setTargetAmount(request.getTargetAmount());
        if (request.getDeadline() != null) goal.setDeadline(LocalDate.parse(request.getDeadline()));
        if (request.getIcon() != null) goal.setIcon(request.getIcon());
        if (request.getColor() != null) goal.setColor(request.getColor());
        goalRepository.save(goal);
        return toMap(goal);
    }

    @Override
    @Transactional
    public void deleteGoal(String userId, String id) {
        SavingsGoal goal = goalRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND, "目标不存在"));
        if (!goal.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        goalRepository.delete(goal);
    }

    @Override
    @Transactional
    public Map<String, Object> deposit(String userId, String goalId, DepositRequest request) {
        SavingsGoal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND, "目标不存在"));
        if (!goal.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        SavingsDeposit deposit = new SavingsDeposit();
        deposit.setGoalId(goalId);
        deposit.setAmount(request.getAmount());
        deposit.setNote(request.getNote());
        depositRepository.save(deposit);

        goal.setCurrentAmount(goal.getCurrentAmount().add(request.getAmount()));
        if (goal.getCurrentAmount().compareTo(goal.getTargetAmount()) >= 0) {
            goal.setIsCompleted(true);
        }
        goalRepository.save(goal);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", deposit.getId());
        result.put("goalId", deposit.getGoalId());
        result.put("amount", deposit.getAmount());
        result.put("note", deposit.getNote());
        result.put("createdAt", deposit.getCreatedAt() != null ? deposit.getCreatedAt().toString() : null);
        return result;
    }

    @Override
    @Transactional
    public Map<String, Object> withdraw(String userId, String goalId, DepositRequest request) {
        SavingsGoal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND, "目标不存在"));
        if (!goal.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        SavingsDeposit deposit = new SavingsDeposit();
        deposit.setGoalId(goalId);
        deposit.setAmount(request.getAmount().negate());
        deposit.setNote(request.getNote());
        depositRepository.save(deposit);

        goal.setCurrentAmount(goal.getCurrentAmount().subtract(request.getAmount()));
        goal.setIsCompleted(false);
        goalRepository.save(goal);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", deposit.getId());
        result.put("goalId", deposit.getGoalId());
        result.put("amount", deposit.getAmount());
        result.put("note", deposit.getNote());
        result.put("createdAt", deposit.getCreatedAt() != null ? deposit.getCreatedAt().toString() : null);
        return result;
    }

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
