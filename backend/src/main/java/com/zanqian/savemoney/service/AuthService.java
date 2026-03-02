package com.zanqian.savemoney.service;

import java.util.Map;

/**
 * 认证服务接口
 *
 * 定义用户认证相关的业务逻辑
 */
public interface AuthService {
    /**
     * 发送短信验证码
     *
     * @param phone 手机号
     * @return 发送结果
     */
    Map<String, Object> sendSmsCode(String phone);

    /**
     * 使用手机号和验证码登录
     *
     * @param phone 手机号
     * @param code 验证码
     * @return 登录结果，包含 access token 和 refresh token
     */
    Map<String, Object> loginByPhone(String phone, String code);

    /**
     * 刷新 access token
     *
     * @param refreshToken 刷新令牌
     * @return 新的 token 信息
     */
    Map<String, Object> refreshToken(String refreshToken);

    /**
     * 用户登出
     *
     * @param userId 用户ID
     */
    void logout(String userId);
}
