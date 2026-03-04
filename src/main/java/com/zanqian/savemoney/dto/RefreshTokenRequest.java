package com.zanqian.savemoney.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Token刷新请求DTO
 */
@Data
public class RefreshTokenRequest {
    /** 刷新令牌，必填 */
    @NotBlank(message = "refreshToken不能为空")
    private String refreshToken;
}
