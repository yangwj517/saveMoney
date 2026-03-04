package com.zanqian.savemoney.controller;

import com.zanqian.savemoney.common.ApiResponse;
import com.zanqian.savemoney.dto.UserProfileUpdateRequest;
import com.zanqian.savemoney.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

/**
 * 用户控制器
 *
 * 处理用户相关操作：
 * - 获取用户资料
 * - 更新用户资料
 * - 上传用户头像
 */
@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * 获取用户资料
     *
     * 获取当前登录用户的个人信息
     *
     * @return 用户资料信息
     */
    @GetMapping("/profile")
    public ApiResponse<Map<String, Object>> getProfile() {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(userService.getProfile(userId));
    }

    /**
     * 更新用户资料
     *
     * 更新当前用户的个人信息（如昵称、邮箱等）
     *
     * @param request 包含更新信息的请求
     * @return 更新后的用户资料
     */
    @PutMapping("/profile")
    public ApiResponse<Map<String, Object>> updateProfile(@Valid @RequestBody UserProfileUpdateRequest request) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(userService.updateProfile(userId, request));
    }

    /**
     * 上传用户头像
     *
     * 上传用户头像文件
     *
     * @param file 头像文件
     * @return 上传结果及文件访问地址
     * @throws IOException IO 异常
     */
    @PostMapping("/avatar/upload")
    public ApiResponse<Map<String, Object>> uploadAvatar(@RequestParam("file") MultipartFile file) throws IOException {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(userService.uploadAvatar(userId, file.getOriginalFilename(), file.getBytes()));
    }
}
