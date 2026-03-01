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

@RestController
@RequestMapping("/accounts")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping
    public ApiResponse<List<Map<String, Object>>> getAccounts(@RequestParam String bookType) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(accountService.getAccounts(userId, bookType));
    }

    @PostMapping
    public ApiResponse<Map<String, Object>> createAccount(@Valid @RequestBody AccountRequest request) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(accountService.createAccount(userId, request));
    }

    @PutMapping("/{id}")
    public ApiResponse<Map<String, Object>> updateAccount(@PathVariable String id,
                                                           @Valid @RequestBody AccountUpdateRequest request) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(accountService.updateAccount(userId, id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteAccount(@PathVariable String id) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        accountService.deleteAccount(userId, id);
        return ApiResponse.success();
    }
}
