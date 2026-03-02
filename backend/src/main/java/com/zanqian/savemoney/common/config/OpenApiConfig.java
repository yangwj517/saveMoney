package com.zanqian.savemoney.common.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * SpringDoc OpenAPI 配置
 *
 * 配置 Swagger UI API 文档，包括：
 * - 文档基本信息（标题、描述、版本）
 * - JWT Bearer Token 认证方案（在 Swagger UI 中点击 Authorize 即可输入 token 测试需认证的接口）
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("攒钱记账 API")
                        .description("攒钱记账应用后端接口文档。\n\n"
                                + "**使用方法：**\n"
                                + "1. 先调用 `/auth/sms/send` 发送验证码\n"
                                + "2. 再调用 `/auth/login/phone` 登录获取 token\n"
                                + "3. 点击右上角 **Authorize** 按钮，输入 `Bearer <token>`\n"
                                + "4. 即可测试所有需要认证的接口")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("攒钱团队")
                                .email("support@zanqian.app")))
                .addSecurityItem(new SecurityRequirement().addList("Bearer Token"))
                .components(new Components()
                        .addSecuritySchemes("Bearer Token",
                                new SecurityScheme()
                                        .name("Authorization")
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("输入你的 JWT token（不需要加 Bearer 前缀）")));
    }
}

