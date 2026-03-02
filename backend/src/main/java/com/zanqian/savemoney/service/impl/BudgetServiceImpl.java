package com.zanqian.savemoney.service.impl;

import com.zanqian.savemoney.common.ErrorCode;
import com.zanqian.savemoney.common.exception.BusinessException;
import com.zanqian.savemoney.dto.BudgetRequest;
import com.zanqian.savemoney.dto.BudgetUpdateRequest;
import com.zanqian.savemoney.entity.Budget;
import com.zanqian.savemoney.entity.Category;
import com.zanqian.savemoney.repository.BudgetRepository;
import com.zanqian.savemoney.repository.CategoryRepository;
import com.zanqian.savemoney.repository.RecordRepository;
import com.zanqian.savemoney.service.BudgetService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BudgetServiceImpl implements BudgetService {

    private final BudgetRepository budgetRepository;
    private final CategoryRepository categoryRepository;
    private final RecordRepository recordRepository;

    public BudgetServiceImpl(BudgetRepository budgetRepository, CategoryRepository categoryRepository,
                             RecordRepository recordRepository) {
        this.budgetRepository = budgetRepository;
        this.categoryRepository = categoryRepository;
        this.recordRepository = recordRepository;
    }

    @Override
    public List<Map<String, Object>> getBudgets(String userId, String bookType, String period) {
        List<Budget> budgets;
        if (period != null && !period.isEmpty()) {
            budgets = budgetRepository.findByUserIdAndBookTypeAndPeriod(userId, bookType, period);
        } else {
            budgets = budgetRepository.findByUserIdAndBookType(userId, bookType);
        }
        return budgets.stream().map(b -> toMap(b, userId)).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Map<String, Object> createBudget(String userId, BudgetRequest request) {
        Budget budget = new Budget();
        budget.setUserId(userId);
        budget.setCategoryId(request.getCategoryId());
        budget.setAmount(request.getAmount());
        budget.setUsedAmount(BigDecimal.ZERO);
        budget.setPeriod(request.getPeriod());
        budget.setBookType(request.getBookType());
        budget.setAlertThreshold(request.getAlertThreshold());
        budget.setIsAlertEnabled(request.getIsAlertEnabled() != null ? request.getIsAlertEnabled() : false);
        budgetRepository.save(budget);
        return toMap(budget, userId);
    }

    @Override
    @Transactional
    public Map<String, Object> updateBudget(String userId, String id, BudgetUpdateRequest request) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND, "预算不存在"));
        if (!budget.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        if (request.getAmount() != null) budget.setAmount(request.getAmount());
        if (request.getAlertThreshold() != null) budget.setAlertThreshold(request.getAlertThreshold());
        if (request.getIsAlertEnabled() != null) budget.setIsAlertEnabled(request.getIsAlertEnabled());
        budgetRepository.save(budget);
        return toMap(budget, userId);
    }

    @Override
    @Transactional
    public void deleteBudget(String userId, String id) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND, "预算不存在"));
        if (!budget.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        budgetRepository.delete(budget);
    }

    private Map<String, Object> toMap(Budget b, String userId) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", b.getId());
        map.put("categoryId", b.getCategoryId());

        if (b.getCategoryId() != null) {
            Optional<Category> cat = categoryRepository.findById(b.getCategoryId());
            if (cat.isPresent()) {
                Map<String, Object> catMap = new LinkedHashMap<>();
                catMap.put("id", cat.get().getId());
                catMap.put("name", cat.get().getName());
                catMap.put("icon", cat.get().getIcon());
                catMap.put("color", cat.get().getColor());
                map.put("category", catMap);
            } else {
                map.put("category", null);
            }
        } else {
            map.put("category", null);
        }

        map.put("amount", b.getAmount());
        map.put("usedAmount", calculateUsedAmount(b, userId));
        map.put("period", b.getPeriod());
        map.put("bookType", b.getBookType());
        map.put("alertThreshold", b.getAlertThreshold());
        map.put("isAlertEnabled", b.getIsAlertEnabled());
        return map;
    }

    private BigDecimal calculateUsedAmount(Budget budget, String userId) {
        LocalDate[] dateRange = getPeriodDateRange(budget.getPeriod());
        LocalDate startDate = dateRange[0];
        LocalDate endDate = dateRange[1];

        if (budget.getCategoryId() != null) {
            return recordRepository.sumExpenseByBookTypeAndCategoryAndDateBetween(
                    userId, budget.getBookType(), budget.getCategoryId(), startDate, endDate);
        } else {
            return recordRepository.sumAmountByUserIdAndBookTypeAndTypeAndDateBetween(
                    userId, budget.getBookType(), "expense", startDate, endDate);
        }
    }

    private LocalDate[] getPeriodDateRange(String period) {
        LocalDate today = LocalDate.now();
        LocalDate startDate;
        LocalDate endDate;

        switch (period != null ? period : "monthly") {
            case "weekly":
                startDate = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
                endDate = startDate.plusDays(6);
                break;
            case "yearly":
                startDate = today.with(TemporalAdjusters.firstDayOfYear());
                endDate = today.with(TemporalAdjusters.lastDayOfYear());
                break;
            default: // monthly
                startDate = today.with(TemporalAdjusters.firstDayOfMonth());
                endDate = today.with(TemporalAdjusters.lastDayOfMonth());
                break;
        }
        return new LocalDate[]{startDate, endDate};
    }
}
