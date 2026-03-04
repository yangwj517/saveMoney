package com.zanqian.savemoney.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 密码登录请求 DTO
 */
@Data
public class PasswordLoginRequest {
    /** 手机号，必填 */
    @NotBlank(message = "手机号不能为空")
    private String phone;

    /** 密码，必填 */
    @NotBlank(message = "密码不能为空")
    private String password;
}
