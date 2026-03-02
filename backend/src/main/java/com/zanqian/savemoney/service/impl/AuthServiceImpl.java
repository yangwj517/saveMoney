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

/**
 * 认证业务实现类
 *
 * 实现用户认证相关的业务逻辑：
 * - 发送短信验证码
 * - 通过手机号和验证码登录
 * - 刷新JWT令牌
 * - 用户登出
 */
@Service
public class AuthServiceImpl implements AuthService {

    /** 安全随机数生成器，用于生成验证码 */
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final SmsCodeRepository smsCodeRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    /** 短信验证码过期时间（秒），从配置文件注入 */
    @Value("${app.sms.expire-seconds}")
    private int smsExpireSeconds;

    public AuthServiceImpl(SmsCodeRepository smsCodeRepository, UserRepository userRepository, JwtUtil jwtUtil) {
        this.smsCodeRepository = smsCodeRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    /**
     * 发送短信验证码
     *
     * 流程：
     * 1. 生成6位随机验证码
     * 2. 保存验证码记录到数据库，设置过期时间
     * 3. 返回验证码过期时间
     *
     * @param phone 手机号
     * @return 包含过期时间的Map
     */
    @Override
    @Transactional
    public Map<String, Object> sendSmsCode(String phone) {
        // 生成6位数字验证码
        String code = String.format("%06d", SECURE_RANDOM.nextInt(1000000));

        // 创建并保存短信验证码记录
        SmsCode smsCode = new SmsCode();
        smsCode.setPhone(phone);
        smsCode.setCode(code);
        smsCode.setExpireAt(Instant.now().plusSeconds(smsExpireSeconds));
        smsCode.setUsed(false);
        smsCodeRepository.save(smsCode);

        // 返回过期时间信息
        Map<String, Object> result = new HashMap<>();
        result.put("expireIn", smsExpireSeconds);
        return result;
    }

    /**
     * 使用手机号和验证码登录
     *
     * 流程：
     * 1. 验证手机号格式
     * 2. 从数据库查询未使用的验证码
     * 3. 验证码存在性、有效期、正确性验证
     * 4. 标记验证码为已使用
     * 5. 查找或创建用户
     * 6. 生成 access token 和 refresh token
     * 7. 返回用户信息和token
     *
     * @param phone 手机号
     * @param code 验证码
     * @return 包含token、refreshToken、用户信息的Map
     * @throws BusinessException 如果手机号格式错误、验证码错误或已过期
     */
    @Override
    @Transactional
    public Map<String, Object> loginByPhone(String phone, String code) {
        // 验证手机号格式
        if (phone == null || phone.length() < 7) {
            throw new BusinessException(ErrorCode.PARAM_ERROR, "手机号格式错误");
        }

        // 查询最新的未使用验证码
        SmsCode smsCode = smsCodeRepository.findFirstByPhoneAndUsedFalseOrderByExpireAtDesc(phone)
                .orElseThrow(() -> new BusinessException(ErrorCode.PARAM_ERROR, "验证码错误"));

        // 检查验证码是否已过期
        if (smsCode.getExpireAt().isBefore(Instant.now())) {
            throw new BusinessException(ErrorCode.PARAM_ERROR, "验证码已过期");
        }

        // 验证码是否正确
        if (!smsCode.getCode().equals(code)) {
            throw new BusinessException(ErrorCode.PARAM_ERROR, "验证码错误");
        }

        // 标记验证码为已使用
        smsCode.setUsed(true);
        smsCodeRepository.save(smsCode);

        // 查找已有用户或创建新用户
        User user = userRepository.findByPhone(phone).orElseGet(() -> {
            User newUser = new User();
            newUser.setPhone(phone);
            // 默认昵称为 "用户" + 手机号后6位
            newUser.setNickname("用户" + phone.substring(phone.length() - 6));
            newUser.setAvatar("https://cdn.zanqian.app/avatar/default.png");
            return userRepository.save(newUser);
        });

        // 生成 access token 和 refresh token
        String token = jwtUtil.generateToken(user.getId());
        String refreshToken = jwtUtil.generateRefreshToken(user.getId());

        // 对手机号进行脱敏处理（隐藏中间4位）
        String maskedPhone = phone.substring(0, 3) + "****" + phone.substring(phone.length() - 4);

        // 构建用户信息Map
        Map<String, Object> userData = new LinkedHashMap<>();
        userData.put("id", user.getId());
        userData.put("nickname", user.getNickname());
        userData.put("avatar", user.getAvatar());
        userData.put("phone", maskedPhone);
        userData.put("email", user.getEmail());
        userData.put("createdAt", user.getCreatedAt() != null ? user.getCreatedAt().toString() : null);

        // 构建返回结果
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("token", token);
        result.put("refreshToken", refreshToken);
        result.put("expiresIn", jwtUtil.getExpiration());
        result.put("user", userData);
        return result;
    }

    /**
     * 刷新令牌
     *
     * 使用 refresh token 生成新的 access token
     *
     * 流程：
     * 1. 验证 refresh token 的有效性
     * 2. 从 refresh token 中提取用户ID
     * 3. 生成新的 access token
     * 4. 返回新的token和过期时间
     *
     * @param refreshToken 刷新令牌
     * @return 包含新token和过期时间的Map
     * @throws BusinessException 如果刷新令牌已过期或无效
     */
    @Override
    public Map<String, Object> refreshToken(String refreshToken) {
        // 验证 refresh token 是否有效
        if (!jwtUtil.validateToken(refreshToken)) {
            throw new BusinessException(ErrorCode.TOKEN_EXPIRED);
        }

        // 从 refresh token 中提取用户ID
        String userId = jwtUtil.getUserIdFromToken(refreshToken);
        // 生成新的 access token
        String newToken = jwtUtil.generateToken(userId);

        // 构建返回结果
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("token", newToken);
        result.put("expiresIn", jwtUtil.getExpiration());
        return result;
    }

    /**
     * 用户登出
     *
     * 注意：由于采用无状态JWT认证方式，登出在客户端处理
     * token在过期前仍然有效，可以考虑在生产环境中维护token黑名单
     *
     * @param userId 用户ID
     */
    @Override
    public void logout(String userId) {
        // 在无状态JWT方式中，登出在客户端处理（删除本地存储的token）
        // 如需实现服务端登出，可考虑维护token黑名单机制
    }
}

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
