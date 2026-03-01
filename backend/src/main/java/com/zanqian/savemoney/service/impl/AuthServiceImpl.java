package com.zanqian.savemoney.service.impl;

import com.zanqian.savemoney.common.ErrorCode;
import com.zanqian.savemoney.common.exception.BusinessException;
import com.zanqian.savemoney.common.util.JwtUtil;
import com.zanqian.savemoney.entity.SmsCode;
import com.zanqian.savemoney.entity.User;
import com.zanqian.savemoney.repository.SmsCodeRepository;
import com.zanqian.savemoney.repository.UserRepository;
import com.zanqian.savemoney.service.AuthService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class AuthServiceImpl implements AuthService {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final SmsCodeRepository smsCodeRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Value("${app.sms.expire-seconds}")
    private int smsExpireSeconds;

    public AuthServiceImpl(SmsCodeRepository smsCodeRepository, UserRepository userRepository, JwtUtil jwtUtil) {
        this.smsCodeRepository = smsCodeRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @Override
    @Transactional
    public Map<String, Object> sendSmsCode(String phone) {
        // Generate a 6-digit code
        String code = String.format("%06d", SECURE_RANDOM.nextInt(1000000));

        SmsCode smsCode = new SmsCode();
        smsCode.setPhone(phone);
        smsCode.setCode(code);
        smsCode.setExpireAt(Instant.now().plusSeconds(smsExpireSeconds));
        smsCode.setUsed(false);
        smsCodeRepository.save(smsCode);

        Map<String, Object> result = new HashMap<>();
        result.put("expireIn", smsExpireSeconds);
        return result;
    }

    @Override
    @Transactional
    public Map<String, Object> loginByPhone(String phone, String code) {
        if (phone == null || phone.length() < 7) {
            throw new BusinessException(ErrorCode.PARAM_ERROR, "手机号格式错误");
        }

        // Verify SMS code
        SmsCode smsCode = smsCodeRepository.findFirstByPhoneAndUsedFalseOrderByExpireAtDesc(phone)
                .orElseThrow(() -> new BusinessException(ErrorCode.PARAM_ERROR, "验证码错误"));

        if (smsCode.getExpireAt().isBefore(Instant.now())) {
            throw new BusinessException(ErrorCode.PARAM_ERROR, "验证码已过期");
        }

        if (!smsCode.getCode().equals(code)) {
            throw new BusinessException(ErrorCode.PARAM_ERROR, "验证码错误");
        }

        // Mark code as used
        smsCode.setUsed(true);
        smsCodeRepository.save(smsCode);

        // Find or create user
        User user = userRepository.findByPhone(phone).orElseGet(() -> {
            User newUser = new User();
            newUser.setPhone(phone);
            newUser.setNickname("用户" + phone.substring(phone.length() - 6));
            newUser.setAvatar("https://cdn.zanqian.app/avatar/default.png");
            return userRepository.save(newUser);
        });

        // Generate tokens
        String token = jwtUtil.generateToken(user.getId());
        String refreshToken = jwtUtil.generateRefreshToken(user.getId());

        // Mask phone number
        String maskedPhone = phone.substring(0, 3) + "****" + phone.substring(phone.length() - 4);

        Map<String, Object> userData = new LinkedHashMap<>();
        userData.put("id", user.getId());
        userData.put("nickname", user.getNickname());
        userData.put("avatar", user.getAvatar());
        userData.put("phone", maskedPhone);
        userData.put("email", user.getEmail());
        userData.put("createdAt", user.getCreatedAt() != null ? user.getCreatedAt().toString() : null);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("token", token);
        result.put("refreshToken", refreshToken);
        result.put("expiresIn", jwtUtil.getExpiration());
        result.put("user", userData);
        return result;
    }

    @Override
    public Map<String, Object> refreshToken(String refreshToken) {
        if (!jwtUtil.validateToken(refreshToken)) {
            throw new BusinessException(ErrorCode.TOKEN_EXPIRED);
        }

        String userId = jwtUtil.getUserIdFromToken(refreshToken);
        String newToken = jwtUtil.generateToken(userId);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("token", newToken);
        result.put("expiresIn", jwtUtil.getExpiration());
        return result;
    }

    @Override
    public void logout(String userId) {
        // In a stateless JWT approach, logout is handled client-side
        // For a more robust implementation, we could maintain a token blacklist
    }
}
