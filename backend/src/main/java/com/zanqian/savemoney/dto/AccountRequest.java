package com.zanqian.savemoney.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class AccountRequest {
    @NotBlank(message = "账户名称不能为空")
    private String name;
    private BigDecimal balance;
    private String icon;
    private String color;
    private String bookType;
    private Boolean isDefault;
}
