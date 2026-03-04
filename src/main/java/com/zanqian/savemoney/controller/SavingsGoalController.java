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

/**
 * 储蓄目标控制器
 *
 * 处理储蓄目标相关操作：
 * - 获取储蓄目标列表
 * - 获取储蓄目标详情
 * - 创建储蓄目标
 * - 修改储蓄目标
 * - 删除储蓄目标
 * - 储蓄存入
 * - 储蓄提取
 *
 * 储蓄目标用于用户设定储蓄计划并追踪进度
 */
@RestController
@RequestMapping("/savings/goals")
public class SavingsGoalController {

    private final SavingsGoalService savingsGoalService;

    public SavingsGoalController(SavingsGoalService savingsGoalService) {
        this.savingsGoalService = savingsGoalService;
    }

    /**
     * 获取储蓄目标列表
     *
     * 获取指定账簿的储蓄目标列表，可按完成状态筛选
     *
     * @param bookType 账簿类型
     * @param isCompleted 是否完成（可选）
     * @return 储蓄目标列表
     */
    @GetMapping
    public ApiResponse<List<Map<String, Object>>> getGoals(@RequestParam String bookType,
                                                            @RequestParam(required = false) Boolean isCompleted) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(savingsGoalService.getGoals(userId, bookType, isCompleted));
    }

    /**
     * 获取储蓄目标详情
     *
     * 获取单个储蓄目标的完整信息
     *
     * @param id 目标ID
     * @return 目标详情
     */
    @GetMapping("/{id}")
    public ApiResponse<Map<String, Object>> getGoal(@PathVariable String id) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(savingsGoalService.getGoal(userId, id));
    }

    /**
     * 创建储蓄目标
     *
     * 创建新的储蓄目标
     *
     * @param request 包含目标信息的请求（名称、目标额、截止日期等）
     * @return 创建后的目标信息
     */
    @PostMapping
    public ApiResponse<Map<String, Object>> createGoal(@Valid @RequestBody SavingsGoalRequest request) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(savingsGoalService.createGoal(userId, request));
    }

    /**
     * 更新储蓄目标
     *
     * 修改指定储蓄目标的信息
     *
     * @param id 目标ID
     * @param request 包含更新信息的请求
     * @return 更新后的目标信息
     */
    @PutMapping("/{id}")
    public ApiResponse<Map<String, Object>> updateGoal(@PathVariable String id,
                                                        @Valid @RequestBody SavingsGoalUpdateRequest request) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(savingsGoalService.updateGoal(userId, id, request));
    }

    /**
     * 删除储蓄目标
     *
     * 删除指定的储蓄目标
     *
     * @param id 目标ID
     * @return 删除成功响应
     */
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteGoal(@PathVariable String id) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        savingsGoalService.deleteGoal(userId, id);
        return ApiResponse.success();
    }

    /**
     * 往储蓄目标存入资金
     *
     * 向指定的储蓄目标中存入金额
     *
     * @param id 目标ID
     * @param request 包含存入金额和备注的请求
     * @return 存入后的目标信息
     */
    @PostMapping("/{id}/deposits")
    public ApiResponse<Map<String, Object>> deposit(@PathVariable String id,
                                                     @Valid @RequestBody DepositRequest request) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(savingsGoalService.deposit(userId, id, request));
    }

    /**
     * 从储蓄目标提取资金
     *
     * 从指定的储蓄目标中提取金额
     *
     * @param id 目标ID
     * @param request 包含提取金额和备注的请求
     * @return 提取后的目标信息
     */
    @PostMapping("/{id}/withdraw")
    public ApiResponse<Map<String, Object>> withdraw(@PathVariable String id,
                                                      @Valid @RequestBody DepositRequest request) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(savingsGoalService.withdraw(userId, id, request));
    }
}
