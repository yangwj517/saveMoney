package com.zanqian.savemoney.service;

import com.zanqian.savemoney.dto.UserProfileUpdateRequest;
import java.util.Map;

/**
 * 用户服务接口
 *
 * 定义用户相关的业务逻辑
 */
public interface UserService {
    /**
     * 获取用户资料
     *
     * @param userId 用户ID
     * @return 用户资料信息
     */
    Map<String, Object> getProfile(String userId);

    /**
     * 更新用户资料
     *
     * @param userId 用户ID
     * @param request 更新请求
     * @return 更新后的用户资料
     */
    Map<String, Object> updateProfile(String userId, UserProfileUpdateRequest request);

    /**
     * 上传用户头像
     *
     * @param userId 用户ID
     * @param originalFilename 原始文件名
     * @param fileContent 文件内容
     * @return 上传结果，包含头像URL
     */
    Map<String, Object> uploadAvatar(String userId, String originalFilename, byte[] fileContent);
}
