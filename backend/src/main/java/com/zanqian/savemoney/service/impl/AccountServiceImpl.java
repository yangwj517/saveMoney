package com.zanqian.savemoney.service.impl;

import com.zanqian.savemoney.common.ErrorCode;
import com.zanqian.savemoney.common.exception.BusinessException;
import com.zanqian.savemoney.dto.AccountRequest;
import com.zanqian.savemoney.dto.AccountUpdateRequest;
import com.zanqian.savemoney.entity.Account;
import com.zanqian.savemoney.repository.AccountRepository;
import com.zanqian.savemoney.service.AccountService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;

    public AccountServiceImpl(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Override
    public List<Map<String, Object>> getAccounts(String userId, String bookType) {
        List<Account> accounts = accountRepository.findByUserIdAndBookType(userId, bookType);
        return accounts.stream().map(this::toMap).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Map<String, Object> createAccount(String userId, AccountRequest request) {
        Account account = new Account();
        account.setUserId(userId);
        account.setName(request.getName());
        account.setBalance(request.getBalance() != null ? request.getBalance() : BigDecimal.ZERO);
        account.setIcon(request.getIcon());
        account.setColor(request.getColor());
        account.setBookType(request.getBookType());
        account.setIsDefault(request.getIsDefault() != null ? request.getIsDefault() : false);
        accountRepository.save(account);
        return toMap(account);
    }

    @Override
    @Transactional
    public Map<String, Object> updateAccount(String userId, String id, AccountUpdateRequest request) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND, "账户不存在"));
        if (!account.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        if (request.getName() != null) account.setName(request.getName());
        if (request.getBalance() != null) account.setBalance(request.getBalance());
        if (request.getIcon() != null) account.setIcon(request.getIcon());
        if (request.getColor() != null) account.setColor(request.getColor());
        if (request.getIsDefault() != null) account.setIsDefault(request.getIsDefault());
        accountRepository.save(account);
        return toMap(account);
    }

    @Override
    @Transactional
    public void deleteAccount(String userId, String id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND, "账户不存在"));
        if (!account.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        accountRepository.delete(account);
    }

    private Map<String, Object> toMap(Account a) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", a.getId());
        map.put("name", a.getName());
        map.put("balance", a.getBalance());
        map.put("icon", a.getIcon());
        map.put("color", a.getColor());
        map.put("bookType", a.getBookType());
        map.put("isDefault", a.getIsDefault());
        map.put("createdAt", a.getCreatedAt() != null ? a.getCreatedAt().toString() : null);
        return map;
    }
}
