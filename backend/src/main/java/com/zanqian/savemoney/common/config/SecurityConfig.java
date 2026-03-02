package com.zanqian.savemoney.common.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zanqian.savemoney.common.ApiResponse;
import com.zanqian.savemoney.common.ErrorCode;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security 安全配置
 *
 * 配置应用的安全策略，包括：
 * - CSRF 防护：禁用 CSRF 保护（因为使用 JWT token）
 * - 会话管理：禁用 Session，使用无状态认证
 * - 请求授权：配置哪些请求需要认证，哪些可以匿名访问
 * - 异常处理：自定义未授权异常处理器
 * - JWT 过滤器：注册自定义的 JWT 认证过滤器
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /** JWT 认证过滤器 */
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    /** JSON 对象映射器 */
    private final ObjectMapper objectMapper;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, ObjectMapper objectMapper) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.objectMapper = objectMapper;
    }

    /**
     * 配置安全过滤链
     *
     * 定义请求的安全策略和认证需求
     *
     * @param http HTTP 安全配置对象
     * @return 配置后的安全过滤链
     * @throws Exception 配置异常
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 禁用 CSRF 保护（前后端分离，使用 token 认证不需要 CSRF 防护）
                .csrf(AbstractHttpConfigurer::disable)

                // 禁用 Session，使用无状态认证（Stateless）
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 配置授权规则
                .authorizeHttpRequests(auth -> auth
                        // 允许匿名访问的端点：登录、短信发送、token 刷新
                        .requestMatchers("/auth/sms/send", "/auth/login/phone", "/auth/token/refresh").permitAll()
                        // 允许匿名访问 Swagger UI 和 OpenAPI 文档
                        .requestMatchers("/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        // 其他请求都需要认证
                        .anyRequest().authenticated()
                )

                // 自定义未授权异常处理器
                .exceptionHandling(ex -> ex.authenticationEntryPoint(authenticationEntryPoint()))


                // 在 UsernamePasswordAuthenticationFilter 之前注册 JWT 过滤器
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * 配置未授权（未登录）异常处理器
     *
     * 当用户未登录时，返回统一的 JSON 错误响应
     *
     * @return 认证入口点
     */
    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint() {
        return (request, response, authException) -> {
            // 设置响应格式和状态码
            response.setContentType("application/json;charset=UTF-8");
            response.setStatus(200);
            // 返回统一格式的错误响应
            response.getWriter().write(objectMapper.writeValueAsString(
                    ApiResponse.error(ErrorCode.UNAUTHORIZED.getCode(), ErrorCode.UNAUTHORIZED.getMessage())));
        };
    }
}
