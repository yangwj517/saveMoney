package com.zanqian.savemoney.service;

import com.zanqian.savemoney.dto.AccountRequest;
import com.zanqian.savemoney.dto.AccountUpdateRequest;
import java.util.List;
import java.util.Map;

public interface AccountService {
    List<Map<String, Object>> getAccounts(String userId, String bookType);
    Map<String, Object> createAccount(String userId, AccountRequest request);
    Map<String, Object> updateAccount(String userId, String id, AccountUpdateRequest request);
    void deleteAccount(String userId, String id);
}
