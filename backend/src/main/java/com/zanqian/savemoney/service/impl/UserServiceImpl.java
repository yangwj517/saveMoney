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

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Value("${app.upload.url-prefix}")
    private String uploadUrlPrefix;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Map<String, Object> getProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND, "用户不存在"));

        return toUserMap(user);
    }

    @Override
    public Map<String, Object> updateProfile(String userId, UserProfileUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND, "用户不存在"));

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

    @Override
    public Map<String, Object> uploadAvatar(String userId, String originalFilename, byte[] fileContent) {
        String ext = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            ext = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String url = uploadUrlPrefix + "/avatar/" + UUID.randomUUID() + ext;

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("url", url);
        return result;
    }

    private Map<String, Object> toUserMap(User user) {
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
