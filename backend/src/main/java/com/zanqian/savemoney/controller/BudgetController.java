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

/**
 * 预算控制器
 *
 * 处理预算管理相关操作：
 * - 获取预算列表
 * - 创建预算
 * - 修改预算
 * - 删除预算
 *
 * 预算用于设定支出限额，并在超出时进行提醒
 */
@RestController
@RequestMapping("/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    /**
     * 获取预算列表
     *
     * 获取指定账簿和周期的预算列表
     *
     * @param bookType 账簿类型
     * @param period 预算周期（可选，如"monthly"月度、"yearly"年度等）
     * @return 预算列表
     */
    @GetMapping
    public ApiResponse<List<Map<String, Object>>> getBudgets(@RequestParam String bookType,
                                                              @RequestParam(required = false) String period) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(budgetService.getBudgets(userId, bookType, period));
    }

    /**
     * 创建预算
     *
     * 为指定分类创建支出预算
     *
     * @param request 包含预算信息的请求（分类、额度、周期等）
     * @return 创建后的预算信息
     */
    @PostMapping
    public ApiResponse<Map<String, Object>> createBudget(@Valid @RequestBody BudgetRequest request) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(budgetService.createBudget(userId, request));
    }

    /**
     * 更新预算
     *
     * 修改指定预算的信息
     *
     * @param id 预算ID
     * @param request 包含更新信息的请求
     * @return 更新后的预算信息
     */
    @PutMapping("/{id}")
    public ApiResponse<Map<String, Object>> updateBudget(@PathVariable String id,
                                                          @Valid @RequestBody BudgetUpdateRequest request) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(budgetService.updateBudget(userId, id, request));
    }

    /**
     * 删除预算
     *
     * 删除指定的预算
     *
     * @param id 预算ID
     * @return 删除成功响应
     */
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteBudget(@PathVariable String id) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        budgetService.deleteBudget(userId, id);
        return ApiResponse.success();
    }
}
