package com.zanqian.savemoney.service;

import com.zanqian.savemoney.dto.UserProfileUpdateRequest;
import java.util.Map;

public interface UserService {
    Map<String, Object> getProfile(String userId);
    Map<String, Object> updateProfile(String userId, UserProfileUpdateRequest request);
    Map<String, Object> uploadAvatar(String userId, String originalFilename, byte[] fileContent);
}
