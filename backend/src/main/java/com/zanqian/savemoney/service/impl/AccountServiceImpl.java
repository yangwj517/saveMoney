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

/**
 * 账户业务实现类
 *
 * 实现账户管理相关的业务逻辑：
 * - 获取账户列表
 * - 创建账户
 * - 更新账户
 * - 删除账户
 */
@Service
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;

    public AccountServiceImpl(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    /**
     * 获取账户列表
     *
     * 根据用户ID和账簿类型获取该用户的所有账户
     *
     * @param userId 用户ID
     * @param bookType 账簿类型
     * @return 账户列表
     */
    @Override
    public List<Map<String, Object>> getAccounts(String userId, String bookType) {
        List<Account> accounts = accountRepository.findByUserIdAndBookType(userId, bookType);
        return accounts.stream().map(this::toMap).collect(Collectors.toList());
    }

    /**
     * 创建账户
     *
     * 创建一个新的资金账户
     * 如果初始余额为空，默认设为 0
     * 如果默认标志为空，默认设为 false
     * 如果设置为默认账户，会自动取消该账本下其他账户的默认状态
     *
     * @param userId 用户 ID
     * @param request 账户创建请求
     * @return 创建后的账户信息
     */
    @Override
    @Transactional
    public Map<String, Object> createAccount(String userId, AccountRequest request) {
        Account account = new Account();
        account.setUserId(userId);
        account.setName(request.getName());
        // 初始余额，如果未提供则默认为 0
        account.setBalance(request.getBalance() != null ? request.getBalance() : BigDecimal.ZERO);
        account.setIcon(request.getIcon());
        account.setColor(request.getColor());
        account.setBookType(request.getBookType());
        // 是否为默认账户，如果未提供则默认为 false
        Boolean isDefault = request.getIsDefault() != null ? request.getIsDefault() : false;
            
        // 如果设置为默认账户，需要先取消该账本下其他账户的默认状态
        if (isDefault) {
            List<Account> accountsInBook = accountRepository.findByUserIdAndBookType(userId, request.getBookType());
            for (Account acc : accountsInBook) {
                if (acc.getIsDefault()) {
                    acc.setIsDefault(false);
                    accountRepository.save(acc);
                }
            }
        }
            
        account.setIsDefault(isDefault);
        accountRepository.save(account);
        return toMap(account);
    }

    /**
     * 更新账户
     *
     * 修改账户信息，需要权限验证
     * 支持部分更新，只更新非 null 的字段
     * 如果设置为默认账户，会自动取消该账本下其他账户的默认状态
     *
     * @param userId 用户 ID
     * @param id 账户 ID
     * @param request 账户更新请求
     * @return 更新后的账户信息
     * @throws BusinessException 如果账户不存在或无权操作
     */
    @Override
    @Transactional
    public Map<String, Object> updateAccount(String userId, String id, AccountUpdateRequest request) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND, "账户不存在"));
    
        // 权限验证：只能修改属于自己的账户
        if (!account.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
    
        // 如果设置为默认账户，需要先取消该账本下其他账户的默认状态
        if (request.getIsDefault() != null && request.getIsDefault()) {
            List<Account> accountsInBook = accountRepository.findByUserIdAndBookType(userId, account.getBookType());
            for (Account acc : accountsInBook) {
                if (!acc.getId().equals(id) && acc.getIsDefault()) {
                    acc.setIsDefault(false);
                    accountRepository.save(acc);
                }
            }
        }
    
        // 选择性更新账户信息
        if (request.getName() != null) account.setName(request.getName());
        if (request.getBalance() != null) account.setBalance(request.getBalance());
        if (request.getIcon() != null) account.setIcon(request.getIcon());
        if (request.getColor() != null) account.setColor(request.getColor());
        if (request.getIsDefault() != null) account.setIsDefault(request.getIsDefault());
        accountRepository.save(account);
        return toMap(account);
    }

    /**
     * 删除账户
     *
     * 删除指定的账户，需要权限验证
     *
     * @param userId 用户ID
     * @param id 账户ID
     * @throws BusinessException 如果账户不存在或无权操作
     */
    @Override
    @Transactional
    public void deleteAccount(String userId, String id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND, "账户不存在"));

        // 权限验证：只能删除属于自己的账户
        if (!account.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        accountRepository.delete(account);
    }

    /**
     * 将Account实体转换为Map格式
     *
     * @param a 账户实体
     * @return 账户信息Map
     */
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
