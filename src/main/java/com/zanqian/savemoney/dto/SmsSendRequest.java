package com.zanqian.savemoney.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 短信发送请求DTO
 */
@Data
public class SmsSendRequest {
    /** 手机号，必填 */
    @NotBlank(message = "手机号不能为空")
    private String phone;
}
