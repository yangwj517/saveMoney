package com.zanqian.savemoney.dto;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 账户更新请求DTO
 */
@Data
public class AccountUpdateRequest {
    /** 账户名称 */
    private String name;

    /** 账户余额 */
    private BigDecimal balance;

    /** 账户图标 */
    private String icon;

    /** 账户颜色 */
    private String color;

    /** 是否设为默认账户 */
    private Boolean isDefault;
}
