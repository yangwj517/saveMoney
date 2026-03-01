package com.zanqian.savemoney.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class BudgetRequest {
    private String categoryId;

    @NotNull(message = "预算金额不能为空")
    @Positive(message = "预算金额必须大于0")
    private BigDecimal amount;

    @NotBlank(message = "预算周期不能为空")
    private String period;

    @NotBlank(message = "账本类型不能为空")
    private String bookType;

    private Integer alertThreshold;
    private Boolean isAlertEnabled;
}
