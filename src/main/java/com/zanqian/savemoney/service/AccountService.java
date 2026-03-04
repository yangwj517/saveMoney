package com.zanqian.savemoney.service;

import com.zanqian.savemoney.dto.AccountRequest;
import com.zanqian.savemoney.dto.AccountUpdateRequest;
import java.util.List;
import java.util.Map;

/**
 * 账户服务接口
 *
 * 定义账户管理相关的业务逻辑
 */
public interface AccountService {
    /**
     * 获取账户列表
     *
     * @param userId 用户ID
     * @param bookType 账簿类型
     * @return 账户列表
     */
    List<Map<String, Object>> getAccounts(String userId, String bookType);

    /**
     * 创建账户
     *
     * @param userId 用户ID
     * @param request 创建请求
     * @return 创建后的账户信息
     */
    Map<String, Object> createAccount(String userId, AccountRequest request);

    /**
     * 更新账户
     *
     * @param userId 用户ID
     * @param id 账户ID
     * @param request 更新请求
     * @return 更新后的账户信息
     */
    Map<String, Object> updateAccount(String userId, String id, AccountUpdateRequest request);

    /**
     * 删除账户
     *
     * @param userId 用户ID
     * @param id 账户ID
     */
    void deleteAccount(String userId, String id);
}
