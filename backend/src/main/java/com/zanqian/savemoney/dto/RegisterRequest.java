package com.zanqian.savemoney.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 注册请求 DTO
 */
@Data
public class RegisterRequest {
    /** 手机号，必填 */
    @NotBlank(message = "手机号不能为空")
    private String phone;

    /** 密码，必填 */
    @NotBlank(message = "密码不能为空")
    private String password;

    /** 短信验证码，必填 */
    @NotBlank(message = "验证码不能为空")
    private String code;
}
