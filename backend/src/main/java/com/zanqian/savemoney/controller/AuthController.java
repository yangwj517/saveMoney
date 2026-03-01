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

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/sms/send")
    public ApiResponse<Map<String, Object>> sendSms(@Valid @RequestBody SmsSendRequest request) {
        return ApiResponse.success(authService.sendSmsCode(request.getPhone()));
    }

    @PostMapping("/login/phone")
    public ApiResponse<Map<String, Object>> loginByPhone(@Valid @RequestBody PhoneLoginRequest request) {
        return ApiResponse.success(authService.loginByPhone(request.getPhone(), request.getCode()));
    }

    @PostMapping("/token/refresh")
    public ApiResponse<Map<String, Object>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        return ApiResponse.success(authService.refreshToken(request.getRefreshToken()));
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout() {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        authService.logout(userId);
        return ApiResponse.success();
    }
}
