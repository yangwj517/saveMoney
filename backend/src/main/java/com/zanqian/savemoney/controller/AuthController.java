package com.zanqian.savemoney.controller;

import com.zanqian.savemoney.common.ApiResponse;
import com.zanqian.savemoney.dto.PhoneLoginRequest;
import com.zanqian.savemoney.dto.RefreshTokenRequest;
import com.zanqian.savemoney.dto.SmsSendRequest;
import com.zanqian.savemoney.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * 认证控制器
 *
 * 处理用户认证相关的操作：
 * - 发送短信验证码
 * - 使用手机号和验证码登录
 * - 刷新令牌
 * - 登出
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * 发送短信验证码
     *
     * 向指定手机号发送登录验证码
     *
     * @param request 包含手机号的请求
     * @return 返回短信发送结果
     */
    @PostMapping("/sms/send")
    public ApiResponse<Map<String, Object>> sendSms(@Valid @RequestBody SmsSendRequest request) {
        //System.out.println("[CONTROLLER] /auth/sms/send called with phone: " + request.getPhone());
        try {
            Map<String, Object> result = authService.sendSmsCode(request.getPhone());
            //System.out.println("[CONTROLLER] /auth/sms/send success, response: " + result);
            return ApiResponse.success(result);
        } catch (Exception e) {
            //System.err.println("[CONTROLLER] /auth/sms/send error: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * 手机号登录
     *
     * 使用手机号和短信验证码进行登录
     * 返回 access token 和 refresh token
     *
     * @param request 包含手机号和验证码的请求
     * @return 返回登录结果及 token 信息
     */
    @PostMapping("/login/phone")
    public ApiResponse<Map<String, Object>> loginByPhone(@Valid @RequestBody PhoneLoginRequest request) {
        return ApiResponse.success(authService.loginByPhone(request.getPhone(), request.getCode()));
    }

    /**
     * 刷新令牌
     *
     * 使用 refresh token 获取新的 access token
     * 当 access token 过期时使用此接口续期
     *
     * @param request 包含 refresh token 的请求
     * @return 返回新的 token 信息
     */
    @PostMapping("/token/refresh")
    public ApiResponse<Map<String, Object>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        return ApiResponse.success(authService.refreshToken(request.getRefreshToken()));
    }

    /**
     * 登出
     *
     * 清除用户登录信息，使 token 失效
     *
     * @return 登出成功响应
     */
    @PostMapping("/logout")
    public ApiResponse<Void> logout() {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        authService.logout(userId);
        return ApiResponse.success();
    }
}
