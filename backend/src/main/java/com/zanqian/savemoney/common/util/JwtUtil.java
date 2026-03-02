package com.zanqian.savemoney.common.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JWT 工具类
 *
 * 提供 JWT Token 的生成、验证和信息提取等功能
 * 支持 access token 和 refresh token 两种 token 类型
 */
@Component
public class JwtUtil {

    /** JWT 签名秘钥，从配置文件中读取 */
    @Value("${app.jwt.secret}")
    private String secret;

    /** 访问令牌过期时间（秒） */
    @Value("${app.jwt.expiration}")
    private long expiration;

    /** 刷新令牌过期时间（秒） */
    @Value("${app.jwt.refresh-expiration}")
    private long refreshExpiration;

    /**
     * 获取签名密钥
     *
     * 使用 HMAC-SHA256 算法，密钥由配置的秘钥转换而来
     *
     * @return 签名密钥
     */
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * 生成访问令牌（Access Token）
     *
     * 该 token 用于验证用户身份，在每次请求时携带
     *
     * @param userId 用户ID，作为 token 的主题
     * @return JWT access token
     */
    public String generateToken(String userId) {
        return Jwts.builder()
                .subject(userId)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration * 1000))
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * 生成刷新令牌（Refresh Token）
     *
     * 该 token 用于获取新的 access token，有效期更长
     * 包含 type=refresh 标识作为刷新令牌
     *
     * @param userId 用户ID，作为 token 的主题
     * @return JWT refresh token
     */
    public String generateRefreshToken(String userId) {
        return Jwts.builder()
                .subject(userId)
                .claim("type", "refresh")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + refreshExpiration * 1000))
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * 从 Token 中提取用户ID
     *
     * @param token JWT token
     * @return 用户ID
     */
    public String getUserIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getSubject();
    }

    /**
     * 验证 Token 的合法性和有效性
     *
     * 检查 token 的签名是否有效，过期时间是否超期
     *
     * @param token JWT token
     * @return true 表示 token 有效，false 表示 token 无效或已过期
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            // token 已过期
            return false;
        } catch (Exception e) {
            // token 无效或其他错误
            return false;
        }
    }

    /**
     * 获取 Access Token 的过期时间（秒）
     *
     * @return access token 有效期长度（秒）
     */
    public long getExpiration() {
        return expiration;
    }
}
