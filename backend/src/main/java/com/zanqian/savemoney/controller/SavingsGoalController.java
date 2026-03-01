package com.zanqian.savemoney.controller;

import com.zanqian.savemoney.common.ApiResponse;
import com.zanqian.savemoney.dto.DepositRequest;
import com.zanqian.savemoney.dto.SavingsGoalRequest;
import com.zanqian.savemoney.dto.SavingsGoalUpdateRequest;
import com.zanqian.savemoney.service.SavingsGoalService;
import jakarta.validation.Valid;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/savings/goals")
public class SavingsGoalController {

    private final SavingsGoalService savingsGoalService;

    public SavingsGoalController(SavingsGoalService savingsGoalService) {
        this.savingsGoalService = savingsGoalService;
    }

    @GetMapping
    public ApiResponse<List<Map<String, Object>>> getGoals(@RequestParam String bookType,
                                                            @RequestParam(required = false) Boolean isCompleted) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(savingsGoalService.getGoals(userId, bookType, isCompleted));
    }

    @GetMapping("/{id}")
    public ApiResponse<Map<String, Object>> getGoal(@PathVariable String id) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(savingsGoalService.getGoal(userId, id));
    }

    @PostMapping
    public ApiResponse<Map<String, Object>> createGoal(@Valid @RequestBody SavingsGoalRequest request) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(savingsGoalService.createGoal(userId, request));
    }

    @PutMapping("/{id}")
    public ApiResponse<Map<String, Object>> updateGoal(@PathVariable String id,
                                                        @Valid @RequestBody SavingsGoalUpdateRequest request) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(savingsGoalService.updateGoal(userId, id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteGoal(@PathVariable String id) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        savingsGoalService.deleteGoal(userId, id);
        return ApiResponse.success();
    }

    @PostMapping("/{id}/deposits")
    public ApiResponse<Map<String, Object>> deposit(@PathVariable String id,
                                                     @Valid @RequestBody DepositRequest request) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(savingsGoalService.deposit(userId, id, request));
    }

    @PostMapping("/{id}/withdraw")
    public ApiResponse<Map<String, Object>> withdraw(@PathVariable String id,
                                                      @Valid @RequestBody DepositRequest request) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(savingsGoalService.withdraw(userId, id, request));
    }
}
