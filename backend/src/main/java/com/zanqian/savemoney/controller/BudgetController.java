package com.zanqian.savemoney.controller;

import com.zanqian.savemoney.common.ApiResponse;
import com.zanqian.savemoney.dto.BudgetRequest;
import com.zanqian.savemoney.dto.BudgetUpdateRequest;
import com.zanqian.savemoney.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @GetMapping
    public ApiResponse<List<Map<String, Object>>> getBudgets(@RequestParam String bookType,
                                                              @RequestParam(required = false) String period) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(budgetService.getBudgets(userId, bookType, period));
    }

    @PostMapping
    public ApiResponse<Map<String, Object>> createBudget(@Valid @RequestBody BudgetRequest request) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(budgetService.createBudget(userId, request));
    }

    @PutMapping("/{id}")
    public ApiResponse<Map<String, Object>> updateBudget(@PathVariable String id,
                                                          @Valid @RequestBody BudgetUpdateRequest request) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(budgetService.updateBudget(userId, id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteBudget(@PathVariable String id) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        budgetService.deleteBudget(userId, id);
        return ApiResponse.success();
    }
}
