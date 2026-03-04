package com.zanqian.savemoney.service.impl;

import com.zanqian.savemoney.common.ErrorCode;
import com.zanqian.savemoney.common.exception.BusinessException;
import com.zanqian.savemoney.entity.User;
import com.zanqian.savemoney.repository.UserRepository;
import com.zanqian.savemoney.service.UserService;
import com.zanqian.savemoney.dto.UserProfileUpdateRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

/**
 * 用户业务实现类
 *
 * 实现用户相关的业务逻辑：
 * - 获取用户资料
 * - 更新用户资料
 * - 上传用户头像
 */
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    /** 文件上传URL前缀，从配置文件注入 */
    @Value("${app.upload.url-prefix}")
    private String uploadUrlPrefix;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * 获取用户资料
     *
     * @param userId 用户ID
     * @return 用户资料信息（手机号已脱敏）
     * @throws BusinessException 如果用户不存在
     */
    @Override
    public Map<String, Object> getProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND, "用户不存在"));

        return toUserMap(user);
    }

    /**
     * 更新用户资料
     *
     * 支持部分更新：昵称、头像、邮箱
     *
     * @param userId 用户ID
     * @param request 包含更新信息的请求（允许为null的字段）
     * @return 更新后的用户资料
     * @throws BusinessException 如果用户不存在
     */
    @Override
    public Map<String, Object> updateProfile(String userId, UserProfileUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND, "用户不存在"));

        // 选择性更新用户信息（只更新非null的字段）
        if (request.getNickname() != null) {
            user.setNickname(request.getNickname());
        }
        if (request.getAvatar() != null) {
            user.setAvatar(request.getAvatar());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        userRepository.save(user);

        return toUserMap(user);
    }

    /**
     * 上传用户头像
     *
     * 生成唯一的URL并返回，实际的文件保存需要由其他服务处理
     * 这里只是生成了虚拟URL用于演示，生产环境需要对接真实的文件存储服务
     *
     * @param userId 用户ID
     * @param originalFilename 原始文件名
     * @param fileContent 文件内容（二进制）
     * @return 包含头像URL的Map
     */
    @Override
    public Map<String, Object> uploadAvatar(String userId, String originalFilename, byte[] fileContent) {
        // 提取文件后缀名
        String ext = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            ext = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        // 生成唯一的URL（使用UUID保证文件名唯一性）
        String url = uploadUrlPrefix + "/avatar/" + UUID.randomUUID() + ext;

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("url", url);
        return result;
    }

    /**
     * 将User实体转换为Map格式
     *
     * 包含字段：id、nickname、avatar、phone（脱敏）、email、createdAt
     * 手机号脱敏规则：隐藏中间4位（示例：136****8888）
     *
     * @param user 用户实体
     * @return 用户信息Map
     */
    private Map<String, Object> toUserMap(User user) {
        // 对手机号进行脱敏处理
        String maskedPhone = null;
        if (user.getPhone() != null && user.getPhone().length() >= 7) {
            maskedPhone = user.getPhone().substring(0, 3) + "****" + user.getPhone().substring(user.getPhone().length() - 4);
        }

        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", user.getId());
        map.put("nickname", user.getNickname());
        map.put("avatar", user.getAvatar());
        map.put("phone", maskedPhone);
        map.put("email", user.getEmail());
        map.put("createdAt", user.getCreatedAt() != null ? user.getCreatedAt().toString() : null);
        return map;
    }
}
