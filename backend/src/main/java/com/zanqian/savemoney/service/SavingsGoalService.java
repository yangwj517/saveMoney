package com.zanqian.savemoney.service;

import com.zanqian.savemoney.dto.DepositRequest;
import com.zanqian.savemoney.dto.SavingsGoalRequest;
import com.zanqian.savemoney.dto.SavingsGoalUpdateRequest;
import java.util.List;
import java.util.Map;

public interface SavingsGoalService {
    List<Map<String, Object>> getGoals(String userId, String bookType, Boolean isCompleted);
    Map<String, Object> getGoal(String userId, String id);
    Map<String, Object> createGoal(String userId, SavingsGoalRequest request);
    Map<String, Object> updateGoal(String userId, String id, SavingsGoalUpdateRequest request);
    void deleteGoal(String userId, String id);
    Map<String, Object> deposit(String userId, String goalId, DepositRequest request);
    Map<String, Object> withdraw(String userId, String goalId, DepositRequest request);
}
