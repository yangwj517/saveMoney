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
    @Value("${app.sms.expire-seconds:300}")
    private int smsExpireSeconds;

    public AuthServiceImpl(SmsCodeRepository smsCodeRepository,
                           UserRepository userRepository,
                           JwtUtil jwtUtil) {
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
        System.out.println("[DEBUG] sendSmsCode called with phone: " + phone);
            
        // 验证手机号格式
        validatePhone(phone);
    
        // 生成 6 位数字验证码
        String code = String.format("%06d", SECURE_RANDOM.nextInt(1000000));
        System.out.println("[DEBUG] Generated SMS code: " + code + " for phone: " + phone);
    
        // 创建并保存短信验证码记录
        SmsCode smsCode = new SmsCode();
        smsCode.setPhone(phone);
        smsCode.setCode(code);
        smsCode.setExpireAt(Instant.now().plusSeconds(smsExpireSeconds));
        smsCode.setUsed(false);
            
        System.out.println("[DEBUG] Saving SMS code to database...");
        smsCodeRepository.save(smsCode);
        System.out.println("[DEBUG] SMS code saved successfully with ID: " + smsCode.getId());
    
        // TODO: 调用短信服务发送验证码
        // smsService.sendSms(phone, code);
    
        // 返回过期时间信息
        Map<String, Object> result = new HashMap<>();
        result.put("expireIn", smsExpireSeconds);
        System.out.println("[DEBUG] sendSmsCode completed, returning expireIn: " + smsExpireSeconds);
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
        validatePhone(phone);

        // 查询最新的未使用验证码
        SmsCode smsCode = smsCodeRepository.findFirstByPhoneAndUsedFalseOrderByExpireAtDesc(phone)
                .orElseThrow(() -> new BusinessException(ErrorCode.PARAM_ERROR, "验证码错误或不存在"));

        // 检查验证码是否已过期
        if (smsCode.getExpireAt().isBefore(Instant.now())) {
            throw new BusinessException(ErrorCode.PARAM_ERROR, "验证码已过期，请重新获取");
        }

        // 验证码是否正确
        if (!smsCode.getCode().equals(code)) {
            throw new BusinessException(ErrorCode.PARAM_ERROR, "验证码错误");
        }

        // 标记验证码为已使用
        smsCode.setUsed(true);
        smsCodeRepository.save(smsCode);

        // 查找已有用户或创建新用户
        User user = findOrCreateUser(phone);

        // 生成 access token 和 refresh token
        String token = jwtUtil.generateToken(user.getId());
        String refreshToken = jwtUtil.generateRefreshToken(user.getId());

        // 构建返回结果
        return buildLoginResponse(user, token, refreshToken);
    }

    /**
     * 刷新令牌
     *
     * 使用 refresh token 生成新的 access token
     *
     * @param refreshToken 刷新令牌
     * @return 包含新token和过期时间的Map
     * @throws BusinessException 如果刷新令牌已过期或无效
     */
    @Override
    public Map<String, Object> refreshToken(String refreshToken) {
        // 验证 refresh token 是否有效
        if (!jwtUtil.validateToken(refreshToken)) {
            throw new BusinessException(ErrorCode.TOKEN_EXPIRED, "刷新令牌已过期");
        }

        // 从 refresh token 中提取用户ID
        String userId = jwtUtil.getUserIdFromToken(refreshToken);

        // 验证用户是否存在
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND, "用户不存在"));

        // 生成新的 access token
        String newToken = jwtUtil.generateToken(userId);

        // 构建返回结果
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("token", newToken);
        result.put("expiresIn", jwtUtil.getExpiration());
        result.put("refreshToken", refreshToken); // 返回相同的refresh token
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
        // TODO: 可以记录用户登出日志
    }

    /**
     * 验证手机号格式
     *
     * @param phone 手机号
     * @throws BusinessException 如果手机号格式错误
     */
    private void validatePhone(String phone) {
        if (phone == null || phone.trim().isEmpty()) {
            throw new BusinessException(ErrorCode.PARAM_ERROR, "手机号不能为空");
        }

        // 简单的手机号格式验证（11位数字，以1开头）
        if (!phone.matches("^1[3-9]\\d{9}$")) {
            throw new BusinessException(ErrorCode.PARAM_ERROR, "手机号格式错误");
        }
    }

    /**
     * 查找或创建用户
     *
     * @param phone 手机号
     * @return 用户对象
     */
    private User findOrCreateUser(String phone) {
        return userRepository.findByPhone(phone).orElseGet(() -> {
            User newUser = new User();
            newUser.setPhone(phone);
            // 默认昵称为 "用户" + 手机号后4位
            newUser.setNickname("用户" + phone.substring(phone.length() - 4));
            newUser.setAvatar("https://cdn.zanqian.app/avatar/default.png");
            return userRepository.save(newUser);
        });
    }

    /**
     * 构建登录响应
     *
     * @param user 用户对象
     * @param token access token
     * @param refreshToken refresh token
     * @return 登录响应Map
     */
    private Map<String, Object> buildLoginResponse(User user, String token, String refreshToken) {
        // 对手机号进行脱敏处理（隐藏中间4位）
        String maskedPhone = maskPhone(user.getPhone());

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
     * 手机号脱敏处理
     *
     * @param phone 原始手机号
     * @return 脱敏后的手机号（138****1234）
     */
    private String maskPhone(String phone) {
        if (phone == null || phone.length() < 11) {
            return phone;
        }
        return phone.substring(0, 3) + "****" + phone.substring(phone.length() - 4);
    }
}