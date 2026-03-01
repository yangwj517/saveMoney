package com.zanqian.savemoney.service;

import java.util.Map;

public interface AuthService {
    Map<String, Object> sendSmsCode(String phone);
    Map<String, Object> loginByPhone(String phone, String code);
    Map<String, Object> refreshToken(String refreshToken);
    void logout(String userId);
}
