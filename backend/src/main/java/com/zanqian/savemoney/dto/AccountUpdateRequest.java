package com.zanqian.savemoney.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class AccountUpdateRequest {
    private String name;
    private BigDecimal balance;
    private String icon;
    private String color;
    private Boolean isDefault;
}
