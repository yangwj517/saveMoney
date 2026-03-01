package com.zanqian.savemoney.service;

import com.zanqian.savemoney.dto.BudgetRequest;
import com.zanqian.savemoney.dto.BudgetUpdateRequest;
import java.util.List;
import java.util.Map;

public interface BudgetService {
    List<Map<String, Object>> getBudgets(String userId, String bookType, String period);
    Map<String, Object> createBudget(String userId, BudgetRequest request);
    Map<String, Object> updateBudget(String userId, String id, BudgetUpdateRequest request);
    void deleteBudget(String userId, String id);
}
