package com.zanqian.savemoney.controller;

import com.zanqian.savemoney.common.ApiResponse;
import com.zanqian.savemoney.dto.AccountRequest;
import com.zanqian.savemoney.dto.AccountUpdateRequest;
import com.zanqian.savemoney.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 账户控制器
 *
 * 处理用户账户管理操作：
 * - 获取账户列表
 * - 创建账户
 * - 修改账户
 * - 删除账户
 *
 * 账户是记录账单的容器，如现金、银行卡、支付宝等
 */
@RestController
@RequestMapping("/accounts")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    /**
     * 获取账户列表
     *
     * 根据账簿类型获取该用户名下的所有账户
     *
     * @param bookType 账簿类型（如"personal"个人账簿、"family"家庭账簿等）
     * @return 账户列表
     */
    @GetMapping
    public ApiResponse<List<Map<String, Object>>> getAccounts(@RequestParam String bookType) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(accountService.getAccounts(userId, bookType));
    }

    /**
     * 创建账户
     *
     * 创建新的账户
     *
     * @param request 包含账户信息的请求（名称、余额、图标、颜色等）
     * @return 创建后的账户信息
     */
    @PostMapping
    public ApiResponse<Map<String, Object>> createAccount(@Valid @RequestBody AccountRequest request) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(accountService.createAccount(userId, request));
    }

    /**
     * 更新账户
     *
     * 修改指定账户的信息
     *
     * @param id 账户ID
     * @param request 包含更新信息的请求
     * @return 更新后的账户信息
     */
    @PutMapping("/{id}")
    public ApiResponse<Map<String, Object>> updateAccount(@PathVariable String id,
                                                           @Valid @RequestBody AccountUpdateRequest request) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(accountService.updateAccount(userId, id, request));
    }

    /**
     * 删除账户
     *
     * 删除指定的账户
     *
     * @param id 账户ID
     * @return 删除成功响应
     */
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteAccount(@PathVariable String id) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        accountService.deleteAccount(userId, id);
        return ApiResponse.success();
    }
}
