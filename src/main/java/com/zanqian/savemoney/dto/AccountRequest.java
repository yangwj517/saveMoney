package com.zanqian.savemoney.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.math.BigDecimal;

/**
 * 账户创建请求DTO
 */
@Data
public class AccountRequest {
    /** 账户名称，必填 */
    @NotBlank(message = "账户名称不能为空")
    private String name;

    /** 初始余额 */
    private BigDecimal balance;

    /** 账户图标 */
    private String icon;

    /** 账户颜色 */
    private String color;

    /** 账簿类型，必填 */
    @NotBlank(message = "账本类型不能为空")
    private String bookType;

    /** 是否设为默认账户 */
    private Boolean isDefault;
}
