package com.zanqian.savemoney.common.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zanqian.savemoney.common.ApiResponse;
import com.zanqian.savemoney.common.ErrorCode;
import com.zanqian.savemoney.common.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 * JWT 认证过滤器
 *
 * 拦截每个请求，从请求头中获取 JWT token，进行验证和解析
 * 如果验证成功，将用户信息设置到 Spring Security 的上下文中
 * 允许请求继续执行，否则返回未授权错误
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    /** JWT 工具类 */
    private final JwtUtil jwtUtil;

    /** JSON 对象映射器 */
    private final ObjectMapper objectMapper;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, ObjectMapper objectMapper) {
        this.jwtUtil = jwtUtil;
        this.objectMapper = objectMapper;
    }

    /**
     * 过滤器核心方法，在每个请求时执行一次
     *
     * 执行流程：
     * 1. 从请求头中提取 JWT token
     * 2. 如果存在 token，则验证其有效性
     * 3. 若有效，从 token 中提取用户ID并设置到 Security Context
     * 4. 若失效，返回 token 过期错误
     * 5. 继续过滤链
     *
     * @param request HTTP 请求
     * @param response HTTP 响应
     * @param filterChain 过滤器链
     * @throws ServletException Servlet 异常
     * @throws IOException IO 异常
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String path = request.getServletPath();

        // OPTIONS 预检请求直接放行（CORS）
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        // 公开接口直接放行，不做 JWT 校验
        if (path.startsWith("/auth/sms/send")
                || path.startsWith("/auth/login/phone")
                || path.startsWith("/auth/token/refresh")
                || path.startsWith("/auth/login/password")  // ✅ 添加密码登录
                || path.startsWith("/auth/register")         // ✅ 添加注册
                || path.startsWith("/swagger-ui")
                || path.startsWith("/v3/api-docs")
                || path.equals("/swagger-ui.html")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 从请求头中提取 token
        String token = extractToken(request);
        
        logger.debug("JWT Filter - Request path: " + path);
        logger.debug("JWT Filter - Token present: " + (token != null));
        if (token != null) {
            logger.debug("JWT Filter - Token starts with: " + token.substring(0, Math.min(20, token.length())));
        }
        
        if (StringUtils.hasText(token)) {
            boolean isValid = jwtUtil.validateToken(token);
            logger.debug("JWT Filter - Token valid: " + isValid);
                    
            if (isValid) {
                // token 有效，提取用户 ID 并设置到 Security Context
                String userId = jwtUtil.getUserIdFromToken(token);
                logger.debug("JWT Filter - User ID from token: " + userId);
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userId, null, Collections.emptyList());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } else {
                // token 已过期或无效，返回错误响应
                logger.warn("JWT Filter - Token invalid or expired for path: " + path);
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write(objectMapper.writeValueAsString(
                        ApiResponse.error(ErrorCode.TOKEN_REFRESH.getCode(), ErrorCode.TOKEN_REFRESH.getMessage())));
                return;
            }
        } else {
            logger.warn("JWT Filter - No token found in request for path: " + path);
        }

        // 继续执行过滤链
        filterChain.doFilter(request, response);
    }

    /**
     * 从 HTTP 请求头中提取 JWT token
     *
     * 从 Authorization 请求头中读取 "Bearer <token>" 格式的 token
     *
     * @param request HTTP 请求
     * @return 提取的 token，如果不存在则返回 null
     */
    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
